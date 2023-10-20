import * as readline from "readline";
import { gray } from "chalk";

type MenuOption = {
  text: string;
  action: () => void;
};

class Menu {
  title?: string;
  options: MenuOption[];

  constructor(title?: string, options?: MenuOption[]) {
    this.title = title;
    this.options = options ?? [];
  }

  display(rl: readline.Interface) {
    rl.question(
      (this.title
        ? gray("-".repeat(this.title.length)) +
          "\n" +
          this.title +
          "\n" +
          gray("-".repeat(this.title.length) + "\n")
        : "") +
        this.options
          .map((option, index) => `${index + 1}) ${option.text}`)
          .join("\n") +
        "\n",
      (answer) => {
        const option = this.options[parseInt(answer) - 1];
        if (option) {
          option.action();
        } else {
          console.log("Invalid choice.");
          this.display(rl);
        }
      },
    );
  }
}

export function menu(title?: string, ...options: MenuOption[]): Menu {
  return new Menu(title, options);
}

export function option(text: string, action: () => void): MenuOption {
  return {
    text,
    action,
  };
}
