import { TbPhotoPlus } from "react-icons/tb";

interface AddImageProps {
  open: () => void;
}

function AddImage({ open }: AddImageProps) {
  const onAddClick = () => {
    if (open) open();
  };

  return (
    <div
      onClick={onAddClick}
      className="relative flex cursor-pointer flex-row items-center justify-center gap-4 border-2 border-dashed p-6 text-muted transition hover:opacity-70 rounded-xl"
    >
      <TbPhotoPlus size={50} />
      <div className="text-lg font-semibold">Click to upload</div>
    </div>
  );
}

export default AddImage;
