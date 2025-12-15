export class Renderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor() {
        this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;

        //Tamanho da arena
        this.resize(800, 600);
    }

    resize(width: number, height: number) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    drawSprite(image: HTMLImageElement, x: number, y: number, size: number) {
        this.ctx.drawImage(image, x - size / 2, y - size / 2, size, size);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}   