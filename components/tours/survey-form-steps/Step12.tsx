import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { parseAsInteger, useQueryState } from "nuqs";
import { Country, State, City } from "country-state-city";
import { useState } from "react";
import { IState, ICity } from "country-state-city";

import SurveyFormHeader from "@/components/tours/SurveyFormHeader";
import SurveyFormFooter from "@/components/tours/SurveyFormFooter";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { StepProps } from "@/components/tours/survey-form-steps/common.props";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
    city: z.string().min(2, "City is too short").max(50, "City is too long"),
    state: z.string().min(2, "State is too short").max(50, "State is too long"),
    country: z
        .string()
        .min(2, "Country is too short")
        .max(50, "Country is too long"),
});

type FormSchema = z.infer<typeof formSchema>;

const Step12 = ({ data, setData }: StepProps) => {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            city: data.location?.city,
            state: data.location?.state,
            country: data.location?.country,
        },
    });

    const [currentStep, setCurrentStep] = useQueryState(
        "step",
        parseAsInteger.withDefault(1)
    );

    const [states, setStates] = useState<IState[]>([]);
    const [cities, setCities] = useState<ICity[]>([]);

    function onSubmit(data: FormSchema) {
        setData((prev) => ({ ...prev, location: data }));
        setCurrentStep(13);
    }

    const countries = Country.getAllCountries();

    const getStatesOfCountry = (val: string) => {
        setStates(State.getStatesOfCountry(val));
    };

    const getCitiesOfState = (val: string) => {
        setCities(City.getCitiesOfState(form.getValues("country"), val));
    };

    return (
        <div className="space-y-8">
            <SurveyFormHeader
                title="Where are you located?"
                subtitle={`Type "N/A" if you can't provide your city or state`}
                required
            />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem className="px-6">
                                <FormControl>
                                    <Select
                                        onValueChange={(e) => {
                                            field.onChange(e);
                                            getStatesOfCountry(e);
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Country" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {countries.map((country) => (
                                                <SelectItem
                                                    value={country.isoCode}
                                                    key={country.isoCode}
                                                >
                                                    {country.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem className="px-6">
                                <FormControl>
                                    <Select
                                        onValueChange={(e) => {
                                            field.onChange(e);
                                            getCitiesOfState(e);
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select State" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {states.map((state) => (
                                                <SelectItem
                                                    value={state.isoCode}
                                                    key={state.isoCode}
                                                >
                                                    {state.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem className="px-6">
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select City" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {cities.map((city) => (
                                                <SelectItem
                                                    value={city.name}
                                                    key={city.name}
                                                >
                                                    {city.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <SurveyFormFooter prev={11} />
                </form>
            </Form>
        </div>
    );
};

export default Step12;
