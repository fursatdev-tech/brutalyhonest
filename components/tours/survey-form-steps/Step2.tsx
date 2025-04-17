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
    firstName: z.string().min(2, {
        message: "First name should be atleast 2 characters long",
    }),
    lastName: z.string().min(2, {
        message: "Last name should be atleast 2 characters long",
    }),
});

type FormSchema = z.infer<typeof formSchema>;

const Step2 = ({ data, setData }: StepProps) => {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: data.firstName,
            lastName: data.lastName,
        },
    });

    const [currentStep, setCurrentStep] = useQueryState(
        "step",
        parseAsInteger.withDefault(1)
    );

    function onSubmit(data: FormSchema) {
        setData((prev) => ({ ...prev, ...data }));

        setCurrentStep(3);
    }

    return (
        <div className="space-y-8">
            <SurveyFormHeader title="Name" required />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <div className="gap-6 grid md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="px-6">
                                    <FormControl>
                                        <Input
                                            placeholder="First Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="px-6">
                                    <FormControl>
                                        <Input
                                            placeholder="Last Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <SurveyFormFooter prev={1} />
                </form>
            </Form>
        </div>
    );
};

export default Step2;
