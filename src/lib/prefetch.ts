export const prefetch = async (paths: string[]) => {
  if (typeof window === "undefined") return;

  try {
    paths.forEach((path) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = path;
      document.head.appendChild(link);
    });
  } catch (error) {
    console.error("Prefetch error:", error);
  }
};
