// Auth
export const registerUser = "/api/auth/register";

// Listings
export const getAllListings = "/api/listings/get-listings";
export const getFavouriteIds = "/api/listings/get-favourite-ids";
export const saveOrUpdateListing = "/api/listings";
export const createListingAssistant = "/api/create-assistant";
export const publishPropertyHost = "/api/listings/publish-property";
export const getPublishedProperty = (id: string) =>
  `/api/listings/get-published-property/${id}`;

// Reservations
export const checkoutSession = "/api/checkout-sessions";
export const getMyReservations = "/api/reservations";
export const getMyTourReservations = "/api/tour-reservations";
export const cancelMyReservation = (id: string) => `/api/reservations/${id}`;

// Reviews
export const saveOrUpdateReview = "/api/reviews";

// Email
export const hostOnboarding = "/api/email/host-onboarding";
export const listingCreated = "/api/email/listing-created";

// Thread
export const actionClickHandler = "/api/actions/click-handler";
export const getAllThreads = (messageId: string) =>
  `/api/chat/get-all-threads/${messageId}`;
export const getSocialNetworks = (reservationId: string, text: string) =>
  `/api/chat/get-social-networks/${reservationId}/${text}`;

// Categories
export const getCategories = (filter: string) => `/api/categories/${filter}`;

// Airbnb Url
export const getPropertyId = "/api/ext/propertyId";

// AI
export const guestAutoCompleteAI = (messageId: string) =>
  `/api/ai-guest/${messageId}`;

// Policy
export const getCancellationPolicies = "/api/policy";

// Host
export const acceptListingTerms = "/api/host/accept-terms";

// Tour
export const getTourDestinations = "/api/tour/get-destinations";
export const getTourOtherDestinations = "/api/tour/get-other-destinations";
export const getTourMonths = "/api/tour/get-months";
export const getTourDurations = "/api/tour/get-durations";
export const getTourActivities = "/api/tour/get-activities";
