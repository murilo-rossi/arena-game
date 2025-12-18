// Logic class responsible for calculating stats using additive multipliers.

export interface Modifier {
  stat: string;
  value: number;
  type: 'flat' | 'multiplier';
}

export class ModifierManager {
  private activeModifiers: Modifier[] = [];

  addModifier(mod: Modifier) {
    this.activeModifiers.push(mod);
  }

  removeModifier(mod: Modifier) {
    this.activeModifiers = this.activeModifiers.filter(m => m !== mod);
  }

  getActiveModifiers() {
    return this.activeModifiers;
  }

  // Calculates final value: (Base + sum of flats) * (1 + sum of multipliers)
  calculateStat(statName: string, baseValue: number): number {
    const mods = this.activeModifiers.filter(m => m.stat === statName);

    const totalFlat = mods
      .filter(m => m.type === 'flat')
      .reduce((sum, m) => sum + m.value, 0);

    const totalMultiplier = mods
      .filter(m => m.type === 'multiplier')
      .reduce((sum, m) => sum + m.value, 0);

    return (baseValue + totalFlat) * (1 + totalMultiplier);
  }
}