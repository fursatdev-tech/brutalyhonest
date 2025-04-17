import { Metadata } from "next";

import Logo from "@/components/navbar/Logo";
import SurveyProgress from "@/components/tours/SurveyProgress";

interface Props {
    children: React.ReactNode;
    params: Promise<{
        username?: string;
    }>;
}

export const metadata: Metadata = {
    title: "Survey",
    description: "Earn by Sharing Your Favorite Stays!",
};

const SurveyLayout = async ({ children }: Props) => {
    return (
        <>
            <div className="top-2 md:top-6 left-2 md:left-6 absolute">
                <Logo />
            </div>

            <div className="relative place-content-center space-y-8 grid mx-auto min-h-[calc(100vh-140px)]">
                <div className="shadow rounded-xl w-[calc(100vw-24px)] max-w-3xl">
                    {children}
                </div>
            </div>

            <SurveyProgress />
        </>
    );
};

export default SurveyLayout;
