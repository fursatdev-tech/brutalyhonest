import { getPolicy } from "@/lib/actions/getPolicy";
import PolicyBase from "@/components/policy/PolicyBase";

const CancellationAndRefund = async () => {
  const data = await getPolicy("cancellation-refund");

  return <PolicyBase data={data} />;
};

export default CancellationAndRefund;
