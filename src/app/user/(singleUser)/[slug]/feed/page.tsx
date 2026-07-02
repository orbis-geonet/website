import {
  Checkinslider,
  Postcard,
  ClientPostFeed,
  Noexistence,
} from "@components";
import React from "react";
import { getData, getPostFeedSchema, postsMapper } from "@/lib/utils";
import { BASE_URL } from "@/lib/ts";
import { getDictionary } from "@/lib/locales";

const UserFeed = async ({ params }: { params: { slug: string } }) => {
  const data = await getData(`feed/user/slug/${params.slug}?size=5`);
  const { dictionary } = await getDictionary();

  if (data.error)
    return (
      <main className="max-w-6xl mx-auto p-10 font-bold text-2xl">
        <Noexistence message="Something went wrong" />
      </main>
    );

  const posts = postsMapper(data);

  let userFeedSchema;

  try {
    userFeedSchema = await getPostFeedSchema({
      url: `${BASE_URL}/user/${params.slug}`,
      pagetitle: "Orbis Rede Geo-Social",
      pagedescription: "Grupos locais no mapa da sua região",
      posts: posts,
    });
  } catch (err) {
    // console.log(err);
  }

  return (
    <>
      {userFeedSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(userFeedSchema),
          }}
        />
      )}
      <section className="space-y-8 max-w-6xl mx-auto">
        {posts.map((singlePost: any) => {
          if (singlePost.type === "CHECKIN")
            return (
              <Checkinslider
                key={singlePost.checkins[0].postid}
                checkins={singlePost.checkins}
              />
            );
          return <Postcard key={singlePost.postid} {...singlePost} />;
        })}
        {posts.length === 0 ? (
          <Noexistence message={dictionary.errors.noPosts} />
        ) : (
          posts.length == 5 && (
            <ClientPostFeed
              initialNextPageToken={data.nextPage}
              endpoint={`feed/user/slug/${params.slug}`}
            />
          )
        )}
      </section>
    </>
  );
};

export default UserFeed;
