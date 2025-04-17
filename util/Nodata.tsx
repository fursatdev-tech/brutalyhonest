import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface Props {
  title?: string;
  subtitle?: string;
}

const Nodata = ({
  title = "No exact matches",
  subtitle = "Try changing or removing some of your filters or adjusting your search area.",
}: Props) => {
  return (
    <>
      <Image
        src="/images/no-data.png"
        alt="No result found"
        width={400}
        height={400}
      />
      <div className="space-y-4 text-center">
        <p className="text-xl font-bold">{title}</p>
        <p className="text-muted">{subtitle}</p>
        {/* extra div to fix the link not respecting space issue */}
        <div>
          <Link href="/" className="mt-4">
            <Button variant="outline" className="text-muted">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Nodata;
