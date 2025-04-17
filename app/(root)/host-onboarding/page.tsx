import { SignInButton } from "@clerk/nextjs";
import { LuUser2 } from "react-icons/lu";
import Image from "next/image";
import { VscTypeHierarchySub } from "react-icons/vsc";
import { GiTakeMyMoney } from "react-icons/gi";
import { FaMoneyBillTrendUp } from "react-icons/fa6";

import UsernameClaim from "@/components/landing/UsernameClaim";
import Logo from "@/components/navbar/Logo";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import ImageSlider from "@/components/landing/ImageSlider";
import H1Animation from "@/components/landing/H1Animation";
import H2Animation from "@/components/landing/H2Animation";
import H2AnimationLg from "@/components/landing/H2AnimationLg";
import BentoElement from "@/components/landing/BentoElement";
import ProductVideoPlayer from "@/components/landing/ProductVideoPlayer";

const NoLoginHome = async () => {
    return (
        <>
            <Container className="space-y-40 mt-10 mb-40 !px-5 md:!px-20">
                <section className="space-y-10">
                    <div className="flex justify-between items-center">
                        <Logo />
                        <SignInButton mode="modal">
                            <Button size="lg" className="rounded-full">
                                Login
                            </Button>
                        </SignInButton>
                    </div>

                    <div className="grid grid-cols-2">
                        <div className="space-y-6 col-span-2 md:col-span-1">
                            <H2Animation text="Share leisure Airbnbs & Earn" />

                            <H1Animation />

                            <UsernameClaim />
                        </div>

                        <ImageSlider />
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="space-y-2 text-center">
                        <H2AnimationLg text="Get ready to discover the joy of sharing" />
                        <H2Animation text="Earn by sharing Airbnbs you love" />
                    </div>

                    <div className="gap-3 grid grid-cols-8">
                        <div className="col-span-8 md:col-span-3 col-start-1 md:col-start-2 text-center">
                            <div className="gap-3 md:gap-0 grid grid-cols-2">
                                <div className="relative space-y-3 order-1 md:order-0 col-span-1 md:col-span-2 mb-3 p-6 border rounded-2xl h-full md:h-72 text-center">
                                    <Image
                                        src="/images/service-animals.png"
                                        fill
                                        className="object-left-top rounded-2xl object-cover"
                                        alt="brutalyhonest"
                                    />
                                </div>

                                <div className="flex md:flex-row flex-col gap-3 order-0 md:order-1 col-span-1 md:col-span-2">
                                    <BentoElement
                                        icon={LuUser2}
                                        text="Perpetual Income: Share once, earn forever"
                                    />
                                    <BentoElement
                                        icon={GiTakeMyMoney}
                                        text="Fastest Affiliate Payouts: Get paidout one-day after
                      check-in"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-8 md:col-span-3 text-center">
                            <div className="gap-3 md:gap-0 grid grid-cols-2">
                                <div className="flex md:flex-row flex-col gap-3 order-1 md:order-0 col-span-1 md:col-span-2 mb-3">
                                    <BentoElement
                                        icon={FaMoneyBillTrendUp}
                                        text="Earn upwards of 10% per booking"
                                    />
                                    <BentoElement
                                        icon={VscTypeHierarchySub}
                                        text="Your fans, your site, your rules with custom domains"
                                    />
                                </div>

                                <ProductVideoPlayer />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-4 mx-auto max-w-xl">
                    <div className="space-y-2 mx-auto max-w-md text-center">
                        <p className="font-black text-4xl md:text-5xl">
                            We are powered by the{" "}
                            <span className="text-primary">community.</span>
                        </p>
                    </div>

                    <UsernameClaim text="Sign up, share an Airbnb you love, and start earning today!" />
                </section>
            </Container>
        </>
    );
};

export default NoLoginHome;
