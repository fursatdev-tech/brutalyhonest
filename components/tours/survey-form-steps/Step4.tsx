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
    age: z.coerce.number().gte(18, "Must be 18 and above"),
});

type FormSchema = z.infer<typeof formSchema>;

const Step4 = ({ data, setData }: StepProps) => {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            age: data.age,
        },
    });

    const [currentStep, setCurrentStep] = useQueryState(
        "step",
        parseAsInteger.withDefault(1)
    );

    function onSubmit(data: FormSchema) {
        setData((prev) => ({ ...prev, ...data }));
        setCurrentStep(5);
    }

    return (
        <div className="space-y-8">
            <SurveyFormHeader
                title="How old are you?"
                subtitle="Must be 18+ by travel date"
                required
            />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem className="px-6">
                                <FormControl>
                                    <Input placeholder="ex: 23" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <SurveyFormFooter prev={3} />
                </form>
            </Form>
        </div>
    );
};

export default Step4;
