import NoSurvey from "@/components/tours/NoSurvey";
import SurveyForm from "@/components/tours/SurveyForm";
import { getSurveyBoolByUsername } from "@/lib/actions/getSurveyBoolByUsername";

interface Props {
    params: Promise<{
        username?: string;
    }>;
}

const Page = async ({ params }: Props) => {
    const surveyExists = await getSurveyBoolByUsername(await params);

    return <>{surveyExists ? <SurveyForm /> : <NoSurvey />}</>;
};

export default Page;
