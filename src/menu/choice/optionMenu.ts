import { ChoiceOption } from "../../models/choices";
import * as readline from "readline";
import { menu, option } from "../menu";
import { gray, green, red } from "chalk";
import { displayPrerequisitesMenu } from "../prerequisite/prerequisitesMenu";

export function displayOptionMenu(
  opt: ChoiceOption,
  backAction: string,
  back: () => void,
  callback: (opt: ChoiceOption) => void,
  del: () => void,
  rl: readline.Interface,
) {
  menu(
    "Option",
    option("Text " + gray(`(${opt.text})`), () => {
      rl.question("Text: ", (text) => {
        opt.text = text;
        displayOptionMenu(opt, backAction, back, callback, del, rl);
      });
    }),
    option("Prerequisites " + gray(`(${opt.prerequisites.length})`), () => {
      displayPrerequisitesMenu(
        "Back to option menu",
        () => {
          displayOptionMenu(opt, backAction, back, callback, del, rl);
        },
        (prerequisites) => {
          opt.prerequisites = prerequisites;
          displayOptionMenu(opt, backAction, back, callback, del, rl);
        },
        rl,
        opt.prerequisites,
      );
    }),
    option(green("Save"), () => {
      callback(opt);
    }),
    option(red("Delete"), () => {
      del();
      back();
    }),
    option(backAction, back),
  ).display(rl);
}
