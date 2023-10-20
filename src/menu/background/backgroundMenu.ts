import * as readline from "readline";
import { Background } from "../../models/backgrounds";
import { menu, option } from "../menu";
import { displayBackgroundsMenu } from "./backgroundsMenu";
import { gray, green, red } from "chalk";
import * as fs from "fs";

export function displayBackgroundMenu(
  background: Background,
  rl: readline.Interface,
) {
  menu(
    background.name,
    option("Name " + gray(`(${background.name})`), () => {
      setBackgroundName(background, rl);
    }),
    option("Description " + gray(`(${background.description})`), () => {
      setBackgroundDescription(background, rl);
    }),
    option(red("Delete"), () => {
      fs.rmSync(background.file);
      console.log(green("Background deleted."));
      displayBackgroundsMenu(rl);
    }),
    option("Back to backgrounds menu", () => {
      displayBackgroundsMenu(rl);
    }),
  ).display(rl);
}

function setBackgroundName(background: Background, rl: readline.Interface) {
  rl.question("Name: ", (answer) => {
    background.name = answer;
    background.save();
    console.log(green("Name set."));
    displayBackgroundMenu(background, rl);
  });
}

function setBackgroundDescription(
  background: Background,
  rl: readline.Interface,
) {
  rl.question("Description: ", (answer) => {
    background.description = answer;
    background.save();
    console.log(green("Description set."));
    displayBackgroundMenu(background, rl);
  });
}
