import * as readline from "readline";
import { menu, option } from "./menu/menu";
import { displayAncestriesMenu } from "./menu/ancestry/ancestriesMenu";
import { displayBackgroundsMenu } from "./menu/background/backgroundsMenu";
import { displayChoicesMenu } from "./menu/choice/choicesMenu";
import { displayEffectsMenu } from "./menu/effect/effectsMenu";
import { runValidations } from "./action/runValidations";
import { displayClassesMenu } from "./menu/clazz/classesMenu";

export function displayMainMenu(rl: readline.Interface) {
  menu(
    "Main menu",
    option("Ancestries", () => {
      displayAncestriesMenu(rl);
    }),
    option("Backgrounds", () => {
      displayBackgroundsMenu(rl);
    }),
    option("Choices", () => {
      displayChoicesMenu(rl);
    }),
    option("Classes", () => {
      displayClassesMenu(rl);
    }),
    option("Effects", () => {
      displayEffectsMenu(rl);
    }),
    // option('Feats', () => {
    //   displayFeatsMenu(rl);
    // }),
    // option('Languages', () => {
    //   displayLanguagesMenu(rl);
    // }),
    // option('Spells', () => {
    //   displaySpellsMenu(rl);
    // }),
    option("Validate", () => {
      runValidations(rl);
    }),
    option("Exit", () => {
      rl.close();
    }),
  ).display(rl);
}

const rl = readline.createInterface(process.stdin, process.stdout);
rl.on("close", () => {
  process.exit();
});

displayMainMenu(rl);
