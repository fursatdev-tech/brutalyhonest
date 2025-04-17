"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import axios from "axios";

interface TravelSection {
  name: string;
  title: string;
  content: Array<{ [key: string]: string[] | string }>;
  links?: Array<{ name: string; url: string }>;
  tip?: string;
}

interface TravelGuideProps {
  tourId: { tourId: string[] };
}

const TravelGuide = ({ tourId }: TravelGuideProps) => {
  const [travelSections, setTravelSections] = useState<TravelSection[]>([]);

  useEffect(() => {
    async function fetchTourGuide() {
      try {
        const response = await axios.get(
          `http://localhost:3000/tourGuide/guide?tourId=${tourId.tourId[0]}`
        );
        setTravelSections(response.data.data.options); // Update state
      } catch (error) {
        setTravelSections([]);
        console.log("Error fetching travel guide:", error);
      }
    }

    fetchTourGuide();
  }, [tourId]);

  if (travelSections.length === 0) {
    return <div></div>;
  }

  return (
    <div className="w-full py-6 md:py-8 lg:py-10">
      <Card className="max-w-8xl mx-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex flex-col items-start gap-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Travel Guide
            </h2>

            {/* Mobile View: Full-width cards */}
            <div className="block md:hidden w-full space-y-4">
              {travelSections.map((section, index) => (
                <Card
                  key={index}
                  className="w-full bg-card hover:bg-card/90 transition-colors"
                >
                  <div className="p-4 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      {section.title}
                    </h3>

                    <div className="space-y-3">
                      {section.content.map((item, i) => {
                        // Ensure that the item is not undefined or null, and is an object
                        if (
                          !item ||
                          typeof item !== "object" ||
                          Array.isArray(item)
                        ) {
                          return null; // Return null if it's invalid or empty object
                        }

                        const keys = Object.keys(item);
                        if (keys.length === 0) return null; // If the object has no keys, skip this item

                        const key = keys[0]; // Get the first key from the object
                        const value = item[key]; // Get the corresponding value (which is an array or string)

                        return (
                          <div key={i} className="text-sm text-foreground/90">
                            <p>{key}</p>
                            {/* Check if the value is an array */}
                            {Array.isArray(value) && value.length > 0 ? (
                              <ul className="list-disc pl-4 space-y-1.5">
                                {value.map((subItem, j) => (
                                  <li key={j} className="leading-relaxed">
                                    {subItem}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              value && (
                                <p className="leading-relaxed">{value}</p>
                              )
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {section.links && (
                      <div className="flex flex-wrap gap-2">
                        {section.links.map((link, i) => (
                          <Button
                            key={i}
                            asChild
                            variant="outline"
                            size="sm"
                            className="text-foreground/80 hover:text-foreground"
                          >
                            <Link
                              href={link.url}
                              target="_blank"
                              className="flex items-center gap-1.5"
                            >
                              {link.name}
                              <ExternalLinkIcon className="w-4 h-4" />
                            </Link>
                          </Button>
                        ))}
                      </div>
                    )}

                    {section.tip && (
                      <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg">
                        <p className="text-sm text-primary/80">{section.tip}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop View: Tabbed interface */}
            <div className="hidden md:block w-full">
              <Tabs defaultValue="flights" className="w-full">
                <TabsList className="w-full justify-start mb-6 bg-muted/50 p-1 rounded-lg">
                  {travelSections.map((section) => (
                    <TabsTrigger
                      key={section.name}
                      value={section.name}
                      className="flex-1 data-[state=active]:bg-background"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-xl">
                          {section.title.split(" ")[0]}
                        </span>
                        <span className="hidden lg:inline text-muted-foreground">
                          {section.title.split(" ").slice(1).join(" ")}
                        </span>
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {travelSections.map((section) => (
                  <TabsContent key={section.name} value={section.name}>
                    <Card className="bg-card p-6">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          {section.content.map((item, i) => (
                            <div key={i} className="text-foreground/90">
                              {typeof item === "object" ? (
                                // If item is an object, iterate over its keys
                                Object.keys(item).map((key, j) => {
                                  const value = item[key];
                                  return (
                                    <div key={j} className="space-y-2">
                                      {/* Render the key in bold */}
                                      <p className="font-bold">{key}</p>
                                      {/* Render the value accordingly */}
                                      {Array.isArray(value) ? (
                                        // If the value is an array, render it as a list
                                        <ul className="list-disc pl-6">
                                          {value.map((subItem, k) => (
                                            <li
                                              key={k}
                                              className="leading-relaxed"
                                            >
                                              {subItem}
                                            </li>
                                          ))}
                                        </ul>
                                      ) : (
                                        // If the value is a string, render it as a paragraph
                                        <p className="leading-relaxed">
                                          {value}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })
                              ) : (
                                // If item is a string, render it directly
                                <p className="leading-relaxed">{item}</p>
                              )}
                            </div>
                          ))}
                        </div>

                        {section.links && (
                          <div className="flex flex-wrap gap-3">
                            {section.links.map((link, i) => (
                              <Button
                                key={i}
                                asChild
                                variant="outline"
                                className="text-foreground/80 hover:text-foreground"
                              >
                                <Link
                                  href={link.url}
                                  target="_blank"
                                  className="flex items-center gap-2"
                                >
                                  {link.name}
                                  <ExternalLinkIcon className="w-4 h-4" />
                                </Link>
                              </Button>
                            ))}
                          </div>
                        )}

                        {section.tip && (
                          <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                            <p className="text-primary/80">{section.tip}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ExternalLinkIcon = ({ className = "w-4 h-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
    />
  </svg>
);

export default TravelGuide;
