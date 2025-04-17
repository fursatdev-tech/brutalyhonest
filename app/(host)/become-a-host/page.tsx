import Image from "next/image";
import { redirect } from "next/navigation";

import { GET_STARTED_POINTS } from "@/components/become-a-host/data";
import GetStarted from "@/components/become-a-host/dialog/GetStarted";
import Container from "@/components/ui/container";
import getPropertyCount from "@/lib/actions/getPropertyCount";

const HostRoot = async () => {
  const { isExistingHost } = await getPropertyCount();

  if (isExistingHost) redirect("/hosting");
  //if we can use this to create our crud operations that'll be great
  return (
    <>
      <Container className="md:h-[calc(100vh-168px)]">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center h-full max-w-5xl mx-auto">
          <h1 className="!text-3xl md:!text-5xl font-bold my-auto max-w-md">
            Earn by Sharing Your Favorite Stays!
          </h1>
          <div className="space-y-4 my-auto">
            {GET_STARTED_POINTS.map((data, idx) => (
              <div className="flex gap-4 border-b pb-5" key={idx}>
                <p className="text-lg font-bold">{idx + 1}</p>
                <div>
                  <p className="text-lg font-bold">{data.title}</p>
                  <p className="text-muted">{data.description}</p>
                </div>

                <div className="w-full h-32 relative">
                  <Image
                    fill
                    alt=""
                    src={`/images/become-a-host/${idx}.webp`}
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <div className="fixed bottom-0 px-8 py-4 border-t-4 w-full text-right bg-background">
        <GetStarted />
      </div>
    </>
  );
};

export default HostRoot;
