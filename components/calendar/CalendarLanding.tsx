"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { Calendar, CalendarEvent } from "@prisma/client";
import { useCallback, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import copyToClipboard from "@/lib/copyToClipboard";
import { Input } from "@/components/ui/input";
import { importCalendarByLink } from "@/lib/actions/hostCalendar";
import { showError } from "@/util/catchError";
import { toast } from "@/components/ui/use-toast";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface Props {
  calendar: Calendar & { events: CalendarEvent[] };
}

const CalendarLanding = ({ calendar }: Props) => {
  const link = `https://brutalyhonest.ai/calendar/${calendar.id}`;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [extLink, setExtLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const copyLink = useCallback(async () => {
    copyToClipboard({ link });
  }, [link]);

  const importCalendar = async () => {
    setLoading(true);

    const { error, success } = await importCalendarByLink(extLink, calendar.id);

    setLoading(false);

    if (error) return showError({ message: error });

    toast({ title: success });
    setExtLink("");
  };

  const FullCalendarWrapper = () => {
    return (
      <FullCalendar
        plugins={[
          resourceTimelinePlugin,
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          multiMonthPlugin,
        ]}
        contentHeight="80vh"
        initialView="dayGridMonth"
        headerToolbar={{
          ...(isDesktop && { left: "prev,next today", center: "title" }),
          right: "multiMonthYear,dayGridMonth",
        }}
        nowIndicator={true}
        editable={false}
        droppable={false}
        selectable={false}
        selectMirror={true}
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
        events={calendar.events}
        displayEventTime={false}
        eventDisplay="block"
        eventClassNames="px-3 py-1 rounded-md whitespace-normal font-medium"
        progressiveEventRendering={true}
        // dateClick={(arg) => {
        //   console.log(arg);
        // }}
        // eventClick={(arg) => {
        //   console.log(arg);
        // }}
        // drop={(arg) => {
        //   console.log(arg);
        // }}
      />
    );
  };

  const ConnectCalendar = () => {
    return (
      <>
        <p className="font-bold">Connect calendars</p>

        <div className="space-y-2">
          <p className="font-bold">Step 1</p>
          <p className="text-sm text-muted-foreground font-light">
            Add this link to the other website.
          </p>

          <div className="border-2 rounded-xl px-3 py-2">
            <p className="text-xs text-muted-foreground font-light">
              BrutalyHonest calendar link
            </p>

            <div className="flex items-center">
              <input
                type="text"
                className="w-full text-xs bg-transparent font-semibold"
                value={`https://brutalyhonest.ai/calendar/${calendar.id}`}
                readOnly
                disabled
              />

              <Button size="sm" className="ml-2 h-7" onClick={copyLink}>
                Copy
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-bold">Step 2</p>
          <p className="text-sm text-muted-foreground font-light">
            Get a link ending in .ics from the other website and add it below.
          </p>

          <div className="border-2 rounded-xl px-3 py-2 focus-within:border-primary transition">
            <p className="text-xs text-muted-foreground font-light">
              Other website link
            </p>

            <Input
              type="email"
              placeholder="Paste link here"
              className="border-0 p-0 text-sm h-6 !rounded-none"
              value={extLink}
              onChange={(e) => setExtLink(e.target.value)}
            />
          </div>
        </div>

        <Button
          className="w-full"
          disabled={!extLink || loading}
          loading={loading}
          onClick={importCalendar}
        >
          Add calendar
        </Button>
      </>
    );
  };

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 md:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="w-full" variant="outline">
              Connect calendar
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerDescription className="max-h-[80vh] overflow-y-auto space-y-8 text-left">
                <ConnectCalendar />
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="col-span-12 md:col-span-9">
        <FullCalendarWrapper />
      </div>

      <div className="col-span-12 md:col-span-3 border rounded-xl shadow-sm p-4 md:p-6 h-[80vh] space-y-8 hidden md:block">
        <ConnectCalendar />
      </div>
    </div>
  );
};

export default CalendarLanding;
