import Image from "next/image";

import { cn } from "@/lib/utils";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

const BImage = ({ src, alt, className }: ImageProps) => {
  const base64 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAXCAMAAAA8w5+RAAAAAXNSR0IArs4c6QAAAKJQTFRFlKKQyNbhv9bnx8/UttPqqs/prcrfv8XIo8vmp8XZrMLRtry7q73Fsrq0oLzNqLO5ra+tp6uni7CpjKu5oKOhpaKZnpyRlZiTmJeHjZuIipmNep2XkZCAiJOFgJWEd5OEjIp6gox6d497g4Vyd4tuaouBd4Z2coh2eYJrcYVsa4N1c4Fmb394Z4GBXYd4b3xwcnpkSolyZXlvWXJxWW5nTmRiMqWBSQAAAPFJREFUeNpFzEtOxEAMRdFrP9uphKQjwQT2vzfEEkCdD6kM4Ej1pLoDExH5r7U2Pt7wuHNV/cUV956rxrGq7zhNM2Y91/R4TP3fLVjnNc/rPF2zrsuy+AXMEEqFZz92Pwd5unmm58Vb3EzoWq/yrrKiMqVwVYtogUsWGWk5RkVIgh7ziqrUMAwCzL4cTFIMQ944tg1XZUQbUh0IjBAWKJTw5PaJmxlC3MwwPnDA4JY79EqA7fhPJKCD7t13Aw4/voEAJXx5gMiN4zxd49gwIwocAvbCgZdjI0Y2kh3AME6DVxcBCOwJYDRwwHd2DM4TAPgFWaUjfdp7sKAAAAAASUVORK5CYII=";

  return (
    <Image
      unoptimized
      alt={alt}
      src={src}
      fill
      loading="lazy"
      className={cn("object-cover", className)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
      blurDataURL={base64}
    />
  );
};

export default BImage;
