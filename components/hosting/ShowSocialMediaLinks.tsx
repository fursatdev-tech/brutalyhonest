import Link from "next/link";
import { PiFacebookLogo, PiInstagramLogo, PiYoutubeLogo } from "react-icons/pi";

export interface SocialProps {
  data: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
}

const ShowSocialMediaLinks = ({ data }: SocialProps) => {
  const { instagram, facebook, youtube } = data;

  return (
    <div className="my-2 space-y-3">
      {instagram && (
        <Link
          target="_blank"
          href={`https://instagram.com/${instagram}`}
          className="flex gap-1 items-center underline text-primary w-fit"
        >
          <PiInstagramLogo size={16} />
          Instagram
        </Link>
      )}

      {facebook && (
        <Link
          target="_blank"
          href={`https://facebok.com/${facebook}`}
          className="flex gap-1 items-center underline text-primary w-fit"
        >
          <PiFacebookLogo size={16} />
          Facebook
        </Link>
      )}

      {youtube && (
        <Link
          target="_blank"
          href={`https://youtube.com/@${youtube}`}
          className="flex gap-1 items-center underline text-primary w-fit"
        >
          <PiYoutubeLogo size={16} />
          Youtube
        </Link>
      )}
    </div>
  );
};

export default ShowSocialMediaLinks;
