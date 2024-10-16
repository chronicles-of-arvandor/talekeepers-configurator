import * as path from "path";
import * as fs from "fs";
import { parse, stringify } from "yaml";
import { getBaseDirectory } from "../settings";
import { ConfigurationSerializable } from "./configurationSerializable";
import NodeCache from "node-cache";
import { gray } from "chalk";

export const getClassesDirectory = () =>
  path.join(getBaseDirectory(), "classes");

const classCache = new NodeCache();

export const getClasses = () => {
  return fs.readdirSync(getClassesDirectory()).map((classFile) => {
    const classPath = path.join(getClassesDirectory(), classFile);
    const cachedClass = classCache.get<Clazz>(classPath);
    if (cachedClass) {
      return cachedClass;
    } else {
      const clazz = deserializeClass(
        classPath,
        parse(fs.readFileSync(classPath, "utf8")).class,
      );
      classCache.set(classPath, clazz);
      return clazz;
    }
  });
};

fs.watch(getClassesDirectory(), (eventType, filename) => {
  if (filename) {
    const classPath = path.join(getClassesDirectory(), filename);
    classCache.del(classPath);
    console.log(gray(`Purging cached class ${classPath} due to update`));
  }
});

export const getClassById = (id: string) =>
  getClasses().find((clazz) => clazz.id === id);

export class ClassFeature implements ConfigurationSerializable {
  name: string;
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "ClassFeature",
      name: this.name,
      description: this.description,
    };
  }
}

export class SubClass implements ConfigurationSerializable {
  id: string;
  name: string;
  features: { [level: number]: ClassFeature[] };
  icon: any;

  constructor(
    id: string,
    name: string,
    features: { [level: number]: ClassFeature[] },
    icon: any,
  ) {
    this.id = id;
    this.name = name;
    this.features = features;
    this.icon = icon;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "SubClass",
      id: this.id,
      name: this.name,
      features: Object.fromEntries(
        Object.entries(this.features).map(([level, features]) => {
          return [level, features.map((feature) => feature.serialize())];
        }),
      ),
      icon: this.icon,
    };
  }
}

function deserializeSubClass(serialized: { [key: string]: any }) {
  const features = serialized["features"] ?? {};
  return new SubClass(
    serialized["id"],
    serialized["name"],
    Object.fromEntries(
      Object.entries(
        features as { [level: string]: { [key: string]: string }[] },
      ).map(([level, features]: [string, { [key: string]: any }[]]) => {
        return [
          parseInt(level),
          features.map((feature) => {
            return new ClassFeature(feature["name"], feature["description"]);
          }),
        ];
      }),
    ),
    serialized["icon"],
  );
}

export class Clazz implements ConfigurationSerializable {
  file: string;
  id: string;
  name: string;
  subClasses: SubClass[];
  subClassSelectionLevel: number;
  skullTexture: string;
  baseHp: number;
  features: { [level: number]: ClassFeature[] };

  constructor(
    file: string,
    id: string,
    name: string,
    subClasses: SubClass[],
    subClassSelectionLevel: number,
    skullTexture: string,
    baseHp: number,
    features: { [level: number]: ClassFeature[] },
  ) {
    this.file = file;
    this.id = id;
    this.name = name;
    this.subClasses = subClasses;
    this.subClassSelectionLevel = subClassSelectionLevel;
    this.skullTexture = skullTexture;
    this.baseHp = baseHp;
    this.features = features;
  }

  getSubClassById(id: string) {
    return this.subClasses.find((subClass) => subClass.id === id);
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "Class",
      id: this.id,
      name: this.name,
      "sub-classes": this.subClasses.map((subClass) => subClass.serialize()),
      "sub-class-selection-level": this.subClassSelectionLevel,
      "skull-texture": this.skullTexture,
      "base-hp": this.baseHp,
      features: this.features,
    };
  }

  save() {
    fs.writeFileSync(
      this.file,
      stringify({
        class: this.serialize(),
      }),
    );
  }
}

function deserializeClass(file: string, serialized: { [key: string]: any }) {
  return new Clazz(
    file,
    serialized["id"],
    serialized["name"],
    serialized["sub-classes"].map((subClass: { [key: string]: any }) =>
      deserializeSubClass(subClass),
    ),
    serialized["sub-class-selection-level"],
    serialized["skull-texture"],
    serialized["base-hp"],
    serialized["features"],
  );
}
