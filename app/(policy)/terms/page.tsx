import { getPolicy } from "@/lib/actions/getPolicy";
import PolicyBase from "@/components/policy/PolicyBase";

const Terms = async () => {
  const data = await getPolicy("terms");

  return <PolicyBase data={data} />;
};

export default Terms;
