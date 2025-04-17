import BImage from "@/util/Image";
import ImageGallaryWrapper from "@/components/listings/details/ImageGallaryWrapper";
import SingleImageGallery from "@/components/listings/details/SingleImageGallery";

interface Props {
  images: string[];
  title: string;
}

const ImageGallery = ({ images, title }: Props) => {
  return (
    <>
      <div className="mx-auto mt-5 w-full md:w-1/2 flex flex-wrap gap-4">
        {images.map((src, idx) => (
          <ImageGallaryWrapper key={idx} idx={idx} images={images}>
            <BImage src={src} alt={title} />
          </ImageGallaryWrapper>
        ))}
      </div>

      <SingleImageGallery images={images} />
    </>
  );
};

export default ImageGallery;
