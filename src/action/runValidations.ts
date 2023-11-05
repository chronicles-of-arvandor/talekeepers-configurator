import * as readline from "readline";
import { displayMainMenu } from "../index";
import {
  AbilityEffect,
  CharacterTraitEffect,
  Effect,
  FeatEffect,
  getEffects,
  InitiativeAbilityModBonusEffect,
  InitiativeBonusEffect,
  ItemProficiencyEffect,
  JackOfAllTradesEffect,
  LanguageEffect,
  SavingThrowProficiencyEffect,
  SkillExpertiseEffect,
  SkillProficiencyEffect,
  SpeedEffect,
  SpellEffect,
} from "../models/effects";
import {
  AbilityPrerequisite,
  AncestryPrerequisite,
  AndPrerequisite,
  BackgroundPrerequisite,
  ChoicePrerequisite,
  ClassPrerequisite,
  FeatPrerequisite,
  ItemProficiencyPrerequisite,
  LanguagePrerequisite,
  LevelPrerequisite,
  NotPrerequisite,
  OrPrerequisite,
  Prerequisite,
  SavingThrowProficiencyPrerequisite,
  SkillProficiencyPrerequisite,
  SpellPrerequisite,
  SubAncestryPrerequisite,
  SubClassPrerequisite,
} from "../models/prerequisites";
import { getAncestryById } from "../models/ancestries";
import { red } from "chalk";
import { getBackgroundById } from "../models/backgrounds";
import { getChoiceById, getChoices } from "../models/choices";
import { getClassById } from "../models/classes";
import { getFeatById } from "../models/feats";
import { getLanguageById } from "../models/languages";
import { getSpellById } from "../models/spells";
import _ from "lodash";

export function runValidations(rl: readline.Interface) {
  console.log("Running validations...");
  validateEffects();
  validateChoices();
  displayMainMenu(rl);
}

function validateEffects() {
  console.log("Validating effects...");
  const effects = getEffects();
  effects.forEach((effect, index) => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(
      `Validating effect ${index + 1}/${effects.length} (${effect.file})`,
    );
    const errors = validateEffect(effect);
    if (errors.length > 0) {
      console.log(`\n${errors.map((error) => red(error)).join("\n")}`);
    }
  });
}

function validateEffect(effect: Effect) {
  const errors: string[] = [];
  effect.prerequisites.forEach((prerequisite) => {
    errors.push(...validatePrerequisite(prerequisite));
    if (
      effect.prerequisites
        .filter((prereq2) => prereq2 !== prerequisite)
        .some((prereq2) => _.isEqual(prerequisite, prereq2))
    ) {
      errors.push(`Duplicate effect prerequisites: ${prerequisite.getName()}`);
    }
  });
  if (AbilityEffect.prototype.isPrototypeOf(effect)) {
    errors.push(...validateAbilityEffect(effect as AbilityEffect));
  } else if (CharacterTraitEffect.prototype.isPrototypeOf(effect)) {
    errors.push(
      ...validateCharacterTraitEffect(effect as CharacterTraitEffect),
    );
  } else if (FeatEffect.prototype.isPrototypeOf(effect)) {
    errors.push(...validateFeatEffect(effect as FeatEffect));
  } else if (InitiativeAbilityModBonusEffect.prototype.isPrototypeOf(effect)) {
    errors.push(
      ...validateInitiativeAbilityModBonusEffect(
        effect as InitiativeAbilityModBonusEffect,
      ),
    );
  } else if (InitiativeBonusEffect.prototype.isPrototypeOf(effect)) {
    errors.push(
      ...validateInitiativeBonusEffect(effect as InitiativeBonusEffect),
    );
  } else if (ItemProficiencyEffect.prototype.isPrototypeOf(effect)) {
    errors.push(
      ...validateItemProficiencyEffect(effect as ItemProficiencyEffect),
    );
  } else if (JackOfAllTradesEffect.prototype.isPrototypeOf(effect)) {
    errors.push(
      ...validateJackOfAllTradesEffect(effect as JackOfAllTradesEffect),
    );
  } else if (LanguageEffect.prototype.isPrototypeOf(effect)) {
    errors.push(...validateLanguageEffect(effect as LanguageEffect));
  } else if (SavingThrowProficiencyEffect.prototype.isPrototypeOf(effect)) {
    errors.push(
      ...validateSavingThrowProficiencyEffect(
        effect as SavingThrowProficiencyEffect,
      ),
    );
  } else if (SkillExpertiseEffect.prototype.isPrototypeOf(effect)) {
    errors.push(
      ...validateSkillExpertiseEffect(effect as SkillExpertiseEffect),
    );
  } else if (SkillProficiencyEffect.prototype.isPrototypeOf(effect)) {
    errors.push(
      ...validateSkillProficiencyEffect(effect as SkillProficiencyEffect),
    );
  } else if (SpeedEffect.prototype.isPrototypeOf(effect)) {
    errors.push(...validateSpeedEffect(effect as SpeedEffect));
  } else if (SpellEffect.prototype.isPrototypeOf(effect)) {
    errors.push(...validateSpellEffect(effect as SpellEffect));
  }
  return errors;
}

function validateAbilityEffect(effect: AbilityEffect) {
  return [];
}

function validateCharacterTraitEffect(effect: CharacterTraitEffect) {
  return [];
}

function validateFeatEffect(effect: FeatEffect) {
  const errors: string[] = [];
  effect.feats.forEach((featId) => {
    const feat = getFeatById(featId);
    if (!feat) {
      errors.push(`Feat with ID ${featId} not found`);
    }
  });
  return errors;
}

function validateInitiativeAbilityModBonusEffect(
  effect: InitiativeAbilityModBonusEffect,
) {
  return [];
}

function validateInitiativeBonusEffect(effect: InitiativeBonusEffect) {
  return [];
}

function validateItemProficiencyEffect(effect: ItemProficiencyEffect) {
  const errors: string[] = [];
  effect.items.forEach((itemId) => {
    if (!/^[a-z0-9_]+$/.test(itemId)) {
      errors.push(
        `Item ID ${itemId} does not match the pattern /^[a-z0-9_]+$/`,
      );
    }
  });
  return errors;
}

function validateJackOfAllTradesEffect(effect: JackOfAllTradesEffect) {
  return [];
}

function validateLanguageEffect(effect: LanguageEffect) {
  const errors: string[] = [];
  effect.languages.forEach((languageId) => {
    const language = getLanguageById(languageId);
    if (!language) {
      errors.push(`Language with ID ${languageId} not found`);
    }
  });
  return errors;
}

function validateSavingThrowProficiencyEffect(
  effect: SavingThrowProficiencyEffect,
) {
  return [];
}

function validateSkillExpertiseEffect(effect: SkillExpertiseEffect) {
  return [];
}

function validateSkillProficiencyEffect(effect: SkillProficiencyEffect) {
  return [];
}

function validateSpeedEffect(effect: SpeedEffect) {
  return [];
}

function validateSpellEffect(effect: SpellEffect) {
  const errors: string[] = [];
  effect.spells.forEach((spellId) => {
    const spell = getSpellById(spellId);
    if (!spell) {
      errors.push(`Spell with ID ${spellId} not found`);
    }
  });
  return errors;
}

function validatePrerequisite(prerequisite: Prerequisite): string[] {
  if (AbilityPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    return validateAbilityPrerequisite(prerequisite as AbilityPrerequisite);
  } else if (AncestryPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    return validateAncestryPrerequisite(prerequisite as AncestryPrerequisite);
  } else if (AndPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    return validateAndPrerequisite(prerequisite as AndPrerequisite);
  } else if (BackgroundPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    return validateBackgroundPrerequisite(
      prerequisite as BackgroundPrerequisite,
    );
  } else if (ChoicePrerequisite.prototype.isPrototypeOf(prerequisite)) {
    return validateChoicePrerequisite(prerequisite as ChoicePrerequisite);
  } else if (ClassPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    return validateClassPrerequisite(prerequisite as ClassPrerequisite);
  } else if (FeatPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    return validateFeatPrerequisite(prerequisite as FeatPrerequisite);
  } else if (
    ItemProficiencyPrerequisite.prototype.isPrototypeOf(prerequisite)
  ) {
    return validateItemProficiencyPrerequisite(
      prerequisite as ItemProficiencyPrerequisite,
    );
  } else if (LanguagePrerequisite.prototype.isPrototypeOf(prerequisite)) {
    return validateLanguagePrerequisite(prerequisite as LanguagePrerequisite);
  } else if (LevelPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    return validateLevelPrerequisite(prerequisite as LevelPrerequisite);
  } else if (NotPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    return validateNotPrerequisite(prerequisite as NotPrerequisite);
  } else if (OrPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    return validateOrPrerequisite(prerequisite as OrPrerequisite);
  } else if (
    SavingThrowProficiencyPrerequisite.prototype.isPrototypeOf(prerequisite)
  ) {
    return validateSavingThrowProficiencyPrerequisite(
      prerequisite as SavingThrowProficiencyPrerequisite,
    );
  } else if (
    SkillProficiencyPrerequisite.prototype.isPrototypeOf(prerequisite)
  ) {
    return validateSkillProficiencyPrerequisite(
      prerequisite as SkillProficiencyPrerequisite,
    );
  } else if (SpellPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    return validateSpellPrerequisite(prerequisite as SpellPrerequisite);
  } else if (SubAncestryPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    return validateSubAncestryPrerequisite(
      prerequisite as SubAncestryPrerequisite,
    );
  } else if (SubClassPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    return validateSubClassPrerequisite(prerequisite as SubClassPrerequisite);
  } else {
    return [];
  }
}

function validateAbilityPrerequisite(prerequisite: AbilityPrerequisite) {
  return [];
}

function validateAncestryPrerequisite(prerequisite: AncestryPrerequisite) {
  const ancestry = getAncestryById(prerequisite.ancestryId);
  if (!ancestry) {
    return [`Ancestry with ID ${prerequisite.ancestryId} not found`];
  }
  return [];
}

function validateAndPrerequisite(prerequisite: AndPrerequisite) {
  const errors: string[] = [];
  prerequisite.prerequisites.forEach((sub1) => {
    errors.push(...validatePrerequisite(sub1));
    if (
      prerequisite.prerequisites
        .filter((sub2) => sub2 !== sub1)
        .some((sub2) => _.isEqual(sub1, sub2))
    ) {
      errors.push(`Duplicate AND child prerequisites: ${sub1.getName()}`);
    }
  });
  return errors;
}

function validateBackgroundPrerequisite(prerequisite: BackgroundPrerequisite) {
  const background = getBackgroundById(prerequisite.backgroundId);
  if (!background) {
    return [`Background with ID ${prerequisite.backgroundId} not found`];
  }
  return [];
}

function validateChoicePrerequisite(prerequisite: ChoicePrerequisite) {
  const choice = getChoiceById(prerequisite.choiceId);
  if (!choice) {
    return [`Choice with ID ${prerequisite.choiceId} not found`];
  }
  const option = choice.getOptionById(prerequisite.optionId);
  if (!option) {
    return [
      `Option with ID ${prerequisite.optionId} not found in choice ${prerequisite.choiceId}`,
    ];
  }
  return [];
}

function validateClassPrerequisite(prerequisite: ClassPrerequisite) {
  const clazz = getClassById(prerequisite.classId);
  if (!clazz) {
    return [`Class with ID ${prerequisite.classId} not found`];
  }
  return [];
}

function validateFeatPrerequisite(prerequisite: FeatPrerequisite) {
  const feat = getFeatById(prerequisite.featId);
  if (!feat) {
    return [`Feat with ID ${prerequisite.featId} not found`];
  }
  return [];
}

function validateItemProficiencyPrerequisite(
  prerequisite: ItemProficiencyPrerequisite,
) {
  const errors: string[] = [];
  prerequisite.itemIds.forEach((itemId) => {
    if (!/^[a-z0-9_]+$/.test(itemId)) {
      errors.push(
        `Item ID ${itemId} does not match the pattern /^[a-z0-9_]+$/`,
      );
    }
  });
  return errors;
}

function validateLanguagePrerequisite(prerequisite: LanguagePrerequisite) {
  const errors: string[] = [];
  prerequisite.languageIds.forEach((languageId) => {
    const language = getLanguageById(languageId);
    if (!language) {
      errors.push(`Language with ID ${languageId} not found`);
    }
  });
  return errors;
}

function validateLevelPrerequisite(prerequisite: LevelPrerequisite) {
  if (prerequisite.level < 1 || prerequisite.level > 20) {
    return [`Level ${prerequisite.level} is not between 1 and 20`];
  }
  return [];
}

function validateNotPrerequisite(prerequisite: NotPrerequisite) {
  return validatePrerequisite(prerequisite.prerequisite);
}

function validateOrPrerequisite(prerequisite: OrPrerequisite) {
  const errors: string[] = [];
  prerequisite.prerequisites.forEach((sub1) => {
    errors.push(...validatePrerequisite(sub1));
    if (
      prerequisite.prerequisites
        .filter((sub2) => sub2 !== sub1)
        .some((sub2) => _.isEqual(sub1, sub2))
    ) {
      errors.push(`Duplicate OR child prerequisites: ${sub1.getName()}`);
    }
  });
  return errors;
}

function validateSavingThrowProficiencyPrerequisite(
  prerequisite: SavingThrowProficiencyPrerequisite,
) {
  return [];
}

function validateSkillProficiencyPrerequisite(
  prerequisite: SkillProficiencyPrerequisite,
) {
  return [];
}

function validateSpellPrerequisite(prerequisite: SpellPrerequisite) {
  const errors: string[] = [];
  prerequisite.spellIds.forEach((spellId) => {
    const spell = getSpellById(spellId);
    if (!spell) {
      errors.push(`Spell with ID ${spellId} not found`);
    }
  });
  return errors;
}

function validateSubAncestryPrerequisite(
  prerequisite: SubAncestryPrerequisite,
) {
  const ancestry = getAncestryById(prerequisite.ancestryId);
  if (!ancestry) {
    return [`Ancestry with ID ${prerequisite.ancestryId} not found`];
  }
  const subAncestry = ancestry.getSubAncestryById(prerequisite.subAncestryId);
  if (!subAncestry) {
    return [
      `Sub ancestry with ID ${prerequisite.subAncestryId} not found in ancestry ${prerequisite.ancestryId}`,
    ];
  }
  return [];
}

function validateSubClassPrerequisite(prerequisite: SubClassPrerequisite) {
  const clazz = getClassById(prerequisite.classId);
  if (!clazz) {
    return [`Class with ID ${prerequisite.classId} not found`];
  }
  const subclass = clazz.getSubClassById(prerequisite.subClassId);
  if (!subclass) {
    return [
      `Sub class with ID ${prerequisite.subClassId} not found in class ${prerequisite.classId}`,
    ];
  }
  return [];
}

function validateChoices() {
  console.log("Validating choices...");
  const choices = getChoices();
  choices.forEach((choice, index) => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(
      `Validating choice ${index + 1}/${choices.length} (${choice.file})`,
    );
    const errors: string[] = [];
    choice.prerequisites.forEach((prerequisite) => {
      errors.push(...validatePrerequisite(prerequisite));
      if (
        choice.prerequisites
          .filter((prereq2) => prereq2 !== prerequisite)
          .some((prereq2) => _.isEqual(prerequisite, prereq2))
      ) {
        errors.push(
          `Duplicate choice prerequisites: ${prerequisite.getName()}`,
        );
      }
    });
    choice.options.forEach((option) => {
      option.prerequisites.forEach((prerequisite) => {
        errors.push(...validatePrerequisite(prerequisite));
        if (
          option.prerequisites
            .filter((prereq2) => prereq2 !== prerequisite)
            .some((prereq2) => _.isEqual(prerequisite, prereq2))
        ) {
          errors.push(
            `Duplicate option prerequisites: ${prerequisite.getName()}`,
          );
        }
      });
    });
    if (errors.length > 0) {
      console.log(`\n${errors.map((error) => red(error)).join("\n")}`);
    }
  });
}
