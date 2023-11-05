import * as path from "path";
import * as fs from "fs";
import { parse, stringify } from "yaml";
import { getBaseDirectory } from "../settings";
import { ConfigurationSerializable } from "./configurationSerializable";
import { deserializePrerequisite, Prerequisite } from "./prerequisites";
import { Ability } from "./abilities";
import { CharacterTrait } from "./traits";
import { Skill } from "./skills";
import NodeCache from "node-cache";

export const getEffectsDirectory = () =>
  path.join(getBaseDirectory(), "effects");

const effectCache = new NodeCache();

export const getEffects: () => Effect[] = () => {
  return fs.readdirSync(getEffectsDirectory()).map((effectFile) => {
    let effectPath = path.join(getEffectsDirectory(), effectFile);
    const cachedEffect = effectCache.get<Effect>(effectPath);
    if (cachedEffect) {
      return cachedEffect;
    } else {
      const effect = deserializeEffect(
        effectPath,
        parse(fs.readFileSync(effectPath, "utf8")).effect,
      );
      effectCache.set(effectPath, effect);
      return effect;
    }
  });
};

fs.watch(getEffectsDirectory(), (eventType, filename) => {
  if (filename) {
    const effectPath = path.join(getEffectsDirectory(), filename);
    effectCache.del(effectPath);
    console.log(`Purging cached effect ${effectPath} due to update`);
  }
});

export interface Effect extends ConfigurationSerializable {
  file: string;
  prerequisites: Prerequisite[];
  save(): void;
}

export class AbilityEffect implements Effect {
  file: string;
  abilities: { [ability: string]: number };
  prerequisites: Prerequisite[];

  constructor(
    file: string,
    abilities: { [ability: string]: number },
    prerequisites: Prerequisite[],
  ) {
    this.file = file;
    this.abilities = abilities;
    this.prerequisites = prerequisites;
  }

  serialize() {
    return {
      "==": "AbilityEffect",
      abilities: this.abilities,
      prerequisites: this.prerequisites.map((prerequisite) =>
        prerequisite.serialize(),
      ),
    };
  }

  save() {
    fs.writeFileSync(
      this.file,
      stringify({
        effect: this.serialize(),
      }),
    );
  }
}

export class CharacterTraitEffect implements Effect {
  file: string;
  traits: CharacterTrait[];
  prerequisites: Prerequisite[];

  constructor(
    file: string,
    traits: CharacterTrait[],
    prerequisites: Prerequisite[],
  ) {
    this.file = file;
    this.traits = traits;
    this.prerequisites = prerequisites;
  }

  serialize() {
    return {
      "==": "CharacterTraitEffect",
      traits: this.traits.map((trait) => trait.serialize()),
      prerequisites: this.prerequisites.map((prerequisite) =>
        prerequisite.serialize(),
      ),
    };
  }

  save() {
    fs.writeFileSync(
      this.file,
      stringify({
        effect: this.serialize(),
      }),
    );
  }
}

export class FeatEffect implements Effect {
  file: string;
  feats: string[];
  prerequisites: Prerequisite[];

  constructor(file: string, feats: string[], prerequisites: Prerequisite[]) {
    this.file = file;
    this.feats = feats;
    this.prerequisites = prerequisites;
  }

  serialize() {
    return {
      "==": "FeatEffect",
      feats: this.feats,
      prerequisites: this.prerequisites.map((prerequisite) =>
        prerequisite.serialize(),
      ),
    };
  }

  save() {
    fs.writeFileSync(
      this.file,
      stringify({
        effect: this.serialize(),
      }),
    );
  }
}

export class InitiativeAbilityModBonusEffect implements Effect {
  file: string;
  ability: Ability;
  prerequisites: Prerequisite[];

  constructor(file: string, ability: Ability, prerequisites: Prerequisite[]) {
    this.file = file;
    this.ability = ability;
    this.prerequisites = prerequisites;
  }

  serialize() {
    return {
      "==": "InitiativeAbilityModBonusEffect",
      ability: this.ability.name,
      prerequisites: this.prerequisites.map((prerequisite) =>
        prerequisite.serialize(),
      ),
    };
  }

  save() {
    fs.writeFileSync(
      this.file,
      stringify({
        effect: this.serialize(),
      }),
    );
  }
}

export class InitiativeBonusEffect implements Effect {
  file: string;
  bonus: number;
  prerequisites: Prerequisite[];

  constructor(file: string, bonus: number, prerequisites: Prerequisite[]) {
    this.file = file;
    this.bonus = bonus;
    this.prerequisites = prerequisites;
  }

  serialize() {
    return {
      "==": "InitiativeBonusEffect",
      bonus: this.bonus,
      prerequisites: this.prerequisites.map((prerequisite) =>
        prerequisite.serialize(),
      ),
    };
  }

  save() {
    fs.writeFileSync(
      this.file,
      stringify({
        effect: this.serialize(),
      }),
    );
  }
}

export class ItemProficiencyEffect implements Effect {
  file: string;
  items: string[];
  prerequisites: Prerequisite[];

  constructor(file: string, items: string[], prerequisites: Prerequisite[]) {
    this.file = file;
    this.items = items;
    this.prerequisites = prerequisites;
  }

  serialize() {
    return {
      "==": "ItemProficiencyEffect",
      items: this.items,
      prerequisites: this.prerequisites.map((prerequisite) =>
        prerequisite.serialize(),
      ),
    };
  }

  save() {
    fs.writeFileSync(
      this.file,
      stringify({
        effect: this.serialize(),
      }),
    );
  }
}

export class JackOfAllTradesEffect implements Effect {
  file: string;
  prerequisites: Prerequisite[];

  constructor(file: string, prerequisites: Prerequisite[]) {
    this.file = file;
    this.prerequisites = prerequisites;
  }

  serialize() {
    return {
      "==": "JackOfAllTradesEffect",
      prerequisites: this.prerequisites.map((prerequisite) =>
        prerequisite.serialize(),
      ),
    };
  }

  save() {
    fs.writeFileSync(
      this.file,
      stringify({
        effect: this.serialize(),
      }),
    );
  }
}

export class LanguageEffect implements Effect {
  file: string;
  languages: string[];
  prerequisites: Prerequisite[];

  constructor(
    file: string,
    languages: string[],
    prerequisites: Prerequisite[],
  ) {
    this.file = file;
    this.languages = languages;
    this.prerequisites = prerequisites;
  }

  serialize() {
    return {
      "==": "LanguageEffect",
      languages: this.languages,
      prerequisites: this.prerequisites.map((prerequisite) =>
        prerequisite.serialize(),
      ),
    };
  }

  save() {
    fs.writeFileSync(
      this.file,
      stringify({
        effect: this.serialize(),
      }),
    );
  }
}

export class SavingThrowProficiencyEffect implements Effect {
  file: string;
  abilities: Ability[];
  prerequisites: Prerequisite[];

  constructor(
    file: string,
    abilities: Ability[],
    prerequisites: Prerequisite[],
  ) {
    this.file = file;
    this.abilities = abilities;
    this.prerequisites = prerequisites;
  }

  serialize() {
    return {
      "==": "SavingThrowProficiencyEffect",
      abilities: this.abilities.map((ability) => ability.name),
      prerequisites: this.prerequisites.map((prerequisite) =>
        prerequisite.serialize(),
      ),
    };
  }

  save() {
    fs.writeFileSync(
      this.file,
      stringify({
        effect: this.serialize(),
      }),
    );
  }
}

export class SkillExpertiseEffect implements Effect {
  file: string;
  skills: Skill[];
  prerequisites: Prerequisite[];

  constructor(file: string, skills: Skill[], prerequisites: Prerequisite[]) {
    this.file = file;
    this.skills = skills;
    this.prerequisites = prerequisites;
  }

  serialize() {
    return {
      "==": "SkillExpertiseEffect",
      skills: this.skills.map((skill) => skill.name),
      prerequisites: this.prerequisites.map((prerequisite) =>
        prerequisite.serialize(),
      ),
    };
  }

  save() {
    fs.writeFileSync(
      this.file,
      stringify({
        effect: this.serialize(),
      }),
    );
  }
}

export class SkillProficiencyEffect implements Effect {
  file: string;
  skills: Skill[];
  prerequisites: Prerequisite[];

  constructor(file: string, skills: Skill[], prerequisites: Prerequisite[]) {
    this.file = file;
    this.skills = skills;
    this.prerequisites = prerequisites;
  }

  serialize() {
    return {
      "==": "SkillProficiencyEffect",
      skills: this.skills.map((skill) => skill.name),
      prerequisites: this.prerequisites.map((prerequisite) =>
        prerequisite.serialize(),
      ),
    };
  }

  save() {
    fs.writeFileSync(
      this.file,
      stringify({
        effect: this.serialize(),
      }),
    );
  }
}

export class SpeedEffect implements Effect {
  file: string;
  speed: number;
  prerequisites: Prerequisite[];

  constructor(file: string, speed: number, prerequisites: Prerequisite[]) {
    this.file = file;
    this.speed = speed;
    this.prerequisites = prerequisites;
  }

  serialize() {
    return {
      "==": "SpeedEffect",
      speed: this.speed,
      prerequisites: this.prerequisites.map((prerequisite) =>
        prerequisite.serialize(),
      ),
    };
  }

  save() {
    fs.writeFileSync(
      this.file,
      stringify({
        effect: this.serialize(),
      }),
    );
  }
}

export class SpellEffect implements Effect {
  file: string;
  spells: string[];
  prerequisites: Prerequisite[];

  constructor(file: string, spells: string[], prerequisites: Prerequisite[]) {
    this.file = file;
    this.spells = spells;
    this.prerequisites = prerequisites;
  }

  serialize() {
    return {
      "==": "SpellEffect",
      spells: this.spells,
      prerequisites: this.prerequisites.map((prerequisite) =>
        prerequisite.serialize(),
      ),
    };
  }

  save() {
    fs.writeFileSync(
      this.file,
      stringify({
        effect: this.serialize(),
      }),
    );
  }
}

function deserializeEffect(file: string, serialized: { [key: string]: any }) {
  switch (serialized["=="]) {
    case "AbilityEffect":
      return new AbilityEffect(
        file,
        serialized["abilities"],
        serialized["prerequisites"].map(
          (prerequisite: { [key: string]: any }) =>
            deserializePrerequisite(prerequisite),
        ),
      );
    case "CharacterTraitEffect":
      return new CharacterTraitEffect(
        file,
        serialized["traits"].map(
          (trait: { [key: string]: any }) =>
            new CharacterTrait(trait["name"], trait["description"]),
        ),
        serialized["prerequisites"].map(
          (prerequisite: { [key: string]: any }) =>
            deserializePrerequisite(prerequisite),
        ),
      );
    case "FeatEffect":
      return new FeatEffect(
        file,
        serialized["feats"],
        serialized["prerequisites"].map(
          (prerequisite: { [key: string]: any }) =>
            deserializePrerequisite(prerequisite),
        ),
      );
    case "InitiativeAbilityModBonusEffect":
      return new InitiativeAbilityModBonusEffect(
        file,
        Ability.getByName(serialized["ability"]),
        serialized["prerequisites"].map(
          (prerequisite: { [key: string]: any }) =>
            deserializePrerequisite(prerequisite),
        ),
      );
    case "InitiativeBonusEffect":
      return new InitiativeBonusEffect(
        file,
        serialized["bonus"],
        serialized["prerequisites"].map(
          (prerequisite: { [key: string]: any }) =>
            deserializePrerequisite(prerequisite),
        ),
      );
    case "ItemProficiencyEffect":
      return new ItemProficiencyEffect(
        file,
        serialized["items"],
        serialized["prerequisites"].map(
          (prerequisite: { [key: string]: any }) =>
            deserializePrerequisite(prerequisite),
        ),
      );
    case "JackOfAllTradesEffect":
      return new JackOfAllTradesEffect(
        file,
        serialized["prerequisites"].map(
          (prerequisite: { [key: string]: any }) =>
            deserializePrerequisite(prerequisite),
        ),
      );
    case "LanguageEffect":
      return new LanguageEffect(
        file,
        serialized["languages"],
        serialized["prerequisites"].map(
          (prerequisite: { [key: string]: any }) =>
            deserializePrerequisite(prerequisite),
        ),
      );
    case "SavingThrowProficiencyEffect":
      return new SavingThrowProficiencyEffect(
        file,
        serialized["abilities"].map((ability: string) =>
          Ability.getByName(ability),
        ),
        serialized["prerequisites"].map(
          (prerequisite: { [key: string]: any }) =>
            deserializePrerequisite(prerequisite),
        ),
      );
    case "SkillExpertiseEffect":
      return new SkillExpertiseEffect(
        file,
        serialized["skills"].map((skill: string) => Skill.getByName(skill)),
        serialized["prerequisites"].map(
          (prerequisite: { [key: string]: any }) =>
            deserializePrerequisite(prerequisite),
        ),
      );
    case "SkillProficiencyEffect":
      return new SkillProficiencyEffect(
        file,
        serialized["skills"].map((skill: string) => Skill.getByName(skill)),
        serialized["prerequisites"].map(
          (prerequisite: { [key: string]: any }) =>
            deserializePrerequisite(prerequisite),
        ),
      );
    case "SpeedEffect":
      return new SpeedEffect(
        file,
        serialized["speed"],
        serialized["prerequisites"].map(
          (prerequisite: { [key: string]: any }) =>
            deserializePrerequisite(prerequisite),
        ),
      );
    case "SpellEffect":
      return new SpellEffect(
        file,
        serialized["spells"],
        serialized["prerequisites"].map(
          (prerequisite: { [key: string]: any }) =>
            deserializePrerequisite(prerequisite),
        ),
      );
    default:
      throw new Error(`Unknown effect type: ${serialized["=="]}`);
  }
}
