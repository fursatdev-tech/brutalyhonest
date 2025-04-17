import { ADD_GUEST } from "@/util/reducers/addGuest";

interface Actions {
  increment: ADD_GUEST;
  decrement: ADD_GUEST;
}

interface Disables {
  decrement: boolean;
  increment: boolean;
}

export interface GuestDataItem {
  title: string;
  subtitle: string;
  subtitleClickable?: boolean;
  state: number;
  disables: Disables;
  actions: Actions;
}
