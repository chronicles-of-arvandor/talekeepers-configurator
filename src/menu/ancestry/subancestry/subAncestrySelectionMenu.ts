import * as readline from "readline";
import {
  Ancestry,
  getAncestries,
  SubAncestry,
} from "../../../models/ancestries";
import { menu, option } from "../../menu";

export function displaySubAncestrySelectionMenu(
  ancestry: Ancestry,
  backAction: string,
  back: () => void,
  callback: (subAncestry: SubAncestry) => void,
  rl: readline.Interface,
) {
  const subAncestries = ancestry.subAncestries;
  menu(
    `${ancestry.name} sub-ancestry`,
    ...subAncestries.map((subAncestry) =>
      option(subAncestry.name, () => {
        callback(subAncestry);
      }),
    ),
    option(backAction, back),
  ).display(rl);
}
