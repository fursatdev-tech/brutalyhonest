import DownloadCalendar from "@/components/calendar/DownloadCalendar";
import { downloadHostCalendar } from "@/lib/actions/hostCalendar";

interface Props {
    params: Promise<{
        id?: string;
    }>;
}

const Page = async ({ params }: Props) => {
    const currentParams = await params;

    const response = await downloadHostCalendar(currentParams.id);

    const data = await response.text();

    return <DownloadCalendar data={data} />;
};

export default Page;
