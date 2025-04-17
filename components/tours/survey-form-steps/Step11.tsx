import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { parseAsInteger, useQueryState } from "nuqs";
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
    estimatedTrips: z.string().nullable().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const Step11 = ({ data, setData }: StepProps) => {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            estimatedTrips: data.estimatedTrips,
        },
    });

    const [currentStep, setCurrentStep] = useQueryState(
        "step",
        parseAsInteger.withDefault(1)
    );

    function onSubmit(data: FormSchema) {
        setData((prev) => ({ ...prev, ...data }));
        setCurrentStep(12);
    }

    return (
        <div className="space-y-8">
            <SurveyFormHeader
                title="How many trips would you go on with me?"
                subtitle="(Optional)"
            />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="estimatedTrips"
                        render={({ field }) => (
                            <FormItem className="px-6">
                                <FormControl className="">
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field?.value as string}
                                        className="grid md:grid-cols-3 gap-8"
                                    >
                                        <FormItem className="flex items-center space-x-2 space-y-0 border px-6 py-3 rounded-lg w-full">
                                            <FormControl>
                                                <RadioGroupItem
                                                    value="1-2"
                                                    id="1-2"
                                                />
                                            </FormControl>
                                            <FormLabel
                                                className="font-normal cursor-pointer"
                                                htmlFor="1-2"
                                            >
                                                1-2
                                            </FormLabel>
                                        </FormItem>

                                        <FormItem className="flex items-center space-x-2 space-y-0 border px-6 py-3 rounded-lg w-full">
                                            <FormControl>
                                                <RadioGroupItem
                                                    value="3-4"
                                                    id="3-4"
                                                />
                                            </FormControl>
                                            <FormLabel
                                                className="font-normal cursor-pointer"
                                                htmlFor="3-4"
                                            >
                                                3-4
                                            </FormLabel>
                                        </FormItem>

                                        <FormItem className="flex items-center space-x-2 space-y-0 border px-6 py-3 rounded-lg w-full">
                                            <FormControl>
                                                <RadioGroupItem
                                                    value="5+"
                                                    id="5+"
                                                />
                                            </FormControl>
                                            <FormLabel
                                                className="font-normal cursor-pointer"
                                                htmlFor="5+"
                                            >
                                                5+
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <SurveyFormFooter prev={10} />
                </form>
            </Form>
        </div>
    );
};

export default Step11;
