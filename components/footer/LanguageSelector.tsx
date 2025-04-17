"use client";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import { GoGlobe } from "react-icons/go";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

import { LANGUAGE_OPTIONS } from "./data";
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

const COOKIE_NAME = "googtrans";

interface ILanguage {
  language: string;
  code: string;
  country: string;
}

const LanguageSelector = () => {
  const [selected, setSelected] = useState<ILanguage>(LANGUAGE_OPTIONS[0]);

  useEffect(() => {
    const existingLanguageCookieValue = getCookie(COOKIE_NAME);

    let languageValue: string = "";

    if (existingLanguageCookieValue) {
      const sp = existingLanguageCookieValue.split("/");

      if (sp.length > 2) languageValue = sp[2];
    }

    if (!languageValue) return setCookie(COOKIE_NAME, `/auto/${selected.code}`);

    const foundSelected = LANGUAGE_OPTIONS.find(
      (option) => option.code === languageValue
    )!;

    setSelected(foundSelected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchLanguage = (evt: MouseEvent<HTMLDivElement>, lang: ILanguage) => {
    evt.preventDefault();

    deleteCookie(COOKIE_NAME, { path: "/", domain: ".brutalyhonest.ai" });
    deleteCookie(COOKIE_NAME, { path: "/", domain: "brutalyhonest.ai" });

    setCookie(COOKIE_NAME, `/auto/${lang.code}`);
    setSelected(lang);

    window.location.reload();
  };

  return (
    <div className="notranslate skiptranslate">
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center text-xs md:text-sm font-semibold hover:underline cursor-pointer">
            <GoGlobe className="mr-2 text-sm md:text-xl" />
            <span className="pr-1">{selected?.language}</span>
            <span>({selected?.country})</span>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Choose a language and region</DialogTitle>
            <DialogDescription asChild>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mt-4">
                {LANGUAGE_OPTIONS.map((languageOption) => (
                  <DialogClose key={languageOption.code} asChild>
                    <div
                      className={cn(
                        "flex cursor-pointer flex-col rounded-xl border p-2 px-4 hover:bg-muted-background border-transparent",
                        languageOption.country === selected?.country &&
                          "border-foreground"
                      )}
                      onClick={(e) => switchLanguage(e, languageOption)}
                    >
                      <p>{languageOption.language}</p>
                      <p className="text-secondary-foreground">
                        {languageOption.country}
                      </p>
                    </div>
                  </DialogClose>
                ))}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LanguageSelector;
