import { Features, Hero, Video } from "@sections";
import { MapBanner } from "@components";
import Image from "next/image";
import { default as MapBg } from "@public/images/bg/map-bg.webp";
import { getHomepageSchema } from "@/lib/utils";
import { getDictionary } from "@/lib/locales";

export default async function Home() {
    const { dictionary, locale } = await getDictionary();
    return (
        <main className="max-w-6xl mx-auto">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(getHomepageSchema()),
                }}
            />
            <Image className="absolute top-0 right-0 h-[765px] w-auto" src={MapBg} alt="bg-image" priority />
            <div className="relative z-10 max-w-6xl mx-auto">
                <Hero dictionary={dictionary} locale={locale} />
                <MapBanner className="mb-8 lg:mb-20" allowClosing={false} />
                <Features dictionary={dictionary} />
            </div>
        </main>
    );
}
