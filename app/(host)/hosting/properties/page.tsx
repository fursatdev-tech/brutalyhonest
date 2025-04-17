import HostPropertyList from "@/components/become-a-host/HostPropertyList";
import getPublishedProperties from "@/lib/actions/getPublishedProperties";

const HostingProperties = async () => {
  const properties = await getPublishedProperties();

  return <HostPropertyList properties={properties} />;
};

export default HostingProperties;
