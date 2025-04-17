import { ADD_PROPERTY_FEATURES } from "@/util/reducers/addPropertyFeatures";

interface Actions {
  increment: ADD_PROPERTY_FEATURES;
  decrement: ADD_PROPERTY_FEATURES;
}

interface Disables {
  decrement: boolean;
  increment: boolean;
}

export interface PropertyFeaturesItem {
  title: string;
  subtitle: string;
  state: number;
  disables: Disables;
  actions: Actions;
}
