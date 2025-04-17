"use client";
import Loader from "@/util/Loader";

interface Props {
  data: string;
}

const DownloadCalendar = ({ data }: Props) => {
  const blob = new Blob([data], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "brutalyhonest-calendar.ics";
  document.body.appendChild(a);
  a.click();

  return <Loader />;
};

export default DownloadCalendar;
