interface VideoProps {
  videoUrl: string;
}

function toEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);

    // Already an embed URL
    if (parsed.pathname.startsWith("/embed/")) return url;

    // youtu.be/<id>
    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}`;
    }

    // youtube.com/watch?v=<id>
    const id = parsed.searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}`;

    return url; // fallback, leave as-is
  } catch {
    return url;
  }
}

export default function Video({ videoUrl }: VideoProps) {
  const embedUrl = toEmbedUrl(videoUrl);

  return (
    <div className="w-full max-w-[700px] h-[250px] sm:h-[400px] flex items-center justify-center self-center overflow-hidden rounded-xl">
      <iframe
        src={embedUrl}
        title="Video"
        className="w-full h-full"
        allowFullScreen
      />
    </div>
  );
}