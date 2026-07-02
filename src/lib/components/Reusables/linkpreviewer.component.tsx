"use client";
import { BASE_URL } from "@/lib/ts";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const LinkPreviewer: React.FC<{ link: string }> = ({ link }) => {
  const [preview, setPreview] = useState<{
    title: string;
    description: string;
    image: string;
    sitename: string;
  }>();

  const fetchLinkPreview = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/preview?link=${link}`);
      const resData = await response.json();
      const html = resData.html;

      // Extract title, description, and image from the HTML
      const siteMatch = html.match(
        /<meta\s+property=["']og:site_name["']\s+content=["']([^"]+)["']\s*\/?>/i,
      );

      const ogtitleMatch = html.match(
        /<meta\s+property=["']og:title["']\s+content=["'](.*?)["']\s*\/?>/i,
      );
      const titleMatch = ogtitleMatch
        ? ogtitleMatch
        : html.match(/<title>(.*?)<\/title>/i);

      const ogDescriptionMatch = html.match(
        /<meta\s+property=["']og:description["']\s+content=["'](.*?)["']\s*\/?>/i,
      );

      const descriptionMatch = ogDescriptionMatch
        ? ogDescriptionMatch
        : html.match(
            /<meta\s+name=["']description["']\s+content=["'](.*?)["']\s*\/?>/i,
          );
      const imageMatch = html.match(
        /<meta\s+property=["']og:image["']\s+content=["'](.*?)["']\s*\/?>/i,
      );

      const title = titleMatch ? titleMatch[1] : "";
      const description = descriptionMatch ? descriptionMatch[1] : "";
      const image = imageMatch ? imageMatch[1] : "";
      const sitename = siteMatch ? siteMatch[1] : "";

      setPreview({ sitename, title, description, image });
    } catch (error) {
      console.error("Error fetching link preview:", error);
    }
  };

  useEffect(() => {
    fetchLinkPreview();
  }, []);

  return (
    <Link href={link} className="bg-neutral-100 block mt-2">
      {preview && (
        <>
          {preview.image && (
            <div className="w-full h-[400px] bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="h-full w-full object-contain"
                height="100"
                width="100"
                src={preview.image}
                alt="Preview Image"
              />
            </div>
          )}
          <div className="bg-neutral-100 p-4">
            {preview.sitename && (
              <h3 className="font-bold text-neutral-500">{preview.sitename}</h3>
            )}
            {preview.title && preview.title !== "" && (
              <h2 className="font-medium">{preview.title}</h2>
            )}
            {preview.description && (
              <p className="font-light">{preview.description}</p>
            )}
          </div>
        </>
      )}
    </Link>
  );
};

export default LinkPreviewer;
