import { Scene, Engine, Label, Font, FontUnit, Color, vec, TextAlign, BaseAlign } from 'excalibur';
import { Button } from '../ui/Button';

// Screen dimensions
const SCREEN_WIDTH = 800;
const CENTER_X = SCREEN_WIDTH / 2;

// Available options
const AVAILABLE_CLASSES = ['master', 'berserker', 'tainter'];
const AVAILABLE_WEAPONS = ['stick', 'golden_stick', 'magic_orb'];

// Display names
const CLASS_NAMES: Record<string, string> = {
    'master': 'Mestre das Armas',
    'berserker': 'Berserker',
    'tainter': 'Tainter'
};

const WEAPON_NAMES: Record<string, string> = {
    'stick': 'Graveto',
    'golden_stick': 'Graveto de Ouro',
    'magic_orb': 'Orbe de Magia'
};

/**
 * Selection Scene - Player chooses class and weapon
 */
export class SelectionScene extends Scene {
    private selectedClass: string | null = null;
    private selectedWeapon: string | null = null;
    private classButtons: Button[] = [];
    private weaponButtons: Button[] = [];
    private startButton!: Button;

    onInitialize(engine: Engine) {
        const leftColumnX = CENTER_X - 130;
        const rightColumnX = CENTER_X + 130;

        // Title
        const title = new Label({
            text: 'SELECT YOUR FIGHTER',
            pos: vec(CENTER_X, 80),
            font: new Font({
                family: 'Arial',
                size: 24,
                unit: FontUnit.Px,
                color: Color.White,
                bold: true,
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle
            })
        });
        this.add(title);

        // Class label
        const classLabel = new Label({
            text: 'CLASS',
            pos: vec(leftColumnX, 150),
            font: new Font({
                family: 'Arial',
                size: 14,
                unit: FontUnit.Px,
                color: Color.Gray,
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle
            })
        });
        this.add(classLabel);

        // Class buttons
        AVAILABLE_CLASSES.forEach((classId, index) => {
            const btn = new Button({
                text: CLASS_NAMES[classId],
                pos: { x: leftColumnX, y: 200 + index * 60 },
                width: 180,
                height: 45,
                fontSize: 12,
                onClick: () => this.selectClass(classId)
            });
            this.classButtons.push(btn);
            this.add(btn);
        });

        // Weapon label
        const weaponLabel = new Label({
            text: 'WEAPON',
            pos: vec(rightColumnX, 150),
            font: new Font({
                family: 'Arial',
                size: 14,
                unit: FontUnit.Px,
                color: Color.Gray,
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle
            })
        });
        this.add(weaponLabel);

        // Weapon buttons
        AVAILABLE_WEAPONS.forEach((weaponId, index) => {
            const btn = new Button({
                text: WEAPON_NAMES[weaponId],
                pos: { x: rightColumnX, y: 200 + index * 60 },
                width: 180,
                height: 45,
                fontSize: 12,
                onClick: () => this.selectWeapon(weaponId)
            });
            this.weaponButtons.push(btn);
            this.add(btn);
        });

        // Start button
        this.startButton = new Button({
            text: 'START',
            pos: { x: CENTER_X, y: 420 },
            width: 200,
            height: 60,
            fontSize: 20,
            normalColor: Color.fromHex('#333333'),
            onClick: () => this.tryStart(engine)
        });
        this.add(this.startButton);

        // P2 info
        const p2Info = new Label({
            text: 'Player 2 will be randomized',
            pos: vec(CENTER_X, 520),
            font: new Font({
                family: 'Arial',
                size: 12,
                unit: FontUnit.Px,
                color: Color.fromHex('#666666'),
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle
            })
        });
        this.add(p2Info);
    }

    private selectClass(classId: string) {
        this.selectedClass = classId;
        this.classButtons.forEach((btn, index) => {
            btn.setSelected(AVAILABLE_CLASSES[index] === classId);
        });
        this.checkReady();
    }

    private selectWeapon(weaponId: string) {
        this.selectedWeapon = weaponId;
        this.weaponButtons.forEach((btn, index) => {
            btn.setSelected(AVAILABLE_WEAPONS[index] === weaponId);
        });
        this.checkReady();
    }

    private checkReady() {
        if (this.selectedClass && this.selectedWeapon) {
            this.startButton.color = Color.fromHex('#4a4a4a');
        }
    }

    private tryStart(engine: Engine) {
        if (this.selectedClass && this.selectedWeapon) {
            const p2Class = AVAILABLE_CLASSES[Math.floor(Math.random() * AVAILABLE_CLASSES.length)];
            const p2Weapon = AVAILABLE_WEAPONS[Math.floor(Math.random() * AVAILABLE_WEAPONS.length)];

            (engine as any).gameData = {
                p1: { class: this.selectedClass, weapon: this.selectedWeapon },
                p2: { class: p2Class, weapon: p2Weapon }
            };

            engine.goToScene('game');
        }
    }

    onActivate() {
        this.selectedClass = null;
        this.selectedWeapon = null;
        this.classButtons.forEach(btn => btn.setSelected(false));
        this.weaponButtons.forEach(btn => btn.setSelected(false));
        this.startButton.color = Color.fromHex('#333333');
    }
}
