import type { Player } from '../entities/Player';
import type { OnHitModifiers } from '../types/Stats';

/**
 * Manages onHit effects application when players hit each other
 * Applies modifiers from onHitGiven (attacker) and onHitTaken (victim)
 */
export class OnHitEffectManager {
    /**
     * Applies onHit effects when attacker's weapon hits victim
     * @param attacker The player dealing damage
     * @param victim The player taking damage
     */
    applyOnHit(attacker: Player, victim: Player): void {
        console.log(`[OnHit] P${attacker.playerId} hit P${victim.playerId}`);

        // Apply attacker's onHitGiven effects to themselves
        if (attacker.onHitGiven) {
            this.applyModifiers(attacker, attacker.onHitGiven, 'onHitGiven');
        }

        // Apply victim's onHitTaken effects to themselves
        if (victim.onHitTaken) {
            this.applyModifiers(victim, victim.onHitTaken, 'onHitTaken');
        }
    }

    /**
     * Applies modifiers from OnHitModifiers to target's ModifierManager
     * @param target The player receiving the modifiers
     * @param modifiers The onHit modifiers to apply
     * @param source The source of the modifiers (for logging)
     */
    private applyModifiers(target: Player, modifiers: OnHitModifiers, source: string): void {
        console.log(`\n[OnHit] Applying ${source} to P${target.playerId}:`);

        for (const [statName, value] of Object.entries(modifiers)) {
            if (typeof value === 'number') {
                // Determine if it's a flat or multiplier modifier based on naming convention
                const type = statName.toLowerCase().includes('multiplier') ? 'multiplier' : 'flat';

                // Get current modifier count for this stat
                const currentMods = target.modifierManager.getActiveModifiers()
                    .filter(m => m.stat === statName && m.type === type);
                const currentCount = currentMods.length;
                const currentTotal = currentMods.reduce((sum, m) => sum + m.value, 0);

                // Add the new modifier
                target.modifierManager.addModifier({
                    stat: statName,
                    value: value,
                    type: type
                });

                const newTotal = currentTotal + value;
                const stackInfo = currentCount > 0 ? ` (stack ${currentCount + 1}, total: ${newTotal.toFixed(2)})` : '';

                console.log(`  + ${statName} [${type}] +${value}${stackInfo}`);
            }
        }

        console.log(''); // Empty line for readability
    }
}
