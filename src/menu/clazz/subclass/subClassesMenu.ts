import { menu, option } from "../../menu";
import { Clazz, SubClass } from "../../../models/classes";
import * as readline from "readline";
import { green } from "chalk";
import * as uuid from "uuid";
import { displayClassMenu } from "../classMenu";
import { displaySubClassMenu } from "./subClassMenu";

export function displaySubClassesMenu(clazz: Clazz, rl: readline.Interface) {
  menu(
    clazz.name + " sub-classes",
    option(green("New"), () => {
      const subClass = new SubClass(
        uuid.v4(),
        "",
        {},
        {
          "==": "org.bukkit.inventory.ItemStack",
          v: 3337,
          type: "WHITE_BANNER",
          meta: {
            "==": "ItemMeta",
            "meta-type": "BANNER",
            patterns: [],
          },
        },
      );
      clazz.subClasses.push(subClass);
      clazz.save();
      console.log(green("Sub-class created."));
      displaySubClassMenu(clazz, subClass, rl);
    }),
    ...clazz.subClasses.map((subClass) =>
      option(subClass.name, () => {
        displaySubClassMenu(clazz, subClass, rl);
      }),
    ),
    option(`Back to ${clazz.name} menu`, () => {
      displayClassMenu(clazz, rl);
    }),
  ).display(rl);
}
