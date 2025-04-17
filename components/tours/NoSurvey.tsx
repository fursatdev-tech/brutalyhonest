import Image from "next/image";

const NoSurvey = () => {
  return (
    <div className="space-y-8 p-8">
      <div className="w-full h-80 relative">
        <Image
          src="/images/tour/no-survey.svg"
          fill
          alt="no-survey"
          className="object-contain"
        />
      </div>

      <p className="text-center italic">
        Ohh hoo!!! Seems like you have landed on a survey link which currently
        doesn&apos;t exists or it&apos;s removed. Please contact the host for
        updated link.
      </p>
    </div>
  );
};

export default NoSurvey;
