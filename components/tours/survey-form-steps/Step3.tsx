import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { parseAsInteger, useQueryState } from "nuqs";
import { Gender } from "@prisma/client";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
    gender: z.enum(["male", "female", "nb"], {
        required_error: "You need to select a gender",
    }),
});

type FormSchema = z.infer<typeof formSchema>;

const Step3 = ({ data, setData }: StepProps) => {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            gender: data.gender,
        },
    });

    const [currentStep, setCurrentStep] = useQueryState(
        "step",
        parseAsInteger.withDefault(1)
    );

    function onSubmit(data: FormSchema) {
        setData((prev) => ({ ...prev, ...data }));

        setCurrentStep(4);
    }

    return (
        <div className="space-y-8">
            <SurveyFormHeader
                title="What's your gender?"
                subtitle="Let us know how you identify"
                required
            />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem className="px-6">
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="gap-8 grid md:grid-cols-3"
                                    >
                                        <FormItem className="flex items-center space-x-2 space-y-0 px-6 py-3 border rounded-lg w-full">
                                            <FormControl>
                                                <RadioGroupItem
                                                    value={Gender.male}
                                                    id="male"
                                                />
                                            </FormControl>
                                            <FormLabel
                                                className="font-normal cursor-pointer"
                                                htmlFor="male"
                                            >
                                                Male
                                            </FormLabel>
                                        </FormItem>

                                        <FormItem className="flex items-center space-x-2 space-y-0 px-6 py-3 border rounded-lg w-full">
                                            <FormControl>
                                                <RadioGroupItem
                                                    value={Gender.female}
                                                    id="female"
                                                />
                                            </FormControl>
                                            <FormLabel
                                                className="font-normal cursor-pointer"
                                                htmlFor="female"
                                            >
                                                Female
                                            </FormLabel>
                                        </FormItem>

                                        <FormItem className="flex items-center space-x-2 space-y-0 px-6 py-3 border rounded-lg w-full whitespace-nowrap">
                                            <FormControl>
                                                <RadioGroupItem
                                                    value={Gender.nb}
                                                    id="nb"
                                                />
                                            </FormControl>
                                            <FormLabel
                                                className="font-normal cursor-pointer"
                                                htmlFor="nb"
                                            >
                                                Non-Binary
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <SurveyFormFooter prev={2} />
                </form>
            </Form>
        </div>
    );
};

export default Step3;
