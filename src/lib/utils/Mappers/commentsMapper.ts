import { TCOMMENTWITHREPLIES } from "../../ts";

const singleCommentMapper = (comment: any) => {
  return {
    id: comment.commentKey,
    time: comment.createTimestamp,
    text: comment.text,
    user: {
      slug: comment.user.slug,
      id: comment.user.userKey,
      name: comment.user.displayName,
      providerImageUrl: comment.user.providerImageUrl,
      image: comment.user.imageName,
    },
  };
};

export const commentsMapper = (data: any) => {
  const comments: TCOMMENTWITHREPLIES[] = data.map((comment: any) => {
    const singleComment: TCOMMENTWITHREPLIES = {
      ...singleCommentMapper(comment),
      replies: comment.replies.map((reply: any) => singleCommentMapper(reply)),
    };

    return singleComment;
  });

  return comments ? comments : [];
};
