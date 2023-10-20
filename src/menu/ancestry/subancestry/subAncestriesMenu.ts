import * as readline from "readline";
import { Ancestry, SubAncestry } from "../../../models/ancestries";
import { menu, option } from "../../menu";
import { displayAncestryMenu } from "../ancestryMenu";
import { displaySubAncestryMenu } from "./subAncestryMenu";
import * as uuid from "uuid";
import { Distance } from "../../../models/distance";
import { green } from "chalk";

export function displaySubAncestriesMenu(
  ancestry: Ancestry,
  rl: readline.Interface,
) {
  const subAncestries = ancestry.subAncestries;
  menu(
    ancestry.name + " sub-ancestries",
    option(green("New"), () => {
      const subAncestry = new SubAncestry(
        uuid.v4(),
        "",
        new Distance(0, "FEET"),
        16,
        1000,
        "2'",
        "6'",
        "120lb",
        "250lb",
        [],
        0,
        "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjQ3NDQ5NjZkMWQ0YmQ4MjFmOTczMjlhYmYyMjdlMzZjNjVkZmQ4YjEyYjMxZmM5NjYxNWI4Zjc4MDM2MWRlNCJ9fX0=",
      );
      ancestry.subAncestries.push(subAncestry);
      ancestry.save();
      console.log(green("Sub-ancestry created."));
      displaySubAncestryMenu(ancestry, subAncestry, rl);
    }),
    ...subAncestries.map((subAncestry) =>
      option(`${subAncestry.name} ${ancestry.name}`, () => {
        displaySubAncestryMenu(ancestry, subAncestry, rl);
      }),
    ),
    option(`Back to ${ancestry.name} menu`, () => {
      displayAncestryMenu(ancestry, rl);
    }),
  ).display(rl);
}
