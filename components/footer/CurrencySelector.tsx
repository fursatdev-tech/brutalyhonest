"use client";
import { MouseEvent, useEffect, useState } from "react";
import { getCookie } from "cookies-next";

import { CURRENCY_OPTIONS, ICurrencyOption } from "./data";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  getCurrencyCookie,
  setCurrencyCookie,
} from "@/lib/actions/setCurrencyCookie";
import { Skeleton } from "../ui/skeleton";

const CurrencySelector = () => {
  const [selected, setSelected] = useState({} as ICurrencyOption);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const existingCookieValue = getCookie("currency");

  useEffect(() => {
    getCurrencyCookie(existingCookieValue).then(setSelected);
  }, [existingCookieValue]);

  const changeCurrency = async (
    e: MouseEvent<HTMLDivElement>,
    currencyOption: ICurrencyOption
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);

    await setCurrencyCookie(currencyOption.currency.split(" - ")[0]);

    setSelected(currencyOption);

    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center text-xs md:text-sm font-semibold hover:underline cursor-pointer">
          <span className="hidden pr-1 md:block">{selected.currency}</span>
          <span className="block pr-1 md:hidden">
            {selected?.currency?.split(" - ").reverse().join(" ")}
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Choose a currency</DialogTitle>
          <DialogDescription>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mt-4">
              {loading ? (
                <>
                  {Array.from({ length: CURRENCY_OPTIONS.length }).map(
                    (_, i) => (
                      <div className="flex flex-col" key={i}>
                        <Skeleton className="w-full h-12" />
                      </div>
                    )
                  )}
                </>
              ) : (
                <>
                  {CURRENCY_OPTIONS.map((currencyOption) => (
                    <DialogClose key={currencyOption.region} asChild>
                      <div
                        className={cn(
                          "flex cursor-pointer flex-col rounded-xl border-2 p-2 px-4 hover:bg-muted-background border-transparent",
                          selected.region === currencyOption.region &&
                            "border-border"
                        )}
                        onClick={(e) => changeCurrency(e, currencyOption)}
                      >
                        <p>{currencyOption.region}</p>
                        <p className="text-secondary-foreground">
                          {currencyOption.currency}
                        </p>
                      </div>
                    </DialogClose>
                  ))}
                </>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CurrencySelector;
