import { Policy } from "@prisma/client";
import { format } from "date-fns";
import Markdown from "react-markdown";

interface Props {
  data: Policy | null;
  hideDate?: boolean;
  hidePlace?: boolean;
}

const PolicyBase = ({ data, hideDate = false, hidePlace = false }: Props) => {
  const FormatDate = () => {
    return (
      <>
        {data?.lastUpdated &&
          format(new Date(data.lastUpdated), "dd MMM, yyyy")}
      </>
    );
  };

  return (
    <div className="space-y-4 mb-10">
      {!hideDate && (
        <p className="font-bold">
          Last updated on: <FormatDate />
        </p>
      )}
      {!hidePlace && <p className="font-bold">Place: {data?.place}</p>}

      <Markdown>{data?.content}</Markdown>
    </div>
  );
};

export default PolicyBase;
