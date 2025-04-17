"use client";

import { PuffLoader } from "react-spinners";

const Loader2 = () => {
  return (
    <div className="mt-5 flex justify-center items-center">
      <PuffLoader size={100} color="#008080" />
    </div>
  );
};

export default Loader2;
