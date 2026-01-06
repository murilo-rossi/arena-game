import { Actor, Color, Font, FontUnit, Label, PointerEvent, vec, TextAlign, BaseAlign } from 'excalibur';

/**
 * A clickable button actor for in-game UI
 */
export class Button extends Actor {
    private label: Label;
    private normalColor: Color;
    private hoverColor: Color;
    private onClick: () => void;

    constructor(config: {
        text: string;
        pos: { x: number; y: number };
        width?: number;
        height?: number;
        fontSize?: number;
        onClick: () => void;
        normalColor?: Color;
        hoverColor?: Color;
    }) {
        const width = config.width ?? 200;
        const height = config.height ?? 50;

        super({
            pos: vec(config.pos.x, config.pos.y),
            width: width,
            height: height,
            color: config.normalColor ?? Color.fromHex('#4a4a4a'),
            anchor: vec(0.5, 0.5)
        });

        this.normalColor = config.normalColor ?? Color.fromHex('#4a4a4a');
        this.hoverColor = config.hoverColor ?? Color.fromHex('#6a6a6a');
        this.onClick = config.onClick;

        // Create label
        this.label = new Label({
            text: config.text,
            pos: vec(0, 0), // Centered relative to button
            font: new Font({
                family: 'Consolas',
                size: config.fontSize ?? 16,
                unit: FontUnit.Px,
                color: Color.White,
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle
            })
        });

        this.addChild(this.label);
    }

    onInitialize() {
        // Enable pointer events
        this.pointer.useGraphicsBounds = true;

        this.on('pointerenter', () => {
            this.color = this.hoverColor;
        });

        this.on('pointerleave', () => {
            this.color = this.normalColor;
        });

        this.on('pointerup', (_evt: PointerEvent) => {
            this.onClick();
        });
    }

    public setText(text: string) {
        this.label.text = text;
    }

    public setSelected(selected: boolean) {
        if (selected) {
            this.color = Color.fromHex('#2d5a2d');
        } else {
            this.color = this.normalColor;
        }
    }
}
