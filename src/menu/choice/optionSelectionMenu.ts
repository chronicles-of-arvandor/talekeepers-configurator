import { Choice, ChoiceOption } from "../../models/choices";
import * as readline from "readline";
import { menu, option } from "../menu";

export function displayOptionSelectionMenu(
  choice: Choice,
  backAction: string,
  back: () => void,
  callback: (option: ChoiceOption) => void,
  rl: readline.Interface,
) {
  menu(
    "Option",
    ...choice.options.map((opt) =>
      option(opt.text, () => {
        callback(opt);
      }),
    ),
    option(backAction, back),
  ).display(rl);
}
