export function extractYouTubeVideoId(input: string): string | null {
  const value = input.trim();
  
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) {
    return value;
  }

  try {
    const url = new URL(value);

    // https://youtu.be/VIDEO_ID
    if (url.hostname === "youtu.be") {
      return url.pathname.slice(1);
    }

    // https://youtube.com/watch?v=VIDEO_ID
    const videoId = url.searchParams.get("v");
    if (videoId) {
      return videoId;
    }

    // https://youtube.com/embed/VIDEO_ID
    const match = url.pathname.match(/\/embed\/([^/?]+)/);
    if (match) {
      return match[1];
    }

    return null;
  } catch {
    return null;
  }
}
