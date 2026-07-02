export default async function getCityFromCoordinates(
  lat: number,
  long: number,
) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch city name");
    }
    const data = await response.json();

    // const address = data.display_name;
    const cityName =
      data.address.city ||
      data.address.municipality ||
      data.address.state ||
      data.address.county ||
      data.address.country ||
      "";

    return {
      cityName,
      locality: data.address.suburb,
      lat: lat,
      long: long,
    };
  } catch (error) {
    console.error("Error fetching city name:", error);
  }
}
