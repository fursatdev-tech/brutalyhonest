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
    email: z.string().email(),
});

type FormSchema = z.infer<typeof formSchema>;

const Step1 = ({ data, setData }: StepProps) => {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: data.email,
        },
    });

    const [currentStep, setCurrentStep] = useQueryState(
        "step",
        parseAsInteger.withDefault(1)
    );

    function onSubmit(data: FormSchema) {
        setData((prev) => ({ ...prev, ...data }));
        setCurrentStep(2);
    }

    return (
        <div className="space-y-8">
            <SurveyFormHeader
                title="Email Address"
                subtitle="We'll notify the provided email when the trip is available to book"
                required
            />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="px-6">
                                <FormControl>
                                    <Input
                                        placeholder="example@example.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <SurveyFormFooter />
                </form>
            </Form>
        </div>
    );
};

export default Step1;
