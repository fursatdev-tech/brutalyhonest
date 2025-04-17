"use client";

import { useState, useEffect } from "react";
import { differenceInDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { PopoverClose } from "@radix-ui/react-popover";
import { parseAsInteger, parseAsTimestamp, useQueryState } from "nuqs";
import { BsExclamationCircle } from "react-icons/bs";
import { useMediaQuery } from "usehooks-ts";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTrigger,
} from "@/components/ui/drawer";

interface PageProps {
    minNights: number | null;
    maxNights: number | null;
    dateError: boolean;
    datePopover: boolean;
    setDatePopover: (value: boolean) => void;
}

const DateBooking = ({
    minNights,
    maxNights,
    dateError,
    datePopover,
    setDatePopover,
}: PageProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const [from, setFrom] = useQueryState("from", parseAsTimestamp);
    const [to, setTo] = useQueryState("to", parseAsTimestamp);
    const [nights, setNights] = useQueryState(
        "nights",
        parseAsInteger.withDefault(0)
    );

    const today = new Date();

    const defaultValues = {
        from: from || undefined,
        to: to || undefined,
    };

    const [date, setDate] = useState<DateRange | undefined>(defaultValues);

    const resetDates = () => {
        setDate({
            from: undefined,
            to: undefined,
        });
    };

    const getDateValue = (date: Date | undefined) => {
        if (!date || isNaN(date.getTime())) return "";

        return format(date, "dd/MM/yyyy");
    };

    const getNightsCounts = () => {
        if (nights < 1) return "Select dates";

        return `${nights} nights`;
    };

    const getDateRangeText = () => {
        if (!date?.from || !date?.to)
            return "Add your travel dates for exact pricing";

        return `${getDateValue(date.from)} - ${getDateValue(date.to)}`;
    };

    const onSelectDateRange = (range: DateRange | undefined) => {
        if (!range) return;

        setDate(range);

        if (!range?.from || !range?.to) return;

        setFrom(range.from);
        setTo(range.to);
        setNightsCount(range.from, range.to);
    };

    const setNightsCount = (start: Date, end: Date) => {
        const days = differenceInDays(end, start);

        setNights(days);
    };

    const Trigger = () => {
        return (
            <div className="flex">
                <div
                    className={cn(
                        "p-3 border-r text-left flex-1",
                        dateError && "border-destructive"
                    )}
                >
                    <p className="font-bold text-xs">CHECK-IN</p>
                    <p
                        className={cn(
                            "text-secondary-foreground",
                            dateError && "text-destructive"
                        )}
                    >
                        {getDateValue(date?.from) || "Add date"}
                    </p>
                </div>
                <div className="flex-1 p-3 text-left">
                    <p className="font-bold text-xs">CHECKOUT</p>
                    <p
                        className={cn(
                            "text-secondary-foreground",
                            dateError && "text-destructive"
                        )}
                    >
                        {getDateValue(date?.to) || "Add date"}
                    </p>
                </div>
            </div>
        );
    };

    const Close = ({ className }: { className: string }) => {
        if (isDesktop)
            return <PopoverClose className={className}>Close</PopoverClose>;

        return <DrawerClose className={className}>Close</DrawerClose>;
    };

    const Content = () => {
        return (
            <>
                <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-8">
                    <div>
                        <p className="font-bold text-xl">{getNightsCounts()}</p>
                        <p className="min-w-[253px] text-secondary-foreground text-sm">
                            {getDateRangeText()}
                        </p>
                    </div>

                    <div className="space-y-1 select-none">
                        <div
                            className={cn(
                                "flex border rounded-lg",
                                dateError && "border-destructive"
                            )}
                        >
                            <div
                                className={cn(
                                    "p-3 border-r text-left flex-1",
                                    dateError && "border-destructive"
                                )}
                            >
                                <p className="font-bold text-xs">CHECK-IN</p>
                                <p
                                    className={cn(
                                        "text-secondary-foreground text-sm",
                                        dateError && "text-destructive"
                                    )}
                                >
                                    {getDateValue(date?.from) || "DD/MM/YYYY"}
                                </p>
                            </div>
                            <div className="flex-1 p-3 text-left">
                                <p className="font-bold text-xs">CHECKOUT</p>
                                <p
                                    className={cn(
                                        "text-secondary-foreground text-sm",
                                        dateError && "text-destructive"
                                    )}
                                >
                                    {getDateValue(date?.to) || "DD/MM/YYYY"}
                                </p>
                            </div>
                        </div>

                        {dateError && (
                            <small className="flex items-center gap-1 text-destructive text-xs">
                                <BsExclamationCircle /> Selected dates are not
                                available
                            </small>
                        )}
                    </div>
                </div>

                <Calendar
                    disabled={{ before: today }}
                    initialFocus
                    min={(minNights || 1) + 1} // +1 to handle one day less booking issue as out day starts in afternoon
                    max={(maxNights || 365) + 1}
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={onSelectDateRange}
                    numberOfMonths={isDesktop ? 2 : 1}
                />

                <div className="text-right">
                    <Button
                        size="sm"
                        variant="link"
                        className="mr-3 text-secondary underline"
                        onClick={resetDates}
                    >
                        Clear dates
                    </Button>

                    <Close className="bg-secondary px-3 py-1.5 rounded-md text-primary-foreground text-sm" />
                </div>
            </>
        );
    };

    if (isDesktop)
        return (
            <Popover open={datePopover} onOpenChange={setDatePopover}>
                <PopoverTrigger className="w-full">
                    <Trigger />
                </PopoverTrigger>
                <PopoverContent
                    align="end"
                    className="flex flex-col gap-5 w-full"
                    sideOffset={-65}
                >
                    <Content />
                </PopoverContent>
            </Popover>
        );

    return (
        <Drawer open={datePopover} onOpenChange={setDatePopover}>
            <DrawerTrigger className="w-full">
                <Trigger />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerDescription className="mx-auto max-h-[80vh] overflow-y-auto">
                        <Content />
                    </DrawerDescription>
                </DrawerHeader>
            </DrawerContent>
        </Drawer>
    );
};

export default DateBooking;
