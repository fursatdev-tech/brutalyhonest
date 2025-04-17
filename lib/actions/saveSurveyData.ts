"use server";

import { Country, State, City } from "country-state-city";

import { SafeToursSurveys } from "@/util/types";
import prismadb from "../prismadb";

export const saveSurveyData = async (
  data: SafeToursSurveys,
  username: string
) => {
  if (!username) return { error: "Invalid link. Please contact the host." };

  try {
    const user = await prismadb.user.findUnique({
      where: {
        username,
      },
      select: { clerkId: true },
    });

    if (!user) return { error: "User not found." };

    const foundTour = await prismadb.tours.findUnique({
      where: {
        userId: user.clerkId,
      },
      select: { id: true },
    });

    if (!foundTour) return { error: "Tour not found." };

    data.location.state =
      State.getStateByCodeAndCountry(data.location.state, data.location.country)
        ?.name || data.location.state;

    data.location.country =
      Country.getCountryByCode(data.location.country)?.name ||
      data.location.country;

    const createdSurvey = await prismadb.toursSurveys.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        age: data.age,
        budget: data.budget,
        estimatedTrips: data.estimatedTrips,
        location: data.location,
        profession: data.profession,
        purpose: data.purpose,
        toursId: foundTour.id,
        hostClerkId: user.clerkId,
      },
    });

    const surveyId = createdSurvey.id;

    await prismadb.surveyDestination.createMany({
      data: (data.destinations as string[]).map((destinationId) => ({
        destinationId,
        surveyId,
      })),
    });

    if (data.otherDestinations.length > 0)
      await prismadb.surveyOtherDestination.createMany({
        data: (data.otherDestinations as string[]).map((destinationId) => ({
          destinationId,
          surveyId,
        })),
      });

    await prismadb.surveyMonth.createMany({
      data: (data.months as string[]).map((monthId) => ({
        monthId,
        surveyId,
      })),
    });

    await prismadb.surveyDuration.createMany({
      data: (data.tripDuration as string[]).map((durationId) => ({
        durationId,
        surveyId,
      })),
    });

    await prismadb.surveyActivity.createMany({
      data: (data.tripActivities as string[]).map((activityId) => ({
        activityId,
        surveyId,
      })),
    });

    return { message: "Survey data saved successfully." };
  } catch (error: any) {
    return { error: error.message || error };
  }
};
