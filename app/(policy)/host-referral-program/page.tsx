import { getPolicy } from "@/lib/actions/getPolicy";
import PolicyBase from "@/components/policy/PolicyBase";

const Terms = async () => {
  const data = await getPolicy("host-referral-program");

  return <PolicyBase data={data} hideDate hidePlace />;
};

export default Terms;
