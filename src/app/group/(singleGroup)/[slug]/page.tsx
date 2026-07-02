import {
  Checkinslider,
  Postcard,
  ClientPostFeed,
  Eventcard,
  Noexistence,
  ScrollToTop,
  LoadingComponent,
} from "@components";
import React, { Suspense } from "react";
import { getData, getPostFeedSchema, postsMapper } from "@/lib/utils";
import { BASE_URL } from "@/lib/ts";
import { getDictionary } from "@/lib/locales";
import { prefetch } from "@/lib/prefetch";

const LoadingBoundary = () => (
  <div className="animate-pulse">
    <LoadingComponent />
  </div>
);

const PostsContent = async ({ params }: { params: { slug: string } }) => {
  prefetch([
    `feed/group/slug/${params.slug}/events`,
    `feed/group/slug/${params.slug}/members`,
  ]);


  const [data, { dictionary }] = await Promise.all([
    getData(`feed/group/slug/${params.slug}?size=5`),
    getDictionary(),
  ]);

  const posts = postsMapper(data);

  const groupPostFeedSchema = await getPostFeedSchema({
    url: `${BASE_URL}/group/${params.slug}`,
    pagetitle: "Orbis Rede Geo-Social",
    pagedescription: "Grupos locais no mapa da sua região",
    posts: posts,
  }).catch(console.error);

  return (
    <>
      <ScrollToTop />
      {groupPostFeedSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(groupPostFeedSchema),
          }}
        ></script>
      )}
      <section className="space-y-8 max-w-6xl mx-auto">
        {posts?.map((singlePost: any) => (
          <React.Suspense
            key={singlePost.postid}
            fallback={<LoadingBoundary />}
          >
            {singlePost.type === "CHECKIN" ? (
              <Checkinslider checkins={singlePost.checkins} />
            ) : singlePost.type === "EVENT" ? (
              <Eventcard {...singlePost} priority={true} />
            ) : (
              <Postcard {...singlePost} priority={true} />
            )}
          </React.Suspense>
        ))}
        {!posts || posts.length === 0 ? (
          <Noexistence message={dictionary.errors.noPosts} />
        ) : (
          posts.length === 5 && (
            <ClientPostFeed
              initialNextPageToken={data.nextPage}
              endpoint={`feed/group/slug/${params.slug}`}
            />
          )
        )}
      </section>
    </>
  );
};

const Posts = ({ params }: { params: { slug: string } }) => {
  return (
    <Suspense fallback={<LoadingBoundary />}>
      <PostsContent params={params} />
    </Suspense>
  );
};

export default Posts;
