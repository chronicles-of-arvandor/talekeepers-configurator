import { Ability } from "./abilities";
import { ConfigurationSerializable } from "./configurationSerializable";
import { getAncestryById } from "./ancestries";
import { getBackgroundById } from "./backgrounds";
import { getChoiceById } from "./choices";
import { Skill } from "./skills";
import { getClassById } from "./classes";
import { getSpellById } from "./spells";
import { getFeatById } from "./feats";
import { getLanguageById } from "./languages";

export interface Prerequisite extends ConfigurationSerializable {
  getName(): string;
}

export class AbilityPrerequisite implements Prerequisite {
  ability: Ability;
  score: number;

  constructor(ability: Ability, score: number) {
    this.ability = ability;
    this.score = score;
  }

  getName() {
    return `Ability score: ${this.score} ${this.ability.displayName}`;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "AbilityPrerequisite",
      ability: this.ability.name,
      score: this.score,
    };
  }
}

export class AncestryPrerequisite implements Prerequisite {
  ancestryId: string;

  constructor(ancestryId: string) {
    this.ancestryId = ancestryId;
  }

  getName() {
    const ancestry = getAncestryById(this.ancestryId);
    return `Ancestry: ${ancestry?.name ?? "Unknown"}`;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "AncestryPrerequisite",
      "ancestry-id": this.ancestryId,
    };
  }
}

export class AndPrerequisite implements Prerequisite {
  prerequisites: Prerequisite[];

  constructor(prerequisites: Prerequisite[]) {
    this.prerequisites = prerequisites;
  }

  getName() {
    return this.prerequisites
      .map((prerequisite) => prerequisite.getName())
      .join(" AND ");
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "AndPrerequisite",
      prerequisites: this.prerequisites.map((prerequisite) =>
        prerequisite.serialize(),
      ),
    };
  }
}

export class BackgroundPrerequisite implements Prerequisite {
  backgroundId: string;

  constructor(backgroundId: string) {
    this.backgroundId = backgroundId;
  }

  getName() {
    const background = getBackgroundById(this.backgroundId);
    return `Background: ${background?.name ?? "Unknown"}`;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "BackgroundPrerequisite",
      "background-id": this.backgroundId,
    };
  }
}

export class ChoicePrerequisite implements Prerequisite {
  choiceId: string;
  optionId: string;

  constructor(choiceId: string, optionId: string) {
    this.choiceId = choiceId;
    this.optionId = optionId;
  }

  getName() {
    const choice = getChoiceById(this.choiceId);
    const option = choice?.options.find(
      (option) => option.id === this.optionId,
    );
    return `Choice: ${choice?.text ?? "Unknown"}: ${option?.text ?? "Unknown"}`;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "ChoicePrerequisite",
      "choice-id": this.choiceId,
      "option-id": this.optionId,
    };
  }
}

export class ClassPrerequisite implements Prerequisite {
  classId: string;
  level: number;

  constructor(classId: string, level: number) {
    this.classId = classId;
    this.level = level;
  }

  getName() {
    const clazz = getClassById(this.classId);
    return `Class: Lv${this.level} ${clazz?.name ?? "Unknown"}`;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "ClassPrerequisite",
      "class-id": this.classId,
      level: this.level,
    };
  }
}

export class FeatPrerequisite implements Prerequisite {
  featId: string;

  constructor(featId: string) {
    this.featId = featId;
  }

  getName() {
    const feat = getFeatById(this.featId);
    return `Feat: ${feat?.name ?? "Unknown"}`;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "FeatPrerequisite",
      "feat-id": this.featId,
    };
  }
}

export class ItemProficiencyPrerequisite implements Prerequisite {
  itemIds: string[];

  constructor(itemIds: string[]) {
    this.itemIds = itemIds;
  }

  getName() {
    return `Item Proficiency: ${this.itemIds.join(", ")}`;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "ItemProficiencyPrerequisite",
      "item-ids": this.itemIds,
    };
  }
}

export class LanguagePrerequisite implements Prerequisite {
  languageIds: string[];

  constructor(languageIds: string[]) {
    this.languageIds = languageIds;
  }

  getName() {
    const languages = this.languageIds.map((languageId) =>
      getLanguageById(languageId),
    );
    return `Languages: ${languages
      .map((language) => language?.name ?? "Unknown")
      .join(", ")}`;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "LanguagePrerequisite",
      "language-ids": this.languageIds,
    };
  }
}

export class LevelPrerequisite implements Prerequisite {
  level: number;

  constructor(level: number) {
    this.level = level;
  }

  getName() {
    return `Level: ${this.level}`;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "LevelPrerequisite",
      level: this.level,
    };
  }
}

export class NotPrerequisite implements Prerequisite {
  prerequisite: Prerequisite;

  constructor(prerequisite: Prerequisite) {
    this.prerequisite = prerequisite;
  }

  getName() {
    return `NOT ${this.prerequisite.getName()}`;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "NotPrerequisite",
      prerequisite: this.prerequisite.serialize(),
    };
  }
}

export class OrPrerequisite implements Prerequisite {
  prerequisites: Prerequisite[];

  constructor(prerequisites: Prerequisite[]) {
    this.prerequisites = prerequisites;
  }

  getName() {
    return this.prerequisites
      .map((prerequisite) => prerequisite.getName())
      .join(" OR ");
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "OrPrerequisite",
      prerequisites: this.prerequisites.map((prerequisite) =>
        prerequisite.serialize(),
      ),
    };
  }
}

export class SavingThrowProficiencyPrerequisite implements Prerequisite {
  abilities: Ability[];

  constructor(abilities: Ability[]) {
    this.abilities = abilities;
  }

  getName() {
    return `Saving Throw Proficiency: ${this.abilities
      .map((ability) => ability.displayName)
      .join(", ")}`;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "SavingThrowProficiencyPrerequisite",
      abilities: this.abilities.map((ability) => ability.name),
    };
  }
}

export class SkillProficiencyPrerequisite implements Prerequisite {
  skills: Skill[];

  constructor(skills: Skill[]) {
    this.skills = skills;
  }

  getName() {
    return `Skill Proficiency: ${this.skills
      .map((skill) => skill.displayName)
      .join(", ")}`;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "SkillProficiencyPrerequisite",
      skills: this.skills.map((skill) => skill.name),
    };
  }
}

export class SpellPrerequisite implements Prerequisite {
  spellIds: string[];

  constructor(spellIds: string[]) {
    this.spellIds = spellIds;
  }

  getName() {
    const spells = this.spellIds.map((spellId) => getSpellById(spellId));
    return `Spells: ${spells
      .map((spell) => spell?.name ?? "Unknown")
      .join(", ")}`;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "SpellPrerequisite",
      "spell-ids": this.spellIds,
    };
  }
}

export class SubAncestryPrerequisite implements Prerequisite {
  ancestryId: string;
  subAncestryId: string;

  constructor(ancestryId: string, subAncestryId: string) {
    this.ancestryId = ancestryId;
    this.subAncestryId = subAncestryId;
  }

  getName() {
    const ancestry = getAncestryById(this.ancestryId);
    const subAncestry = ancestry?.subAncestries.find(
      (subAncestry) => subAncestry.id === this.subAncestryId,
    );
    return `Sub Ancestry: ${subAncestry?.name ?? "Unknown"} ${
      ancestry?.name ?? "Unknown"
    }`;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "SubAncestryPrerequisite",
      "ancestry-id": this.ancestryId,
      "sub-ancestry-id": this.subAncestryId,
    };
  }
}

export class SubClassPrerequisite implements Prerequisite {
  classId: string;
  subClassId: string;
  level: number;

  constructor(classId: string, subClassId: string, level: number) {
    this.classId = classId;
    this.subClassId = subClassId;
    this.level = level;
  }

  getName() {
    const clazz = getClassById(this.classId);
    const subClass = clazz?.subClasses.find(
      (subClass) => subClass.id === this.subClassId,
    );
    return `Sub-class: Lv${this.level} ${subClass?.name ?? "Unknown"}`;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "SubClassPrerequisite",
      "class-id": this.classId,
      "sub-class-id": this.subClassId,
      level: this.level,
    };
  }
}

export function deserializePrerequisite(serialized: {
  [key: string]: any;
}): Prerequisite {
  switch (serialized["=="]) {
    case "AbilityPrerequisite":
      return new AbilityPrerequisite(
        serialized["ability"],
        serialized["score"],
      );
    case "AncestryPrerequisite":
      return new AncestryPrerequisite(serialized["ancestry-id"]);
    case "AndPrerequisite":
      return new AndPrerequisite(
        serialized["prerequisites"].map(
          (prerequisite: { [key: string]: any }) =>
            deserializePrerequisite(prerequisite),
        ),
      );
    case "BackgroundPrerequisite":
      return new BackgroundPrerequisite(serialized["background-id"]);
    case "ChoicePrerequisite":
      return new ChoicePrerequisite(
        serialized["choice-id"],
        serialized["option-id"],
      );
    case "ClassPrerequisite":
      return new ClassPrerequisite(serialized["class-id"], serialized["level"]);
    case "FeatPrerequisite":
      return new FeatPrerequisite(serialized["feat-id"]);
    case "ItemProficiencyPrerequisite":
      return new ItemProficiencyPrerequisite(serialized["item-ids"]);
    case "LanguagePrerequisite":
      return new LanguagePrerequisite(serialized["language-ids"]);
    case "LevelPrerequisite":
      return new LevelPrerequisite(serialized["level"]);
    case "NotPrerequisite":
      return new NotPrerequisite(
        deserializePrerequisite(serialized["prerequisite"]),
      );
    case "OrPrerequisite":
      return new OrPrerequisite(
        serialized["prerequisites"].map(
          (prerequisite: { [key: string]: any }) =>
            deserializePrerequisite(prerequisite),
        ),
      );
    case "SavingThrowProficiencyPrerequisite":
      return new SavingThrowProficiencyPrerequisite(
        serialized["abilities"].map((ability: string) =>
          Ability.getByName(ability),
        ),
      );
    case "SkillProficiencyPrerequisite":
      return new SkillProficiencyPrerequisite(
        serialized["skills"].map((skill: string) => Skill.getByName(skill)),
      );
    case "SpellPrerequisite":
      return new SpellPrerequisite(serialized["spell-ids"]);
    case "SubAncestryPrerequisite":
      return new SubAncestryPrerequisite(
        serialized["ancestry-id"],
        serialized["sub-ancestry-id"],
      );
    case "SubClassPrerequisite":
      return new SubClassPrerequisite(
        serialized["class-id"],
        serialized["sub-class-id"],
        serialized["level"],
      );
    default:
      throw new Error(`Unknown prerequisite type: ${serialized["=="]}`);
  }
}
