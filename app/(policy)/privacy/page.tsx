import { getPolicy } from "@/lib/actions/getPolicy";
import PolicyBase from "@/components/policy/PolicyBase";

const PrivacyPolicy = async () => {
  const data = await getPolicy("privacy");

  return <PolicyBase data={data} />;
};

export default PrivacyPolicy;
