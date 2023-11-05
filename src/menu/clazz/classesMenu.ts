import * as readline from "readline";
import { Clazz, getClasses, getClassesDirectory } from "../../models/classes";
import { menu, option } from "../menu";
import { green } from "chalk";
import { displayMainMenu } from "../../index";
import * as uuid from "uuid";
import path from "path";
import { displayClassMenu } from "./classMenu";

export function displayClassesMenu(rl: readline.Interface) {
  const classes = getClasses();
  menu(
    "Classes",
    option(green("New"), () => {
      rl.question("Name: ", (name) => {
        const fileName = name.replace(/[^A-z0-9]/g, "_") + ".yml";
        const file = path.join(getClassesDirectory(), fileName);
        const clazz = new Clazz(
          file,
          uuid.v4(),
          name,
          [],
          3,
          "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNjQ3NDQ5NjZkMWQ0YmQ4MjFmOTczMjlhYmYyMjdlMzZjNjVkZmQ4YjEyYjMxZmM5NjYxNWI4Zjc4MDM2MWRlNCJ9fX0=",
          1,
          {},
        );
        clazz.save();
        console.log(green("Class created."));
        displayClassMenu(clazz, rl);
      });
    }),
    ...classes.map((clazz) =>
      option(clazz.name, () => {
        displayClassMenu(clazz, rl);
      }),
    ),
    option("Back to main menu", () => {
      displayMainMenu(rl);
    }),
  ).display(rl);
}
