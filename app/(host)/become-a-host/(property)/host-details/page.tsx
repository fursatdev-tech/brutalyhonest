"use client";
import { ChangeEvent, use, useContext, useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useUser } from "@clerk/nextjs";

import { AirbnbDataContext } from "@/components/become-a-host/AirbnbContext";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PropertyHeader from "@/components/become-a-host/PropertyHeader";

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const formSchema = z.object({
    hostName: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    hostEmail: z.string().email("This is not a valid email."),
    hostPhone: z.string().regex(phoneRegex, "Invalid phone number."),
});

const HostDetails = () => {
    const { propertyDetails, setPropertyDetails } =
        useContext(AirbnbDataContext);
    const [id, setId] = useQueryState("id");
    const [agreement, setAgreement] = useQueryState(
        "agreement",
        parseAsBoolean
    );
    const { user } = useUser();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            hostName: propertyDetails.hostName || "",
            hostEmail: propertyDetails.hostEmail || "",
            hostPhone: propertyDetails.hostPhone || "",
        },
        mode: "all",
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setPropertyDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        const showAgreement =
            id ||
            propertyDetails.hostEmail !== user?.emailAddresses[0].emailAddress
                ? false
                : true;

        setAgreement(showAgreement);
    }, [id, propertyDetails.hostEmail, setAgreement, user?.emailAddresses]);

    return (
        <div className="space-y-8">
            <PropertyHeader
                title="Host contact details?"
                subtitle="Provide contact details of the host."
            />

            <div className="flex flex-wrap justify-center gap-6 mx-auto max-w-md">
                <Form {...form}>
                    <form className="space-y-8 w-full">
                        <FormField
                            control={form.control}
                            name="hostName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Host name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter name"
                                            {...field}
                                            onChange={(e) => {
                                                handleInputChange(e);
                                                field.onChange(e);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="hostEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Host email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter email"
                                            {...field}
                                            onChange={(e) => {
                                                handleInputChange(e);
                                                field.onChange(e);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="hostPhone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Host phone number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter phone number"
                                            {...field}
                                            onChange={(e) => {
                                                handleInputChange(e);
                                                field.onChange(e);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </div>

            {agreement && (
                <p className="mt-auto text-center text-sm">
                    By continuing to publish you are accepting BrutalyHonest&apos;s{" "}
                    <Link
                        target="_blank"
                        href="/listing-agreement"
                        className="text-primary underline"
                    >
                        listing agreement
                    </Link>
                </p>
            )}
        </div>
    );
};

export default HostDetails;
