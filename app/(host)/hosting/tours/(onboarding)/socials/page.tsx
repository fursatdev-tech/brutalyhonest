import SocialForm from "@/components/tours/SocialForm";

const Page = async () => {
  return (
    <>
      <p className="text-3xl font-bold">Social Channels</p>
      <p>
        Provide at least one social handle so we can find and connect with you
      </p>

      <SocialForm />
    </>
  );
};

export default Page;
