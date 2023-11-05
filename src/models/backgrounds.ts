import * as path from "path";
import * as fs from "fs";
import { parse, stringify } from "yaml";
import { getBaseDirectory } from "../settings";
import { ConfigurationSerializable } from "./configurationSerializable";
import NodeCache from "node-cache";

export const getBackgroundsDirectory = () =>
  path.join(getBaseDirectory(), "backgrounds");

const backgroundCache = new NodeCache();

export const getBackgrounds = () => {
  return fs.readdirSync(getBackgroundsDirectory()).map((backgroundFile) => {
    const backgroundPath = path.join(getBackgroundsDirectory(), backgroundFile);
    const cachedBackground = backgroundCache.get<Background>(backgroundPath);
    if (cachedBackground) {
      return cachedBackground;
    } else {
      const background = loadBackground(backgroundPath);
      backgroundCache.set(backgroundPath, background);
      return background;
    }
  });
};

fs.watch(getBackgroundsDirectory(), (eventType, filename) => {
  if (filename) {
    const backgroundPath = path.join(getBackgroundsDirectory(), filename);
    backgroundCache.del(backgroundPath);
    console.log(`Purging cached background ${backgroundPath} due to update`);
  }
});

export const getBackgroundById = (id: string) => {
  return getBackgrounds().find((background) => background.id === id);
};

export const getBackgroundByName = (name: string) => {
  return getBackgrounds().find((background) => background.name === name);
};

export class Background implements ConfigurationSerializable {
  file: string;
  id: string;
  name: string;
  description: string;

  constructor(file: string, id: string, name: string, description: string) {
    this.file = file;
    this.id = id;
    this.name = name;
    this.description = description;
  }

  serialize() {
    return {
      "==": "Background",
      id: this.id,
      name: this.name,
      description: this.description,
    };
  }

  save() {
    fs.writeFileSync(
      this.file,
      stringify({
        background: this.serialize(),
      }),
    );
  }
}

function deserializeBackground(
  file: string,
  serialized: { [key: string]: any },
) {
  return new Background(
    file,
    serialized["id"],
    serialized["name"],
    serialized["description"],
  );
}

function loadBackground(file: string) {
  return deserializeBackground(
    file,
    parse(fs.readFileSync(file, "utf8")).background,
  );
}
