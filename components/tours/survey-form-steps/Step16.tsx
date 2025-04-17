import { IoIosCheckmarkCircleOutline } from "react-icons/io";

import SurveyFormHeader from "@/components/tours/SurveyFormHeader";

const Step16 = () => {
  return (
    <div className="text-center p-8">
      <IoIosCheckmarkCircleOutline className="w-32 h-32 mx-auto text-primary" />
      <SurveyFormHeader
        title="Thanks!"
        subtitle="We'll email you when the trip is ready for booking"
      />
    </div>
  );
};

export default Step16;
