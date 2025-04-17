"use client";

import { BiSearch } from "react-icons/bi";
import {
    ChangeEventHandler,
    use,
    useContext,
    useEffect,
    useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/util/hooks/use-debounce";
import qs from "query-string";

import { Input } from "@/components/ui/input";
import { AppContext, HomeView } from "@/util/AppContext";
import { getCookie } from "cookies-next";

const Search = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const category = searchParams.get("category");
    const location = searchParams.get("location");

    const [value, setValue] = useState(location || "");
    const { data, setData } = useContext(AppContext);

    const debouncedValue = useDebounce<string>(value, 500);

    const onChange: ChangeEventHandler<HTMLInputElement> = (e) =>
        setValue(e.target.value);

    const viewCookie = getCookie("view");

    useEffect(() => {
        setData({ ...data, view: HomeView.Tours });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewCookie]);

    useEffect(() => {
        updateRoute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue, category, router]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;

        updateRoute();
    };

    const updateRoute = () => {
        const query = {
            location: debouncedValue,
            category,
        };

        const url = qs.stringifyUrl(
            {
                url: window.location.href,
                query,
            },
            { skipNull: true, skipEmptyString: true }
        );

        router.push(url);
    };

    return (
        <div className="space-y-6">
            <div className="border-input bg-input shadow-sm hover:shadow-md py-1 border rounded-full w-full transition cursor-pointer">
                <div className="flex justify-between items-center space-x-6 px-4 w-full">
                    <Input
                        placeholder="Anywhere"
                        className="border-0 sm:w-96"
                        value={value}
                        onChange={onChange}
                        onKeyDown={handleKeyDown}
                    />

                    <div
                        className="bg-primary p-3 rounded-full text-background"
                        onClick={updateRoute}
                    >
                        <BiSearch size={12} strokeWidth={2} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
