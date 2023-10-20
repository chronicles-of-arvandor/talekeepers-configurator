import * as readline from "readline";
import { Ancestry, getAncestries } from "../../models/ancestries";
import { menu, option } from "../menu";

export function displayAncestrySelectionMenu(
  backAction: string,
  back: () => void,
  callback: (ancestry: Ancestry) => void,
  rl: readline.Interface,
) {
  const ancestries = getAncestries();
  menu(
    "Ancestry",
    ...ancestries.map((ancestry) =>
      option(ancestry.name, () => {
        callback(ancestry);
      }),
    ),
    option(backAction, back),
  ).display(rl);
}
