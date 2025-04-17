"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { PopoverClose } from "@radix-ui/react-popover";
import { IoChevronDown } from "react-icons/io5";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMediaQuery } from "usehooks-ts";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    ADD_GUEST,
    guestReducer,
    initialState,
} from "@/util/reducers/addGuest";
import { Button } from "@/components/ui/button";
import ServiceAnimals from "@/components/listings/details/dialogs/ServiceAnimals";
import { cn } from "@/lib/utils";
import { GuestDataItem } from "@/components/listings/listings.interface";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTrigger,
} from "@/components/ui/drawer";

import styles from "../styles.module.css";

interface PageProps {
    allowsChildren: boolean;
    allowsInfants: boolean;
    allowsPets: boolean;
    dateError: boolean;
    guests: number;
    perGuestPricing: boolean;
}

const GuestBooking = ({
    allowsChildren,
    allowsInfants,
    allowsPets,
    dateError,
    guests,
    perGuestPricing,
}: PageProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const guestTriggerRef = useRef<HTMLButtonElement>(null);
    const [guestPopoverWidth, setGuestPopoverWidth] = useState(0);

    const [adults, setAdults] = useQueryState(
        "adults",
        parseAsInteger.withDefault(1)
    );
    const [children, setChildren] = useQueryState(
        "children",
        parseAsInteger.withDefault(0)
    );
    const [infants, setInfants] = useQueryState(
        "infants",
        parseAsInteger.withDefault(0)
    );
    const [pets, setPets] = useQueryState(
        "pets",
        parseAsInteger.withDefault(0)
    );

    const maxGuestsReached = !perGuestPricing && adults + children >= guests;

    useEffect(() => {
        setGuestPopoverWidth(guestTriggerRef.current!?.offsetWidth);
    }, []);

    const [state, dispatch] = useReducer(
        guestReducer,
        initialState({ adults, children, infants, pets })
    );

    const guestData: GuestDataItem[] = [
        {
            title: "Adults",
            subtitle: "Age 13+",
            state: state?.adults,
            disables: {
                decrement: state?.adults === 1,
                increment: maxGuestsReached,
            },
            actions: {
                increment: ADD_GUEST.INCREMENT_ADULT,
                decrement: ADD_GUEST.DECREMENT_ADULT,
            },
        },
        {
            title: "Children",
            subtitle: "Age 2-12",
            state: state?.children,
            disables: {
                decrement: !allowsChildren,
                increment: !allowsChildren || maxGuestsReached,
            },
            actions: {
                increment: ADD_GUEST.INCREMENT_CHILD,
                decrement: ADD_GUEST.DECREMENT_CHILD,
            },
        },
        {
            title: "Infants",
            subtitle: "Under 2",
            state: state?.infants,
            disables: { decrement: !allowsInfants, increment: !allowsInfants },
            actions: {
                increment: ADD_GUEST.INCREMENT_INFANT,
                decrement: ADD_GUEST.DECREMENT_INFANT,
            },
        },
        {
            title: "Pets",
            subtitle: "Bringing a service animal?",
            subtitleClickable: true,
            state: state?.pets,
            disables: { decrement: !allowsPets, increment: !allowsPets },
            actions: {
                increment: ADD_GUEST.INCREMENT_PET,
                decrement: ADD_GUEST.DECREMENT_PET,
            },
        },
    ];

    const onDecrementClick = ({ actions, state, title }: GuestDataItem) => {
        dispatch({ type: actions.decrement });

        const newValue = state - 1;

        setQueryParams(title, newValue);
    };

    const onIncrementClick = ({ actions, state, title }: GuestDataItem) => {
        dispatch({ type: actions.increment });

        const newValue = state + 1;

        setQueryParams(title, newValue);
    };

    const setQueryParams = (title: string, newValue: number) => {
        switch (title.toLowerCase()) {
            case "adults":
                return setAdults(newValue);
            case "children":
                return setChildren(newValue);
            case "infants":
                return setInfants(newValue);
            case "pets":
                return setPets(newValue);
        }
    };

    const Trigger = () => {
        return (
            <div
                className={cn(
                    "flex justify-between items-center border-t p-3 text-left",
                    dateError && "border-destructive"
                )}
            >
                <div>
                    <p className="font-bold text-xs">GUESTS</p>
                    <p className="text-secondary-foreground">
                        {state?.adults + state?.children}{" "}
                        {state?.adults > 1 ? "guests" : "guest"}
                        {state?.infants > 0 &&
                            `, ${state?.infants} ${
                                state?.infants > 1 ? "infants" : "infant"
                            }`}
                        {state?.pets > 0 &&
                            `, ${state?.pets} ${
                                state?.pets > 1 ? "pets" : "pet"
                            }`}
                    </p>
                </div>
                <IoChevronDown
                    className="data-[state=open]:rotate-180"
                    size={20}
                />
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
                {guestData.map((guest, index) => (
                    <div
                        className="flex justify-between items-center"
                        key={index}
                    >
                        <div className="text-sm">
                            <p className="font-bold text-left">{guest.title}</p>
                            <p className="text-secondary-foreground">
                                {guest?.subtitleClickable ? (
                                    <ServiceAnimals title={guest.subtitle} />
                                ) : (
                                    guest.subtitle
                                )}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                disabled={
                                    guest.disables.decrement ||
                                    guest?.state === 0
                                }
                                onClick={() => onDecrementClick(guest)}
                            >
                                <CiCircleMinus size={28} />
                            </Button>
                            <p>{guest?.state}</p>
                            <Button
                                variant="ghost"
                                size="icon"
                                disabled={guest.disables.increment}
                                onClick={() => onIncrementClick(guest)}
                            >
                                <CiCirclePlus size={28} />
                            </Button>
                        </div>
                    </div>
                ))}

                <div className="flex justify-between items-center">
                    <p className="text-xs italic">
                        {perGuestPricing
                            ? `Per guest pricing applicable post ${guests} guests`
                            : `Max guests allowed is ${guests}`}
                    </p>
                    <Close className="text-right ml-auto w-fit font-bold text-secondary text-sm underline cursor-pointer" />
                </div>
            </>
        );
    };

    if (isDesktop)
        return (
            <Popover>
                <PopoverTrigger
                    className={cn("w-full", styles.guestTrigger)}
                    ref={guestTriggerRef}
                >
                    <Trigger />
                </PopoverTrigger>
                <PopoverContent
                    className="flex flex-col gap-8"
                    style={{ width: guestPopoverWidth }}
                >
                    <Content />
                </PopoverContent>
            </Popover>
        );

    return (
        <Drawer>
            <DrawerTrigger className="w-full">
                <Trigger />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerDescription className="flex flex-col gap-8 max-h-[80vh] overflow-y-auto">
                        <Content />
                    </DrawerDescription>
                </DrawerHeader>
            </DrawerContent>
        </Drawer>
    );
};

export default GuestBooking;
