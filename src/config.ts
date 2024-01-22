import * as fs from "fs";
import path from "path";

const configFile = path.join(__dirname, "config.json");
if (!fs.existsSync(configFile)) {
  fs.writeFileSync(
    configFile,
    JSON.stringify(
      {
        baseDirectory: "/home/ren/Documents/arvandor/talekeeper-configs",
      },
      null,
      2,
    ),
  );
}
const config = JSON.parse(fs.readFileSync(configFile, "utf8")) as Config;

type Config = {
  baseDirectory: string;
};

export default config;
