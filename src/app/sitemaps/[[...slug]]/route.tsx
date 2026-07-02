import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";
import { app } from "@/lib/ts/constants/firebase";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug?: string[] } },
) {
  const { slug } = params;
  const storage = getStorage(app);
  const domain = process.env.NEXT_PUBLIC_DOMAIN || "orbis.social";

  try {
    // If a slug is provided, serve that specific sitemap
    if (slug && slug.length > 0) {
      const requestedSitemap = slug[0];

      // Create a reference to the specific sitemap file
      const sitemapRef = ref(storage, `sitemap/${requestedSitemap}`);

      try {
        // Get the download URL
        const url = await getDownloadURL(sitemapRef);

        // Fetch the content
        const response = await fetch(url);
        const sitemapContent = await response.text();

        // Return the sitemap content
        return new NextResponse(sitemapContent, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control":
              "public, max-age=604800, stale-while-revalidate=86400",
          },
        });
      } catch (error) {
        // Sitemap not found
        return new NextResponse("Sitemap not found", { status: 404 });
      }
    }

    // If no slug is provided, redirect to the root sitemap.xml
    return NextResponse.redirect(new URL("/sitemap.xml", request.url));
  } catch (error) {
    console.error("Error fetching sitemaps:", error);
    return new NextResponse("Error fetching sitemaps", { status: 500 });
  }
}
