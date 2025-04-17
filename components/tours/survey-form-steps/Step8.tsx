import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { parseAsInteger, useQueryState } from "nuqs";
import useSWR from "swr";
import { Duration } from "@prisma/client";

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
import {
    StepProps,
    fetcher,
} from "@/components/tours/survey-form-steps/common.props";
import { getTourDurations } from "@/util/routes";
import { Checkbox } from "@/components/ui/checkbox";
import ToursListLoader from "@/components/tours/ToursListLoader";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
    tripDuration: z
        .array(z.string())
        .refine((value) => value.some((item) => item), {
            message: "You have to select at least one duration",
        }),
});

type FormSchema = z.infer<typeof formSchema>;

const Step8 = ({ data, setData }: StepProps) => {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tripDuration: (data?.tripDuration as string[]) || [],
        },
    });

    const { data: rawDurations = { data: [] }, isLoading } = useSWR(
        getTourDurations,
        fetcher
    );

    const durations = rawDurations.data as Duration[];

    const [currentStep, setCurrentStep] = useQueryState(
        "step",
        parseAsInteger.withDefault(1)
    );

    function onSubmit(data: FormSchema) {
        setData((prev) => ({ ...prev, ...data }));
        setCurrentStep(9);
    }

    return (
        <div className="space-y-8">
            <SurveyFormHeader
                title="How long should we go?"
                subtitle="(select multiple)"
                required
            />

            <ScrollArea className="relative w-full h-[50vh]">
                {isLoading && <ToursListLoader />}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 mb-20"
                    >
                        <FormField
                            control={form.control}
                            name="tripDuration"
                            render={() => (
                                <FormItem className="gap-3 space-y-0 grid grid-cols-2 px-6">
                                    {durations.map((item: Duration) => (
                                        <FormField
                                            key={item.id}
                                            control={form.control}
                                            name="tripDuration"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={item.id}
                                                        className="flex flex-row items-center space-x-3 space-y-0 px-6 py-3 border rounded-lg"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                id={item.id}
                                                                checked={field.value?.includes(
                                                                    item.id
                                                                )}
                                                                onCheckedChange={(
                                                                    checked
                                                                ) => {
                                                                    return checked
                                                                        ? field.onChange(
                                                                              [
                                                                                  ...field.value,
                                                                                  item.id,
                                                                              ]
                                                                          )
                                                                        : field.onChange(
                                                                              field.value?.filter(
                                                                                  (
                                                                                      value
                                                                                  ) =>
                                                                                      value !==
                                                                                      item.id
                                                                              )
                                                                          );
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel
                                                            className="font-normal text-sm cursor-pointer"
                                                            htmlFor={item.id}
                                                        >
                                                            {item.name}
                                                        </FormLabel>
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                    ))}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <SurveyFormFooter prev={7} fixed />
                    </form>
                </Form>
            </ScrollArea>
        </div>
    );
};

export default Step8;
