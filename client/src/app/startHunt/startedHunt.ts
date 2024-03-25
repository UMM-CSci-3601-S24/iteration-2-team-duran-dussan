import { CompleteHunt } from "../hunts/completeHunt";

export interface StartedHunt {
  hunt: CompleteHunt;
  accessCode: string;
}
