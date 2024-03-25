import { CompleteHunt } from "../hunts/completeHunt";

export interface StartedHunt {
  completeHunt: CompleteHunt;
  accessCode: string;
}
