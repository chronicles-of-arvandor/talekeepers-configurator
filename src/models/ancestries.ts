import * as path from "path";
import * as fs from "fs";
import { parse } from "yaml";
import { getBaseDirectory } from "../settings";
import { ConfigurationSerializable } from "./configurationSerializable";
import { Distance } from "./distance";
import * as yaml from "yaml";

export const getAncestriesDirectory = () =>
  path.join(getBaseDirectory(), "ancestries");

export const getAncestries = () => {
  return fs.readdirSync(getAncestriesDirectory()).map((ancestryFile) => {
    const ancestryPath = path.join(getAncestriesDirectory(), ancestryFile);
    return loadAncestry(ancestryPath);
  });
};

export const getAncestryById = (id: string) => {
  return getAncestries().find((ancestry) => ancestry.id === id);
};

export const getAncestryByName = (name: string) => {
  return getAncestries().find((ancestry) => ancestry.name === name);
};

export class AncestryTrait implements ConfigurationSerializable {
  name: string;
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "AncestryTrait",
      name: this.name,
      description: this.description,
    };
  }
}

export class SubAncestry implements ConfigurationSerializable {
  id: string;
  name: string;
  darkVision: Distance | undefined;
  minimumAge: number;
  maximumAge: number;
  minimumHeight: string;
  maximumHeight: string;
  minimumWeight: string;
  maximumWeight: string;
  traits: AncestryTrait[];
  bonusHpPerLevel: number | undefined;
  skullTexture: string;

  constructor(
    id: string,
    name: string,
    darkVision: Distance | undefined,
    minimumAge: number,
    maximumAge: number,
    minimumHeight: string,
    maximumHeight: string,
    minimumWeight: string,
    maximumWeight: string,
    traits: AncestryTrait[],
    bonusHpPerLevel: number | undefined,
    skullTexture: string,
  ) {
    this.id = id;
    this.name = name;
    this.darkVision = darkVision;
    this.minimumAge = minimumAge;
    this.maximumAge = maximumAge;
    this.minimumHeight = minimumHeight;
    this.maximumHeight = maximumHeight;
    this.minimumWeight = minimumWeight;
    this.maximumWeight = maximumWeight;
    this.traits = traits;
    this.bonusHpPerLevel = bonusHpPerLevel;
    this.skullTexture = skullTexture;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "SubAncestry",
      id: this.id,
      name: this.name,
      "dark-vision": this.darkVision?.serialize(),
      "minimum-age": this.minimumAge,
      "maximum-age": this.maximumAge,
      "minimum-height": this.minimumHeight,
      "maximum-height": this.maximumHeight,
      "minimum-weight": this.minimumWeight,
      "maximum-weight": this.maximumWeight,
      traits: this.traits.map((trait) => trait.serialize()),
      "bonus-hp-per-level": this.bonusHpPerLevel,
      "skull-texture": this.skullTexture,
    };
  }
}

export class Ancestry implements ConfigurationSerializable {
  file: string;
  id: string;
  name: string;
  namePlural: string;
  subAncestries: SubAncestry[];
  darkVision: Distance;
  minimumAge: number;
  maximumAge: number;
  minimumHeight: string;
  maximumHeight: string;
  minimumWeight: string;
  maximumWeight: string;
  traits: AncestryTrait[];
  bonusHpPerLevel: number | undefined;
  skullTexture: string;

  constructor(
    file: string,
    id: string,
    name: string,
    namePlural: string,
    subAncestries: SubAncestry[],
    darkVision: Distance,
    minimumAge: number,
    maximumAge: number,
    minimumHeight: string,
    maximumHeight: string,
    minimumWeight: string,
    maximumWeight: string,
    traits: AncestryTrait[],
    bonusHpPerLevel: number | undefined,
    skullTexture: string,
  ) {
    this.file = file;
    this.id = id;
    this.name = name;
    this.namePlural = namePlural;
    this.subAncestries = subAncestries;
    this.darkVision = darkVision;
    this.minimumAge = minimumAge;
    this.maximumAge = maximumAge;
    this.minimumHeight = minimumHeight;
    this.maximumHeight = maximumHeight;
    this.minimumWeight = minimumWeight;
    this.maximumWeight = maximumWeight;
    this.traits = traits;
    this.bonusHpPerLevel = bonusHpPerLevel;
    this.skullTexture = skullTexture;
  }

  getSubAncestryById(id: string) {
    return this.subAncestries.find((subAncestry) => subAncestry.id === id);
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "Ancestry",
      id: this.id,
      name: this.name,
      "name-plural": this.namePlural,
      "sub-ancestries": this.subAncestries.map((subAncestry) =>
        subAncestry.serialize(),
      ),
      "dark-vision": this.darkVision.serialize(),
      "minimum-age": this.minimumAge,
      "maximum-age": this.maximumAge,
      "minimum-height": this.minimumHeight,
      "maximum-height": this.maximumHeight,
      "minimum-weight": this.minimumWeight,
      "maximum-weight": this.maximumWeight,
      traits: this.traits.map((trait) => trait.serialize()),
      "bonus-hp-per-level": this.bonusHpPerLevel,
      "skull-texture": this.skullTexture,
    };
  }

  save() {
    fs.writeFileSync(this.file, yaml.stringify({ ancestry: this.serialize() }));
  }
}

function deserializeDistance(serialized: { [key: string]: any }) {
  return new Distance(serialized.value, serialized.unit);
}

function deserializeAncestryTrait(serialized: { [key: string]: any }) {
  return new AncestryTrait(serialized.name, serialized.description);
}

function deserializeSubAncestry(serialized: { [key: string]: any }) {
  return new SubAncestry(
    serialized.id,
    serialized.name,
    serialized["dark-vision"]
      ? deserializeDistance(serialized["dark-vision"])
      : undefined,
    serialized["minimum-age"],
    serialized["maximum-age"],
    serialized["minimum-height"],
    serialized["maximum-height"],
    serialized["minimum-weight"],
    serialized["maximum-weight"],
    serialized.traits.map((trait: { [key: string]: any }) =>
      deserializeAncestryTrait(trait),
    ),
    serialized["bonus-hp-per-level"],
    serialized["skull-texture"],
  );
}

function deserializeAncestry(file: string, serialized: { [key: string]: any }) {
  return new Ancestry(
    file,
    serialized.id,
    serialized.name,
    serialized["name-plural"],
    serialized["sub-ancestries"]?.map((subAncestry: { [key: string]: any }) =>
      deserializeSubAncestry(subAncestry),
    ) ?? [],
    deserializeDistance(serialized["dark-vision"]),
    serialized["minimum-age"],
    serialized["maximum-age"],
    serialized["minimum-height"],
    serialized["maximum-height"],
    serialized["minimum-weight"],
    serialized["maximum-weight"],
    serialized.traits.map((trait: { [key: string]: any }) =>
      deserializeAncestryTrait(trait),
    ),
    serialized["bonus-hp-per-level"],
    serialized["skull-texture"],
  );
}

function loadAncestry(file: string) {
  return deserializeAncestry(
    file,
    parse(fs.readFileSync(file, "utf8")).ancestry,
  );
}
