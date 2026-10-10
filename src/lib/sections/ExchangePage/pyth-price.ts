export const PYTH_SOL_USD_PRICE_ACCOUNT = "7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE";
export const PYTH_RECEIVER_PROGRAM_ID = "rec5EKMGg6MxZYaMdyBfgwp4d5rB9T1VQH5pJv5LtFJ";
export const PYTH_FRESH_PRICE_MAX_AGE_SECONDS = 90;
export const PYTH_DELAYED_PRICE_MAX_AGE_SECONDS = 300;

const PRICE_UPDATE_V2_DISCRIMINATOR = [34, 241, 35, 99, 157, 126, 244, 205];
const SOL_USD_FEED_ID = [
    239, 13, 139, 111, 218, 44, 235, 164, 29, 161, 93, 64, 149, 209, 218, 57, 42, 13, 47, 142, 208, 198,
    199, 188, 15, 76, 250, 200, 194, 128, 181, 109,
];
const MAX_CONFIDENCE_BPS = BigInt(100);
const BPS_DENOMINATOR = BigInt(10_000);
const ORBIS_DECIMALS = 6;

export interface PythSolUsdPrice {
    price: bigint;
    confidence: bigint;
    exponent: number;
    publishTime: number;
}

function matchesBytes(data: Uint8Array, offset: number, expected: number[]): boolean {
    return expected.every((value, index) => data[offset + index] === value);
}

function readUnsignedLE(data: Uint8Array, offset: number, length: number): bigint {
    let value = BigInt(0);
    for (let index = 0; index < length; index += 1) {
        value += BigInt(data[offset + index]) << BigInt(index * 8);
    }
    return value;
}

function readSignedLE(data: Uint8Array, offset: number, length: number): bigint {
    const unsigned = readUnsignedLE(data, offset, length);
    const bits = BigInt(length * 8);
    const signBit = BigInt(1) << (bits - BigInt(1));
    return unsigned >= signBit ? unsigned - (BigInt(1) << bits) : unsigned;
}

function pow10(exponent: number): bigint {
    let value = BigInt(1);
    for (let index = 0; index < exponent; index += 1) {
        value *= BigInt(10);
    }
    return value;
}

export function parsePythSolUsdPrice(
    data: Uint8Array,
    currentUnixTime = Math.floor(Date.now() / 1000),
    maxPriceAgeSeconds = PYTH_FRESH_PRICE_MAX_AGE_SECONDS,
): PythSolUsdPrice {
    if (data.length < 133 || !matchesBytes(data, 0, PRICE_UPDATE_V2_DISCRIMINATOR)) {
        throw new Error("Pyth SOL/USD price account has invalid data.");
    }
    if (data[40] !== 1 || !matchesBytes(data, 41, SOL_USD_FEED_ID)) {
        throw new Error("Pyth SOL/USD price is not fully verified or has the wrong feed ID.");
    }

    const price = readSignedLE(data, 73, 8);
    const confidence = readUnsignedLE(data, 81, 8);
    const exponent = Number(readSignedLE(data, 89, 4));
    const publishTimeValue = readSignedLE(data, 93, 8);
    const publishTime = Number(publishTimeValue);

    if (price <= BigInt(0) || !Number.isSafeInteger(publishTime)) {
        throw new Error("Pyth SOL/USD price is invalid.");
    }
    if (publishTime > currentUnixTime || currentUnixTime - publishTime > maxPriceAgeSeconds) {
        throw new Error("Pyth SOL/USD price is stale.");
    }
    if (confidence * BPS_DENOMINATOR > price * MAX_CONFIDENCE_BPS) {
        throw new Error("Pyth SOL/USD confidence interval is too wide.");
    }

    return { price, confidence, exponent, publishTime };
}

export function getOrbisPerSolRate(price: PythSolUsdPrice, roundUp: boolean): bigint {
    const adjustedPrice = roundUp ? price.price + price.confidence : price.price - price.confidence;
    if (adjustedPrice <= BigInt(0)) {
        throw new Error("Pyth SOL/USD price is invalid.");
    }

    const scale = price.exponent + ORBIS_DECIMALS;
    if (!Number.isSafeInteger(scale) || Math.abs(scale) > 38) {
        throw new Error("Pyth SOL/USD exponent is unsupported.");
    }

    if (scale >= 0) {
        return adjustedPrice * pow10(scale);
    }

    const divisor = pow10(-scale);
    return roundUp ? (adjustedPrice + divisor - BigInt(1)) / divisor : adjustedPrice / divisor;
}

export function getPythSolUsdValue(price: PythSolUsdPrice): number {
    const value = Number(price.price) * Math.pow(10, price.exponent);
    if (!Number.isFinite(value) || value <= 0) {
        throw new Error("Pyth SOL/USD price is outside the supported range.");
    }
    return value;
}
