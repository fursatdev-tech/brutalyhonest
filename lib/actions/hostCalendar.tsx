"use server";
import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import icalendar from "ical-generator";
// @ts-ignore
import ical from "ical.js";
import { revalidatePath } from "next/cache";

export const downloadHostCalendar = async (id?: string) => {
  try {
    const foundCalendar = await prismadb.calendar.findUnique({
      where: { id },
      include: { events: true },
    });

    const filename = "brutalyhonest-calendar.ics";

    if (!foundCalendar) throw new Error("Calendar not found");

    const events = foundCalendar.events.map((event) => {
      return {
        start: event.start,
        end: event.end,
        summary: event.title,
        description: event.description,
      };
    });

    const calendar = icalendar({
      prodId: "//brutalyhonest.ai//ical-generator//EN",
      events,
    });

    return new Response(calendar.toString(), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename='${filename}'`,
      },
      status: 200,
    });
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};

export const getHostCalendar = async () => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthorized");

  try {
    const foundCalendar = await prismadb.calendar.findUnique({
      where: { userId: user.id },
      include: { events: true },
    });

    if (foundCalendar) return foundCalendar;

    const host = await prismadb.host.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!host) throw new Error("Host not found");

    return await prismadb.calendar.create({
      data: {
        userId: user.id,
        hostId: host.id,
      },
      include: { events: true },
    });
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};

export const importCalendarByLink = async (link: string, id: string) => {
  try {
    const user = await currentUser();

    if (!user)
      return {
        error: "Unauthorized",
      };

    const calendar = await prismadb.calendar.findUnique({
      where: { id },
      include: { events: true },
    });

    if (!calendar) throw new Error("Calendar not found");

    const response = await fetch(link);

    const text = await response.text();

    const jcalData = ical.parse(text);
    const comp = new ical.Component(jcalData);
    const events = comp.getAllSubcomponents("vevent").map((event: any) => {
      const e = new ical.Event(event);

      return {
        title: e.summary,
        start: e.startDate.toJSDate(),
        end: e.endDate.toJSDate(),
        calendarId: calendar.id,
        description: e.description,
        allDay:
          e.startDate.toJSDate().toDateString() ===
          e.endDate.toJSDate().toDateString(),
      };
    });

    await prismadb.calendarEvent.createMany({
      data: events,
    });

    revalidatePath(`/hosting/calendar`);

    return { success: "Calendar imported" };
  } catch (error) {
    return { error: `Error: ${error}` };
  }
};
