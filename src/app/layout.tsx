import { LocalisationProvider } from "@/context/localisation-context";
import QueryClientProvider from "@/context/query-client";
import { ConditionalChrome } from "@/lib/components";
import "@/lib/styles/globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Script from "next/script";
import { getDictionary } from "@/lib/locales";
import "/node_modules/flag-icons/css/flag-icons.min.css";

export const generateMetadata = async (): Promise<Metadata> => {
  const { dictionary } = await getDictionary();
  return {
    title: {
      template: `%s | ${dictionary.meta.title}`,
      default: dictionary.meta.title,
    },
    description: dictionary.meta.description,

    openGraph: {
      title: {
        template: `%s | ${dictionary.meta.title}`,
        default: dictionary.meta.title,
      },
      description: dictionary.meta.description,
      images: ["https://orbis.social/favicon.ico"],
      type: "website",
      url: "https://orbis.social",
    },
  };
};

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dictionary, locale } = await getDictionary();

  return (
    <html lang={locale}>
      <LocalisationProvider dictionary={dictionary} locale={locale}>
        <QueryClientProvider>
          <body className={`${roboto.className} ${roboto.variable} relative`}>
            {" "}
            {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
              <>
                <Script
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
                />
                <Script id="google-analytics">
                  {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
        `}
                </Script>
              </>
            )}
            <div className="">
              <ConditionalChrome dictionary={dictionary}>
                {children}
              </ConditionalChrome>
            </div>
          </body>
        </QueryClientProvider>
      </LocalisationProvider>
    </html>
  );
}
