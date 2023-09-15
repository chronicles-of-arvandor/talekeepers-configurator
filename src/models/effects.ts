import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'yaml';
import { getBaseDirectory } from '../settings';
import { ConfigurationSerializable } from './configurationSerializable';
import { deserializePrerequisite, Prerequisite } from './prerequisites';
import { Ability } from './abilities';
import { CharacterTrait } from './traits';
import { Skill } from './skills';

export const getEffectsDirectory = () => path.join(getBaseDirectory(), 'effects');

const getEffects = () => {
  return fs.readdirSync(getEffectsDirectory()).map((effectFile) => {
    let effectPath = path.join(getEffectsDirectory(), effectFile);
    return deserializeEffect(effectPath, parse(fs.readFileSync(effectPath, 'utf8')).effect);
  });
}

export interface Effect extends ConfigurationSerializable {
  file: string;
  prerequisites: Prerequisite[];
}

export class AbilityEffect implements Effect {
  file: string;
  abilities: { [ability: string]: number };
  prerequisites: Prerequisite[];

  constructor(file: string, abilities: { [ability: string]: number }, prerequisites: Prerequisite[]) {
    this.file = file;
    this.abilities = abilities;
    this.prerequisites = prerequisites;
  }

  serialize() {
    return {
      '==': 'AbilityEffect',
      'abilities': this.abilities,
      'prerequisites': this.prerequisites.map((prerequisite) => prerequisite.serialize())
    }
  }
}

export class CharacterTraitEffect implements Effect {
  file: string;
  traits: CharacterTrait[];
  prerequisites: Prerequisite[];

  constructor(file: string, traits: CharacterTrait[], prerequisites: Prerequisite[]) {
    this.file = file;
    this.traits = traits;
    this.prerequisites = prerequisites;
  }

  serialize() {
    return {
      '==': 'CharacterTraitEffect',
      'traits': this.traits.map((trait) => trait.serialize()),
      'prerequisites': this.prerequisites.map((prerequisite) => prerequisite.serialize())
    }
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
      '==': 'FeatEffect',
      'feats': this.feats,
      'prerequisites': this.prerequisites.map((prerequisite) => prerequisite.serialize())
    }
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
      '==': 'ItemProficiencyEffect',
      'items': this.items,
      'prerequisites': this.prerequisites.map((prerequisite) => prerequisite.serialize())
    }
  }
}

export class LanguageEffect implements Effect {
  file: string;
  languages: string[];
  prerequisites: Prerequisite[];

  constructor(file: string, languages: string[], prerequisites: Prerequisite[]) {
    this.file = file;
    this.languages = languages;
    this.prerequisites = prerequisites;
  }

  serialize() {
    return {
      '==': 'LanguageEffect',
      'languages': this.languages,
      'prerequisites': this.prerequisites.map((prerequisite) => prerequisite.serialize())
    }
  }
}

export class SavingThrowProficiencyEffect implements Effect {
  file: string;
  abilities: Ability[];
  prerequisites: Prerequisite[];

  constructor(file: string, abilities: Ability[], prerequisites: Prerequisite[]) {
    this.file = file;
    this.abilities = abilities;
    this.prerequisites = prerequisites;
  }

  serialize() {
    return {
      '==': 'SavingThrowProficiencyEffect',
      'abilities': this.abilities.map((ability) => ability.name),
      'prerequisites': this.prerequisites.map((prerequisite) => prerequisite.serialize())
    }
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
      '==': 'SkillProficiencyEffect',
      'skills': this.skills.map((skill) => skill.name),
      'prerequisites': this.prerequisites.map((prerequisite) => prerequisite.serialize())
    }
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
      '==': 'SpeedEffect',
      'speed': this.speed,
      'prerequisites': this.prerequisites.map((prerequisite) => prerequisite.serialize())
    }
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
      '==': 'SpellEffect',
      'spells': this.spells,
      'prerequisites': this.prerequisites.map((prerequisite) => prerequisite.serialize())
    }
  }
}

function deserializeEffect(file: string, serialized: { [key: string]: any }) {
  switch (serialized['==']) {
    case 'AbilityEffect': return new AbilityEffect(
      file,
      serialized['abilities'],
      serialized['prerequisites'].map((prerequisite: { [key: string]: any }) => deserializePrerequisite(prerequisite))
    );
    case 'CharacterTraitEffect': return new CharacterTraitEffect(
      file,
      serialized['traits'].map((trait: { [key: string]: any }) => new CharacterTrait(trait['name'], trait['description'])),
      serialized['prerequisites'].map((prerequisite: { [key: string]: any }) => deserializePrerequisite(prerequisite))
    );
    case 'FeatEffect': return new FeatEffect(
      file,
      serialized['feats'],
      serialized['prerequisites'].map((prerequisite: { [key: string]: any }) => deserializePrerequisite(prerequisite))
    );
    case 'ItemProficiencyEffect': return new ItemProficiencyEffect(
      file,
      serialized['items'],
      serialized['prerequisites'].map((prerequisite: { [key: string]: any }) => deserializePrerequisite(prerequisite))
    );
    case 'LanguageEffect': return new LanguageEffect(
      file,
      serialized['languages'],
      serialized['prerequisites'].map((prerequisite: { [key: string]: any }) => deserializePrerequisite(prerequisite))
    );
    case 'SavingThrowProficiencyEffect': return new SavingThrowProficiencyEffect(
      file,
      serialized['abilities'].map((ability: string) => Ability.getByName(ability)),
      serialized['prerequisites'].map((prerequisite: { [key: string]: any }) => deserializePrerequisite(prerequisite))
    );
    case 'SkillProficiencyEffect': return new SkillProficiencyEffect(
      file,
      serialized['skills'].map((skill: string) => Skill.getByName(skill)),
      serialized['prerequisites'].map((prerequisite: { [key: string]: any }) => deserializePrerequisite(prerequisite))
    );
    case 'SpeedEffect': return new SpeedEffect(
      file,
      serialized['speed'],
      serialized['prerequisites'].map((prerequisite: { [key: string]: any }) => deserializePrerequisite(prerequisite))
    );
    case 'SpellEffect': return new SpellEffect(
      file,
      serialized['spells'],
      serialized['prerequisites'].map((prerequisite: { [key: string]: any }) => deserializePrerequisite(prerequisite))
    );
    default: throw new Error(`Unknown effect type: ${serialized['==']}`);
  }
}
