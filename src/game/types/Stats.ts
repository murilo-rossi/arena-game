/**
 * Type definitions for game statistics
 */

export interface CharacterBaseStats {
    // Core stats
    hp: number;
    moveSpeed: number;
    sizeMultiplier: number;

    // Attack stats
    criticalChance: number;
    criticalMultiplier: number;
    criticalDamageIncreaseMultiplier: number;

    // Modifiers - Flat increases
    moveSpeedIncreaseFlat: number;
    atkSpeedIncreaseFlat: number;
    defenseIncreaseFlat: number;
    damageIncreaseFlat: number;

    // Modifiers - Multipliers
    moveSpeedIncreaseMultiplier: number;
    atkSpeedIncreaseMultiplier: number;
    defenseIncreaseMultiplier: number;
    damageIncreaseMultiplier: number;
}

export interface WeaponBaseStats {
    damage: number;
    baseAtkSpeed: number;
    sizeMultiplier: number;

    // Modifiers
    atkSpeedMultiplier: number;
    damageIncreaseFlat: number;
    damageIncreaseMultiplier: number;
}

export interface SkillEffect {
    // Common modifiers
    atkSpeedMultiplier?: number;
    moveSpeedMultiplier?: number;
    sizeMultiplier?: number;
    damageIncreaseFlat?: number;
    damageIncreaseMultiplier?: number;
    healOnActivate?: number;

    // Unique effects
    poisonAllArena?: boolean;
    poisonDamagePerSecond?: number;
    lifesteal?: number;
}

export interface ActiveSkill {
    id: string;
    name: string;
    cooldown: number;
    duration: number;
    effects: SkillEffect;
}

export interface OnHitModifiers {
    atkSpeedIncreaseFlat?: number;
    criticalChance?: number;
    criticalDamageIncreaseMultiplier?: number;
}
