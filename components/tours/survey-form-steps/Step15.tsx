import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";
import { useParams } from "next/navigation";

import SurveyFormHeader from "@/components/tours/SurveyFormHeader";
import SurveyFormFooter from "@/components/tours/SurveyFormFooter";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { StepProps } from "@/components/tours/survey-form-steps/common.props";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { saveSurveyData } from "@/lib/actions/saveSurveyData";
import { showError } from "@/util/catchError";

const formSchema = z.object({
    policy: z
        .boolean()
        .default(false)
        .refine((value) => value === true, {
            message: "Please accept privacy policy",
        }),
});

type FormSchema = z.infer<typeof formSchema>;

const Step15 = ({ data }: StepProps) => {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            policy: false,
        },
    });
    const [loading, setLoading] = useState(false);
    const { username } = useParams();

    const [currentStep, setCurrentStep] = useQueryState(
        "step",
        parseAsInteger.withDefault(1)
    );

    const onSubmit = async () => {
        setLoading(true);

        const { error } = await saveSurveyData(data, username as string);

        if (error) {
            showError({ messge: error });
            return setLoading(false);
        }

        setCurrentStep(16);
    };

    return (
        <div className="space-y-8">
            <SurveyFormHeader title="Privacy Policy" required />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="policy"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 px-6">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-3 leading-none">
                                    <FormLabel>
                                        I agree to the{" "}
                                        <Link
                                            target="_blank"
                                            href="/privacy"
                                            className="text-primary underline"
                                        >
                                            privacy policy
                                        </Link>
                                    </FormLabel>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <SurveyFormFooter prev={14} loading={loading} submit />
                </form>
            </Form>
        </div>
    );
};

export default Step15;
