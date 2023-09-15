import { Ability } from './abilities';

export class Skill {
  name: string;
  displayName: string;
  ability: Ability;

  constructor(name: string, displayName: string, ability: Ability) {
    this.name = name;
    this.displayName = displayName;
    this.ability = ability;
  }

  static ACROBATICS = new Skill('ACROBATICS', 'Acrobatics', Ability.DEXTERITY);
  static ANIMAL_HANDLING = new Skill('ANIMAL_HANDLING', 'Animal Handling', Ability.WISDOM);
  static ARCANA = new Skill('ARCANA', 'Arcana', Ability.INTELLIGENCE);
  static ATHLETICS = new Skill('ATHLETICS', 'Athletics', Ability.STRENGTH);
  static DECEPTION = new Skill('DECEPTION', 'Deception', Ability.CHARISMA);
  static HISTORY = new Skill('HISTORY', 'History', Ability.INTELLIGENCE);
  static INSIGHT = new Skill('INSIGHT', 'Insight', Ability.WISDOM);
  static INTIMIDATION = new Skill('INTIMIDATION', 'Intimidation', Ability.CHARISMA);
  static INVESTIGATION = new Skill('INVESTIGATION', 'Investigation', Ability.INTELLIGENCE);
  static MEDICINE = new Skill('MEDICINE', 'Medicine', Ability.WISDOM);
  static NATURE = new Skill('NATURE', 'Nature', Ability.INTELLIGENCE);
  static PERCEPTION = new Skill('PERCEPTION', 'Perception', Ability.WISDOM);
  static PERFORMANCE = new Skill('PERFORMANCE', 'Performance', Ability.CHARISMA);
  static PERSUASION = new Skill('PERSUASION', 'Persuasion', Ability.CHARISMA);
  static RELIGION = new Skill('RELIGION', 'Religion', Ability.INTELLIGENCE);
  static SLEIGHT_OF_HAND = new Skill('SLEIGHT_OF_HAND', 'Sleight of Hand', Ability.DEXTERITY);
  static STEALTH = new Skill('STEALTH', 'Stealth', Ability.DEXTERITY);
  static SURVIVAL = new Skill('SURVIVAL', 'Survival', Ability.WISDOM);

  static getByName(name: string) {
    switch (name) {
      case 'ACROBATICS': return Skill.ACROBATICS;
      case 'ANIMAL_HANDLING': return Skill.ANIMAL_HANDLING;
      case 'ARCANA': return Skill.ARCANA;
      case 'ATHLETICS': return Skill.ATHLETICS;
      case 'DECEPTION': return Skill.DECEPTION;
      case 'HISTORY': return Skill.HISTORY;
      case 'INSIGHT': return Skill.INSIGHT;
      case 'INTIMIDATION': return Skill.INTIMIDATION;
      case 'INVESTIGATION': return Skill.INVESTIGATION;
      case 'MEDICINE': return Skill.MEDICINE;
      case 'NATURE': return Skill.NATURE;
      case 'PERCEPTION': return Skill.PERCEPTION;
      case 'PERFORMANCE': return Skill.PERFORMANCE;
      case 'PERSUASION': return Skill.PERSUASION;
      case 'RELIGION': return Skill.RELIGION;
      case 'SLEIGHT_OF_HAND': return Skill.SLEIGHT_OF_HAND;
      case 'STEALTH': return Skill.STEALTH;
      case 'SURVIVAL': return Skill.SURVIVAL;
      default: throw new Error(`Unknown skill name: ${name}`);
    }
  }
}