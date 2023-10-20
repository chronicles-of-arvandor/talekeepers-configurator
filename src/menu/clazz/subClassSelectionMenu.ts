import * as readline from "readline";
import { Clazz, getClasses, SubClass } from "../../models/classes";
import { menu, option } from "../menu";

export function displaySubClassSelectionMenu(
  clazz: Clazz,
  backAction: string,
  back: () => void,
  callback: (subClass: SubClass) => void,
  rl: readline.Interface,
) {
  const subClasses = clazz.subClasses;
  menu(
    "Subclass",
    ...subClasses.map((subClass) =>
      option(subClass.name, () => {
        callback(subClass);
      }),
    ),
    option(backAction, back),
  ).display(rl);
}
