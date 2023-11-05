import * as path from "path";
import * as fs from "fs";
import { parse } from "yaml";
import { getBaseDirectory } from "../settings";
import { ConfigurationSerializable } from "./configurationSerializable";
import { deserializeSource, Source } from "./sources";
import NodeCache from "node-cache";
import { getAncestriesDirectory } from "./ancestries";

export const getFeatsDirectory = () => path.join(getBaseDirectory(), "feats");

const featCache = new NodeCache();

export const getFeats = () => {
  return fs.readdirSync(getFeatsDirectory()).map((featFile) => {
    const featPath = path.join(getFeatsDirectory(), featFile);
    const cachedFeat = featCache.get<Feat>(featPath);
    if (cachedFeat) {
      return cachedFeat;
    } else {
      const feat = deserializeFeat(
        featPath,
        parse(fs.readFileSync(featPath, "utf8")).feat,
      );
      featCache.set(featPath, feat);
      return feat;
    }
  });
};

fs.watch(getFeatsDirectory(), (eventType, filename) => {
  if (filename) {
    const featPath = path.join(getFeatsDirectory(), filename);
    featCache.del(featPath);
    console.log(`Purging cached feat ${featPath} due to update`);
  }
});

export const getFeatById = (id: string) =>
  getFeats().find((feat) => feat.id === id);
export const getFeatByName = (name: string) =>
  getFeats().find((feat) => feat.name === name);

export interface FeatEntry extends ConfigurationSerializable {}

export class FeatStringEntry implements FeatEntry {
  value: string;

  constructor(value: string) {
    this.value = value;
  }

  serialize() {
    return {
      "==": "FeatStringEntry",
      value: this.value,
    };
  }
}

export class FeatListEntry implements FeatEntry {
  items: string[];

  constructor(items: string[]) {
    this.items = items;
  }

  serialize() {
    return {
      "==": "FeatListEntry",
      items: this.items,
    };
  }
}

export class FeatTableEntry implements FeatEntry {
  caption: string;
  colLabels: string[];
  colStyles: string[];
  rows: string[][];

  constructor(
    caption: string,
    colLabels: string[],
    colStyles: string[],
    rows: string[][],
  ) {
    this.caption = caption;
    this.colLabels = colLabels;
    this.colStyles = colStyles;
    this.rows = rows;
  }

  serialize() {
    return {
      "==": "FeatTableEntry",
      caption: this.caption,
      "col-labels": this.colLabels,
      "col-styles": this.colStyles,
      rows: this.rows,
    };
  }
}

export class FeatEntriesEntry implements FeatEntry {
  name: string;
  entries: string[];

  constructor(name: string, entries: string[]) {
    this.name = name;
    this.entries = entries;
  }

  serialize() {
    return {
      "==": "FeatEntriesEntry",
      name: this.name,
      entries: this.entries,
    };
  }
}

export class FeatInsetEntry implements FeatEntry {
  name: string;
  entries: string[];

  constructor(name: string, entries: string[]) {
    this.name = name;
    this.entries = entries;
  }

  serialize() {
    return {
      "==": "FeatInsetEntry",
      name: this.name,
      entries: this.entries,
    };
  }
}

function deserializeFeatEntry(serialized: { [key: string]: any }): FeatEntry {
  switch (serialized["=="]) {
    case "FeatStringEntry":
      return new FeatStringEntry(serialized["value"]);
    case "FeatListEntry":
      return new FeatListEntry(serialized["items"]);
    case "FeatTableEntry":
      return new FeatTableEntry(
        serialized["caption"],
        serialized["col-labels"],
        serialized["col-styles"],
        serialized["rows"],
      );
    case "FeatEntriesEntry":
      return new FeatEntriesEntry(serialized["name"], serialized["entries"]);
    case "FeatInsetEntry":
      return new FeatInsetEntry(serialized["name"], serialized["entries"]);
    default:
      throw new Error(`Unknown feat entry type: ${serialized["=="]}`);
  }
}

export class Feat implements ConfigurationSerializable {
  file: string;
  id: string;
  name: string;
  source: string;
  page: number;
  otherSources: Source[];
  entries: FeatEntry[];
  srd: boolean;

  constructor(
    file: string,
    id: string,
    name: string,
    source: string,
    page: number,
    otherSources: Source[],
    entries: FeatEntry[],
    srd: boolean,
  ) {
    this.file = file;
    this.id = id;
    this.name = name;
    this.source = source;
    this.page = page;
    this.otherSources = otherSources;
    this.entries = entries;
    this.srd = srd;
  }

  serialize() {
    return {
      "==": "Feat",
      id: this.id,
      name: this.name,
      source: this.source,
      page: this.page,
      "other-sources": this.otherSources.map((source) => source.serialize()),
      entries: this.entries.map((entry) => entry.serialize()),
      srd: this.srd,
    };
  }
}

function deserializeFeat(file: string, serialized: { [key: string]: any }) {
  return new Feat(
    file,
    serialized["id"],
    serialized["name"],
    serialized["source"],
    serialized["page"],
    serialized["other-sources"].map((source: { [key: string]: any }) =>
      deserializeSource(source),
    ),
    serialized["entries"].map((entry: { [key: string]: any }) =>
      deserializeFeatEntry(entry),
    ),
    serialized["srd"],
  );
}
