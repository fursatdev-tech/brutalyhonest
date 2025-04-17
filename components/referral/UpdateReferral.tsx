"use client";

const UpdateReferral = () => {
  const username = localStorage.getItem("referral");

  if (username) {
    fetch(`/api/add-referral/${username}`);

    localStorage.removeItem("referral");
  }

  return null;
};

export default UpdateReferral;
