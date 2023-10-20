import * as readline from "readline";
import { Background, getBackgrounds } from "../../models/backgrounds";
import { menu, option } from "../menu";

export function displayBackgroundSelectionMenu(
  backAction: string,
  back: () => void,
  callback: (background: Background) => void,
  rl: readline.Interface,
) {
  const backgrounds = getBackgrounds();
  menu(
    "Background",
    ...backgrounds.map((background) =>
      option(background.name, () => {
        callback(background);
      }),
    ),
    option(backAction, back),
  ).display(rl);
}
