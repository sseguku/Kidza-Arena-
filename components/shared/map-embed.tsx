import { contact } from "@/lib/constants/contact";
import { cn } from "@/lib/utils";

type MapEmbedProps = {
  className?: string;
  title?: string;
};

export function MapEmbed({
  className,
  title = `Map showing ${contact.mapsPlaceName} in Kampala`,
}: MapEmbedProps) {
  return (
    <iframe
      title={title}
      src={contact.mapsEmbedUrl}
      className={cn("h-full w-full border-0", className)}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}
