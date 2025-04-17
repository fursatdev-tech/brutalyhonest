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
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StepProps } from "@/components/tours/survey-form-steps/common.props";

const formSchema = z.object({
    profession: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const Step13 = ({ data, setData }: StepProps) => {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            profession: data.profession ?? "",
        },
    });

    const [currentStep, setCurrentStep] = useQueryState(
        "step",
        parseAsInteger.withDefault(1)
    );

    function onSubmit(data: FormSchema) {
        setData((prev) => ({ ...prev, ...data }));
        setCurrentStep(14);
    }

    return (
        <div className="space-y-8">
            <SurveyFormHeader
                title="What is your profession?"
                subtitle="(Optional)"
            />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="profession"
                        render={({ field }) => (
                            <FormItem className="px-6">
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <SurveyFormFooter prev={12} />
                </form>
            </Form>
        </div>
    );
};

export default Step13;
