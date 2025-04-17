export interface AddGuestState {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

export const initialState = (props: AddGuestState) => {
  return { ...props };
};

export enum ADD_GUEST {
  INCREMENT_ADULT,
  DECREMENT_ADULT,
  INCREMENT_CHILD,
  DECREMENT_CHILD,
  INCREMENT_INFANT,
  DECREMENT_INFANT,
  INCREMENT_PET,
  DECREMENT_PET,
}

export type AddGuestAction =
  | { type: ADD_GUEST.INCREMENT_ADULT }
  | { type: ADD_GUEST.DECREMENT_ADULT }
  | { type: ADD_GUEST.INCREMENT_CHILD }
  | { type: ADD_GUEST.DECREMENT_CHILD }
  | { type: ADD_GUEST.INCREMENT_INFANT }
  | { type: ADD_GUEST.DECREMENT_INFANT }
  | { type: ADD_GUEST.INCREMENT_PET }
  | { type: ADD_GUEST.DECREMENT_PET };

export const guestReducer = (
  state: AddGuestState,
  action: AddGuestAction
): AddGuestState => {
  switch (action.type) {
    case ADD_GUEST.INCREMENT_ADULT:
      return { ...state, adults: state.adults + 1 };
    case ADD_GUEST.DECREMENT_ADULT:
      return { ...state, adults: state.adults - 1 };
    case ADD_GUEST.INCREMENT_CHILD:
      return { ...state, children: state.children + 1 };
    case ADD_GUEST.DECREMENT_CHILD:
      return { ...state, children: state.children - 1 };
    case ADD_GUEST.INCREMENT_INFANT:
      return { ...state, infants: state.infants + 1 };
    case ADD_GUEST.DECREMENT_INFANT:
      return { ...state, infants: state.infants - 1 };
    case ADD_GUEST.INCREMENT_PET:
      return { ...state, pets: state.pets + 1 };
    case ADD_GUEST.DECREMENT_PET:
      return { ...state, pets: state.pets - 1 };
    default:
      return state;
  }
};
