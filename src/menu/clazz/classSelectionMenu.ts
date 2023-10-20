import * as readline from "readline";
import { Clazz, getClasses } from "../../models/classes";
import { menu, option } from "../menu";

export function displayClassSelectionMenu(
  backAction: string,
  back: () => void,
  callback: (clazz: Clazz) => void,
  rl: readline.Interface,
) {
  const classes = getClasses();
  menu(
    "Class",
    ...classes.map((clazz) =>
      option(clazz.name, () => {
        callback(clazz);
      }),
    ),
    option(backAction, back),
  ).display(rl);
}
