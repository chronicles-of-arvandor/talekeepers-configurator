import * as readline from "readline";
import {
  getAncestriesDirectory,
  Ancestry,
  getAncestries,
} from "../../models/ancestries";
import { displayAncestryMenu } from "./ancestryMenu";
import { menu, option } from "../menu";
import { displayMainMenu } from "../../index";
import * as uuid from "uuid";
import { Distance } from "../../models/distance";
import * as path from "path";
import { green } from "chalk";

export function displayAncestriesMenu(rl: readline.Interface) {
  const ancestries = getAncestries();
  menu(
    "Ancestries",
    option(green("New"), () => {
      rl.question("Name: ", (name) => {
        const fileName = name.replace(/[^A-z0-9]/g, "_") + ".yml";
        const file = path.join(getAncestriesDirectory(), fileName);
        const ancestry = new Ancestry(
          file,
          uuid.v4(),
          name,
          "",
          [],
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
        ancestry.save();
        console.log(green("Ancestry created."));
        displayAncestryMenu(ancestry, rl);
      });
    }),
    ...ancestries.map((ancestry) =>
      option(ancestry.name, () => {
        displayAncestryMenu(ancestry, rl);
      }),
    ),
    option("Back to main menu", () => {
      displayMainMenu(rl);
    }),
  ).display(rl);
}
