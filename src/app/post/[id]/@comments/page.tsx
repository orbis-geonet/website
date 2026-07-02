import { commentsMapper, getCommentsSchema, getData } from "@/lib/utils";
import React from "react";
import { ClientComments, Comment, Noexistence } from "@components";
import { TCOMMENTWITHREPLIES } from "@/lib/ts";
import { getDictionary } from "@/lib/locales";

const page = async ({ params }: { params: { id: string } }) => {
  const data = await getData(`posts/${params.id}/comments`);
  const { dictionary } = await getDictionary();

  if (data.error)
    return (
      <main className="max-w-6xl mx-auto p-10 font-bold text-2xl">
        <Noexistence message="Something went wrong" />
      </main>
    );

  const comments: TCOMMENTWITHREPLIES[] = commentsMapper(data);

  let commentsSchema;
  try {
    commentsSchema = await getCommentsSchema({
      postid: params.id,
      comments: comments,
    });
  } catch (err) {
    // console.log(err);
  }

  return (
    <>
      {commentsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(commentsSchema),
          }}
        />
      )}
      <div className="bg-white rounded-t-[0] w-full md:w-[611px] mx-auto border-b md:border-b-0">
        {comments.map((comment) => (
          <Comment key={comment.id} {...comment} />
        ))}
        {comments.length === 0 ? (
          // <div className="w-full flex items-center py-10 border-t">
          <Noexistence message={dictionary.errors.noComments} small={true} />
        ) : (
          // </div>
          comments.length == 20 && (
            <ClientComments endpoint={`posts/${params.id}/comments`} />
          )
        )}
      </div>
    </>
  );
};

export default page;
