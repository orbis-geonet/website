"use client";
import React, { useState, useCallback, useEffect } from "react";
import { OrbisCoin, SolanaCoin } from "./icons";
import WalletModal from "./wallet-modal";
import {
    connectWallet,
    disconnectWallet,
    executeSwap,
    fetchBalances,
    fetchBalancesByAddress,
    ConnectedWallet,
    WalletBalances,
    WalletType,
    SolanaNetwork,
} from "./wallet-connector";
import { getSolPriceUsd } from "./sol-price";
import useLocale from "@/hooks/useLocale";

const ORBIS_RATE_USD = parseFloat(process.env.NEXT_PUBLIC_ORBIS_RATE ?? "1");

const DEFAULT_NETWORK = (process.env.NEXT_PUBLIC_SOLANA_NETWORK ?? "devnet") as SolanaNetwork;

interface ExchangeWidgetProps {
    network?: SolanaNetwork;
}

const ExchangeWidget = ({ network = DEFAULT_NETWORK }: ExchangeWidgetProps) => {
    const {
        dictionary: { exchangeWidget: t },
    } = useLocale();
    const [tab, setTab] = useState<"buy" | "sell">("buy");
    const [send, setSend] = useState("0.1");
    const [receive, setReceive] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [walletLoading, setWalletLoading] = useState<WalletType | null>(null);
    const [walletError, setWalletError] = useState<string | null>(null);
    const [wallet, setWallet] = useState<ConnectedWallet | null>(null);
    const [solPriceUsd, setSolPriceUsd] = useState<number | null>(null);
    const [balances, setBalances] = useState<WalletBalances | null>(null);
    const [balancesLoading, setBalancesLoading] = useState(false);
    const [txPending, setTxPending] = useState(false);
    const [txError, setTxError] = useState<string | null>(null);
    const [txSignature, setTxSignature] = useState<string | null>(null);
    const [poolBalance, setPoolBalance] = useState<WalletBalances | null>(null);
    const [poolLoading, setPoolLoading] = useState(false);

    const buyActive = tab === "buy";

    useEffect(() => {
        getSolPriceUsd()
            .then(setSolPriceUsd)
            .catch(() => setSolPriceUsd(null));
        const id = setInterval(() => {
            getSolPriceUsd()
                .then(setSolPriceUsd)
                .catch(() => {});
        }, 60_000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET;
        if (!adminWallet) return;
        setPoolLoading(true);
        fetchBalancesByAddress(adminWallet, network)
            .then(setPoolBalance)
            .catch(() => setPoolBalance(null))
            .finally(() => setPoolLoading(false));
    }, [network]);

    const orbisPerSol = solPriceUsd !== null ? solPriceUsd / ORBIS_RATE_USD : null;

    const handleSendChange = useCallback(
        (value: string) => {
            setSend(value);
            if (!value) {
                setReceive("");
								return;
            }
            const amount = parseFloat(value) || 0;
            if (orbisPerSol === null) {
                setReceive("");
                return;
            }
            const calculatedReceive = buyActive ? (amount * orbisPerSol).toFixed(3) : (amount / orbisPerSol).toFixed(6);
            setReceive(calculatedReceive);
        },
        [buyActive, orbisPerSol],
    );

    const handleReceiveChange = useCallback(
        (value: string) => {
            setReceive(value);
            if (!value) {
                setSend("");
								return;
            }
            const amount = parseFloat(value) || 0;
            if (orbisPerSol === null) {
                setSend("");
                return;
            }
            const calculatedSend = buyActive ? (amount / orbisPerSol).toFixed(6) : (amount * orbisPerSol).toFixed(3);
            setSend(calculatedSend);
        },
        [buyActive, orbisPerSol],
    );

    useEffect(() => {
        if (!receive) {
            //Received value is initially empty but we have a send value, once we have the rate, we want to populate the receive value based on the send value
            handleSendChange(send);
        }
    }, [orbisPerSol, handleSendChange, receive, send]);

    // const receive = useMemo(() => {
    //   const amount = parseFloat(send) || 0;
    //   if (orbisPerSol === null) return "—";
    //   return buyActive
    //     ? (amount * orbisPerSol).toFixed(3)
    //     : (amount / orbisPerSol).toFixed(6);
    // }, [send, buyActive, orbisPerSol]);

    const handleTabClick = useCallback(
        (next: "buy" | "sell") => {
            setTab(next);
            setTxError(null);
            setTxSignature(null);
            if (!wallet) setModalOpen(true);
        },
        [wallet],
    );

    const loadBalances = useCallback(
        async (connected: ConnectedWallet) => {
            setBalancesLoading(true);
            try {
                const b = await fetchBalances(connected, network);
                setBalances(b);
            } catch {
                setBalances(null);
            } finally {
                setBalancesLoading(false);
            }
        },
        [network],
    );

    const handleWalletSelect = useCallback(
        async (type: WalletType) => {
            setWalletLoading(type);
            setWalletError(null);
            try {
                const connected = await connectWallet(type, network);
                setWallet(connected);
                setModalOpen(false);
                loadBalances(connected);
            } catch (err) {
                setWalletError(err instanceof Error ? err.message : t.failedToConnect);
            } finally {
                setWalletLoading(null);
            }
        },
        [network, loadBalances],
    );

    const handleDisconnect = useCallback(async () => {
        if (!wallet) return;
        try {
            await disconnectWallet(wallet);
        } catch {
        } finally {
            setWallet(null);
            setBalances(null);
            setTxError(null);
            setTxSignature(null);
        }
    }, [wallet]);

    const handleExchange = useCallback(async () => {
        if (!wallet) {
            setModalOpen(true);
            return;
        }
        const amount = parseFloat(send);
        if (!amount || amount <= 0) return;

        setTxPending(true);
        setTxError(null);
        setTxSignature(null);

        try {
            const sig = await executeSwap({
                wallet,
                direction: tab,
                sendAmount: amount,
                network,
            });
            setTxSignature(sig);
            loadBalances(wallet);
        } catch (err) {
            setTxError(err instanceof Error ? err.message : t.transactionFailed);
        } finally {
            setTxPending(false);
        }
    }, [wallet, send, tab, network, loadBalances]);

    const shortAddress = wallet ? `${wallet.address.slice(0, 4)}...${wallet.address.slice(-4)}` : null;

    const sendLabel = t.youSend;
    const getLabel = t.youGet;
    const SendIcon = buyActive ? SolanaCoin : OrbisCoin;
    const GetIcon = buyActive ? OrbisCoin : SolanaCoin;

    const amount = parseFloat(send) || 0;

    const sendUsd =
        solPriceUsd !== null && amount > 0 ? (buyActive ? amount * solPriceUsd : amount * ORBIS_RATE_USD) : null;

    const receiveUsd =
        solPriceUsd !== null && orbisPerSol !== null && amount > 0
            ? buyActive
                ? amount * orbisPerSol * ORBIS_RATE_USD
                : (amount / orbisPerSol) * solPriceUsd
            : null;

    const formatUsd = (v: number) =>
        v >= 1
            ? `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : `$${v.toFixed(4)}`;

    const isInsufficientBalance =
        wallet &&
        balances !== null &&
        amount > 0 &&
        (buyActive ? amount > balances.sol : balances.orbis !== null && amount > balances.orbis);

    const exchangeButtonLabel = txPending
        ? t.waitingConfirmation
        : !wallet
          ? t.connectWallet
          : isInsufficientBalance
            ? buyActive
                ? t.insufficientSol
                : t.insufficientOrbis
            : buyActive
              ? t.buyBtn
              : t.sellBtn;

    const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET;

    return (
        <>
            <div className="w-full max-w-[560px]">
                <div className="flex gap-4">
                    <button
                        onClick={() => handleTabClick("buy")}
                        className={`flex-1 rounded-t-2xl relative py-6 text-lg font-bold tracking-[0.05em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                            buyActive
                                ? "bg-black  text-white top-2"
                                : "rounded-b-2xl mt-[8px] border border-gray-200 bg-white text-neutral-900 hover:bg-neutral-50"
                        }`}>
                        {t.buy}
                    </button>
                    <button
                        onClick={() => handleTabClick("sell")}
                        className={`flex-1 relative rounded-t-2xl py-6 text-lg font-bold tracking-[0.05em] transition-colors ${
                            !buyActive
                                ? "bg-black  text-white top-2"
                                : "rounded-b-2xl mt-[8px] border border-gray-200 bg-white text-neutral-900 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.12)] hover:bg-neutral-50"
                        }`}>
                        {t.sell}
                    </button>
                </div>

                <div
                    className={`mt-2 rounded-b-2xl bg-black p-4 text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)] ${
                        buyActive ? "rounded-tr-2xl" : "rounded-tl-2xl"
                    }`}>
                    {wallet && (
                        <div className="rounded-xl bg-white/5 ring-1 ring-white/8 px-4 py-2.5 mb-3 space-y-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] text-white/40 uppercase tracking-widest">
                                    {wallet.type}
                                </span>
                                <div className="flex items-center gap-3">
                                    <span className="text-[13px] font-mono text-white/70">{shortAddress}</span>
                                    <button
                                        onClick={handleDisconnect}
                                        className="text-white/30 hover:text-white/80 transition-colors text-[11px] focus:outline-none">
                                        {t.disconnect}
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-[12px] text-white/50">
                                <span>
                                    SOL{" "}
                                    <span className="text-white/80 font-mono">
                                        {balancesLoading ? "—" : balances !== null ? balances.sol.toFixed(4) : "—"}
                                    </span>
                                </span>
                                <span>
                                    ORBIS{" "}
                                    <span className="text-white/80 font-mono">
                                        {balancesLoading
                                            ? "—"
                                            : balances?.orbis !== null && balances?.orbis !== undefined
                                              ? balances.orbis.toLocaleString()
                                              : "—"}
                                    </span>
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="flex items-center gap-4 rounded-xl bg-[linear-gradient(110deg,#0d0d0d_0%,#202020_55%,#131313_100%)] px-4 py-4 ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.3)]">
                            <GetIcon size={48} className="shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] text-white/55">{getLabel}</p>
                                <input
                                    value={receive}
                                    onChange={(e) => handleReceiveChange(e.target.value)}
                                    className="w-full bg-transparent text-[32px] leading-tight font-bold tracking-tight outline-none"
                                />
                                {receiveUsd !== null && (
                                    <p className="text-[12px] text-white/35 mt-0.5">≈ {formatUsd(receiveUsd)}</p>
                                )}
                            </div>
                        </label>
                        <div className="relative py-1.5 pl-[26px]">
                            <span aria-hidden className="absolute left-[9px] top-3 bottom-3 w-px bg-white/25" />
                            <ul className="space-y-1 text-[13px] text-white/70">
                                <li className="relative flex items-center">
                                    <span
                                        aria-hidden
                                        className="absolute -left-[22px] h-1.5 w-1.5 rounded-full bg-white/80"
                                    />
                                    <span>{t.networkFee}</span>
                                </li>
                                <li className="relative flex items-center">
                                    <span
                                        aria-hidden
                                        className="absolute -left-[22px] h-1.5 w-1.5 rounded-full bg-white/80"
                                    />
                                    <span>
                                        {orbisPerSol !== null
                                            ? `1 ORBIS = $${ORBIS_RATE_USD.toFixed(2)} ≈ ${(1 / orbisPerSol).toFixed(6)} SOL`
                                            : t.fetchingRate}
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <label className="flex items-center gap-4 rounded-xl bg-[linear-gradient(110deg,#0d0d0d_0%,#202020_55%,#131313_100%)] px-4 py-4 ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.3)] transition focus-within:ring-white/25">
                            <SendIcon size={48} className="shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] text-white/55">{sendLabel}</p>
                                <input
                                    value={send}
                                    onChange={(e) => handleSendChange(e.target.value)}
                                    inputMode="decimal"
                                    className="w-full bg-transparent text-[32px] leading-tight font-bold tracking-tight outline-none placeholder:text-white/30"
                                />
                                {sendUsd !== null && (
                                    <p className="text-[12px] text-white/35 mt-0.5">≈ {formatUsd(sendUsd)}</p>
                                )}
                            </div>
                        </label>
                    </div>

                    {txError && (
                        <div className="mt-3 rounded-xl bg-red-500/10 ring-1 ring-red-500/20 px-4 py-3">
                            <p className="text-[13px] text-red-400 leading-snug">{txError}</p>
                        </div>
                    )}

                    {txSignature && (
                        <div className="mt-3 rounded-xl bg-green-500/10 ring-1 ring-green-500/20 px-4 py-3">
                            <p className="text-[12px] text-green-400 leading-snug">
                                {t.transactionConfirmed}{" "}
                                <a
                                    href={`https://solscan.io/tx/${txSignature}${network !== "mainnet-beta" ? `?cluster=${network}` : ""}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline underline-offset-2 hover:text-green-300 transition-colors">
                                    {t.viewOnSolscan}
                                </a>
                            </p>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleExchange}
                        disabled={txPending || !!isInsufficientBalance}
                        className="mt-3 w-full rounded-xl py-6 text-lg font-semibold text-white transition bg-gradient-to-r from-[#6FECC2] via-[#79B3F0] to-[#BF5CE2] hover:brightness-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:opacity-60 disabled:cursor-not-allowed disabled:brightness-100">
                        {exchangeButtonLabel}
                    </button>

                    {adminWallet && (
                        <div className="mt-3 pt-3 border-t border-white/[0.07] cursor-default select-none">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#6FECC2] shadow-[0_0_5px_2px_rgba(111,236,194,0.6)]" />
                                    <span className="text-[10px] uppercase tracking-[0.18em] text-white">Pool Liquidity</span>
                                </div>
                                <div className="flex items-center gap-5">
                                    <span className="text-[12px] font-mono text-white">
                                        SOL{" "}
                                        <span className="text-white/75">
                                            {poolLoading ? "—" : poolBalance !== null ? poolBalance.sol.toFixed(3) : "—"}
                                        </span>
                                    </span>
                                    <span className="text-[12px] font-mono text-white">
                                        $ORBIS{" "}
                                        <span className="text-[#6FECC2]">
                                            {poolLoading ? "—" : poolBalance?.orbis !== null && poolBalance?.orbis !== undefined ? poolBalance.orbis.toLocaleString() : "—"}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <WalletModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setWalletError(null);
                }}
                onSelect={handleWalletSelect}
                loading={walletLoading}
                error={walletError}
            />
        </>
    );
};

export default ExchangeWidget;
