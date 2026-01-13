import { Scene, Engine, Label, Font, FontUnit, Color, vec, TextAlign, BaseAlign } from 'excalibur';
import { Button } from '../ui/Button';

// Screen dimensions
const SCREEN_WIDTH = 800;
const CENTER_X = SCREEN_WIDTH / 2;

/**
 * Main Menu Scene - First screen the player sees
 */
export class MainMenuScene extends Scene {
    onInitialize(engine: Engine) {

        // Change background to main menu color
        engine.backgroundColor = Color.fromHex('#2b2b2b');

        // Title
        const title = new Label({
            text: 'Arena dos Círculos',
            pos: vec(CENTER_X, 200),
            font: new Font({
                family: 'Consolas',
                size: 64,
                unit: FontUnit.Px,
                color: Color.White,
                bold: true,
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle
            })
        });
        this.add(title);

        // Subtitle
        const subtitle = new Label({
            text: 'Batalhe!',
            pos: vec(CENTER_X, 280),
            font: new Font({
                family: 'Consolas',
                size: 16,
                unit: FontUnit.Px,
                color: Color.Gray,
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle
            })
        });
        this.add(subtitle);

        // Play Button
        const playButton = new Button({
            text: 'Jogar',
            pos: { x: CENTER_X, y: 450 },
            width: 200,
            height: 60,
            fontSize: 24,
            onClick: () => {
                engine.goToScene('selection');
            }
        });
        this.add(playButton);
    }
}
