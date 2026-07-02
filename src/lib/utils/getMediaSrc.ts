export const getMediaSrc = (type: string, mediaName: string) => {
  if (!["AUDIO", "VIDEO", "IMAGE"].includes(type)) return;

  switch (type) {
    case "AUDIO":
      return `posts/audios/${mediaName}`;
    case "VIDEO":
      return `posts/videos/${mediaName}`;
    case "IMAGE":
      return `posts/images/${mediaName}`;
    default:
      return;
  }
};
