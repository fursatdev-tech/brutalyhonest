"use client";
import ReactStars from "react-stars";

interface Props {
  score: number;
}

export default function ReactStarsWrapper({ score }: Props) {
  return (
    <ReactStars
      count={5}
      size={24}
      color2={"#008080"}
      half={true}
      value={score || 0}
    />
  );
}
