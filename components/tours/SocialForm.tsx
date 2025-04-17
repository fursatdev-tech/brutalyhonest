"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PiInstagramLogo } from "react-icons/pi";
import { PiFacebookLogo } from "react-icons/pi";
import { PiYoutubeLogo } from "react-icons/pi";
import { IoChevronForward } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import {
    parseAsArrayOf,
    parseAsString,
    useQueryState,
    useQueryStates,
} from "nuqs";
import qs from "query-string";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveInterestsAndSocial } from "@/lib/actions/saveInterestsAndSocial";
import { showError } from "@/util/catchError";
import { useState } from "react";

const isFacebookProfileUrl = (value?: string) => {
    if (!value) return true;

    const facebookUrlPattern =
        /^(https?:\/\/)?(www\.)?facebook\.com\/([^\/\?\s]+)\/?$/i;
    return facebookUrlPattern.test(value);
};

const isYouTubeChannelUrl = (value?: string) => {
    if (!value) return true;

    const youtubeUrlPattern =
        /^(https?:\/\/)?(www\.)?youtube\.com\/(c\/|channel\/|user\/)?([\w-]{1,})$/i;
    return youtubeUrlPattern.test(value);
};

const formSchema = z.object({
    instagram: z
        .union([
            z.string().length(0, {
                message: "Instagram handle must be at least 2 characters.",
            }),
            z
                .string()
                .min(2, {
                    message: "Instagram handle must be at least 2 characters.",
                }),
        ])
        .optional()
        .transform((e) => (e === "" ? undefined : e)),
    facebook: z
        .string()
        .optional()
        .refine((value) => isFacebookProfileUrl(value), {
            message: "Invalid Facebook profile URL.",
        }),
    youtube: z
        .string()
        .optional()
        .refine((value) => isYouTubeChannelUrl(value), {
            message: "Invalid YouTube channel URL.",
        }),
});

type FormSchema = z.infer<typeof formSchema>;

const SocialForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useQueryStates({
        instagram: parseAsString.withDefault(""),
        facebook: parseAsString.withDefault(""),
        youtube: parseAsString.withDefault(""),
    });
    const [interests, setInterests] = useQueryState(
        "interests",
        parseAsArrayOf(parseAsString).withDefault([])
    );

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            instagram: formData.instagram,
            facebook: formData.facebook,
            youtube: formData.youtube,
        },
        mode: "onSubmit",
    });

    const onSubmit = async (data: FormSchema) => {
        setLoading(true);
        setFormData((prev) => ({ ...prev, ...data }));

        const { error } = await saveInterestsAndSocial({ ...data, interests });

        if (error) {
            setLoading(false);
            return showError({ message: error });
        }

        const url = qs.stringifyUrl(
            {
                url: "/hosting/tours/experience",
                query: {
                    ...data,
                    interests: decodeURIComponent(interests.join(",")),
                },
            },
            { skipNull: true }
        );

        router.push(url);
    };

    const isDisabled =
        (!form.getValues("instagram") &&
            !form.getValues("facebook") &&
            !form.getValues("youtube")) ||
        loading;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="flex items-center">
                                    <Input
                                        placeholder="@instagramhandle"
                                        {...field}
                                    />
                                    <PiInstagramLogo
                                        className="-ml-9 text-muted-foreground"
                                        size={28}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="flex items-center">
                                    <Input
                                        placeholder="Facebook URL"
                                        {...field}
                                    />
                                    <PiFacebookLogo
                                        className="-ml-9 text-muted-foreground"
                                        size={28}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="youtube"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="flex items-center">
                                    <Input
                                        placeholder="Channel URL"
                                        {...field}
                                    />
                                    <PiYoutubeLogo
                                        className="-ml-9 text-muted-foreground"
                                        size={28}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    className="w-fit"
                    disabled={isDisabled}
                    type="submit"
                    loading={loading}
                >
                    Next <IoChevronForward className="w-4 h-4 ms-2" />
                </Button>
            </form>
        </Form>
    );
};

export default SocialForm;
