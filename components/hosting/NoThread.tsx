import Image from "next/image";

const NoThread = () => {
  return (
    <div className="text-center my-20 space-y-6">
      <Image
        className="mx-auto text-muted-foreground"
        src="/images/hero/petting.svg"
        alt="No conversation"
        width={400}
        height={400}
      />
      <p className="text-lg">Select a conversation to get started</p>
    </div>
  );
};

export default NoThread;
