import { ConfigurationSerializable } from "./configurationSerializable";

export class CharacterTrait implements ConfigurationSerializable {
  name: string;
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "CharacterTrait",
      name: this.name,
      description: this.description,
    };
  }
}
