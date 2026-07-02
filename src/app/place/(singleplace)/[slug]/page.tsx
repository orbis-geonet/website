import {
  Checkinslider,
  ClientPostFeed,
  Noexistence,
  Postcard,
} from "@components";
import React, { Suspense } from "react";
import { getData, getPostFeedSchema, postsMapper } from "@/lib/utils";
import { BASE_URL } from "@/lib/ts";
import { getDictionary } from "@/lib/locales";

const PlaceFeedContent = async ({ params }: { params: { slug: string } }) => {
  const data = await getData(`feed/place/slug/${params.slug}?size=5`);
  const { dictionary } = await getDictionary();

  // if (data.error)
  //     return (
  //         <main className="max-w-6xl mx-auto p-10 font-bold text-2xl">
  //             <Noexistence message="Something went wrong" />
  //         </main>
  //     );

  const posts = postsMapper(data);

  let placePostFeedSchema = {};

  try {
    placePostFeedSchema = await getPostFeedSchema({
      url: `${BASE_URL}/place/${params.slug}`,
      pagetitle: "Orbis Rede Geo-Social",
      pagedescription: "Grupos locais no mapa da sua região",
      posts: posts,
      id: "main",
    });
  } catch (err) {
    // console.log(err);
  }

  return (
    <>
      {placePostFeedSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(placePostFeedSchema),
          }}
        />
      )}
      <section className="space-y-8 max-w-6xl mx-auto mt-14">
        {posts &&
          posts.map((singlePost: any) => {
            if (singlePost.type === "CHECKIN")
              return (
                <Checkinslider
                  key={singlePost.checkins[0].postid}
                  checkins={singlePost.checkins}
                  sliderLocation={"placepage"}
                />
              );
            return <Postcard key={singlePost.postid} {...singlePost} />;
          })}
        {!posts || posts.length === 0 ? (
          <Noexistence message={dictionary.errors.noPosts} />
        ) : (
          posts.length == 5 && (
            <ClientPostFeed
              initialNextPageToken={data.nextPage}
              endpoint={`feed/place/slug/${params.slug}`}
              limitInfiniteScrolling={true}
              feedLocation={"placepage"}
            />
          )
        )}
      </section>
    </>
  );
};

const PlaceFeed = ({ params }: { params: { slug: string } }) => {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto p-10 mt-14">
          <div className="animate-pulse space-y-8">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      }
    >
      <PlaceFeedContent params={params} />
    </Suspense>
  );
};

export default PlaceFeed;
