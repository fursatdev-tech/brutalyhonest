"use client";

import { PuffLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <PuffLoader size={100} color="#008080" />
    </div>
  );
};

export default Loader;
