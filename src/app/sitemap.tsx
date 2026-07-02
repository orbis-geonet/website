import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { app } from "@/lib/ts/constants/firebase";
import { MetadataRoute } from "next";

// export const revalidate = 604800; // Revalidate weekly (in seconds)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get domain from environment variable
  const domain = process.env.NEXT_PUBLIC_DOMAIN || "orbis.social";

  // Get storage instance
  const storage = getStorage(app);

  // Create a reference to the 'sitemaps' folder
  const sitemapsRef = ref(storage, "sitemap");

  try {
    // List all items in the 'sitemaps' folder
    const result = await listAll(sitemapsRef);

    // Create a base sitemap with the main pages
    const entries = [];

    // For each sitemap file in storage, add its URL to the sitemap index
    for (const item of result.items) {
      try {
        // Add the sitemap URL to the entries
        entries.push({
          url: `https://${domain}/sitemaps/${item.name}`,
        });
      } catch (error) {
        console.error(`Error processing sitemap ${item.name}:`, error);
      }
    }

    return entries;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return a minimal sitemap in case of error
    return [
      {
        url: `https://${domain}`,
      },
    ];
  }
}
