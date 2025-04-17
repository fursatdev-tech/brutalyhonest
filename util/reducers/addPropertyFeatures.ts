export interface AddPropertyFeaturesState {
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
}

export const initialState = (props: AddPropertyFeaturesState) => {
  return { ...props };
};

export enum ADD_PROPERTY_FEATURES {
  INCREMENT_GUESTS,
  DECREMENT_GUESTS,
  INCREMENT_BEDROOMS,
  INCREMENT_BEDS,
  DECREMENT_BEDS,
  DECREMENT_BEDROOMS,
  INCREMENT_BATHS,
  DECREMENT_BATHS,
}

export type AddPropertyFeaturesAction =
  | { type: ADD_PROPERTY_FEATURES.INCREMENT_GUESTS }
  | { type: ADD_PROPERTY_FEATURES.DECREMENT_GUESTS }
  | { type: ADD_PROPERTY_FEATURES.INCREMENT_BEDROOMS }
  | { type: ADD_PROPERTY_FEATURES.DECREMENT_BEDROOMS }
  | { type: ADD_PROPERTY_FEATURES.INCREMENT_BEDS }
  | { type: ADD_PROPERTY_FEATURES.DECREMENT_BEDS }
  | { type: ADD_PROPERTY_FEATURES.INCREMENT_BATHS }
  | { type: ADD_PROPERTY_FEATURES.DECREMENT_BATHS };

export const propertyFeaturesReducer = (
  state: AddPropertyFeaturesState,
  action: AddPropertyFeaturesAction
): AddPropertyFeaturesState => {
  switch (action.type) {
    case ADD_PROPERTY_FEATURES.INCREMENT_GUESTS:
      return { ...state, guests: state.guests + 1 };
    case ADD_PROPERTY_FEATURES.DECREMENT_GUESTS:
      return { ...state, guests: state.guests - 1 };
    case ADD_PROPERTY_FEATURES.INCREMENT_BEDROOMS:
      return { ...state, bedrooms: state.bedrooms + 1 };
    case ADD_PROPERTY_FEATURES.DECREMENT_BEDROOMS:
      return { ...state, bedrooms: state.bedrooms - 1 };
    case ADD_PROPERTY_FEATURES.INCREMENT_BEDS:
      return { ...state, beds: state.beds + 1 };
    case ADD_PROPERTY_FEATURES.DECREMENT_BEDS:
      return { ...state, beds: state.beds - 1 };
    case ADD_PROPERTY_FEATURES.INCREMENT_BATHS:
      return { ...state, baths: state.baths + 1 };
    case ADD_PROPERTY_FEATURES.DECREMENT_BATHS:
      return { ...state, baths: state.baths - 1 };
    default:
      return state;
  }
};
