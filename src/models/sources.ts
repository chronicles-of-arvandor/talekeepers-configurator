import { ConfigurationSerializable } from "./configurationSerializable";

export class Source implements ConfigurationSerializable {
  source: string;
  page: number;

  constructor(source: string, page: number) {
    this.source = source;
    this.page = page;
  }

  serialize() {
    return {
      "==": "Source",
      source: this.source,
      page: this.page,
    };
  }
}

export function deserializeSource(serialized: { [key: string]: any }) {
  return new Source(serialized["source"], serialized["page"]);
}
