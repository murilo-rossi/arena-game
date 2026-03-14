import { Sound } from 'excalibur';

/**
 * Centralized audio manager (singleton).
 * Handles all SFX and background music for the game.
 */
export class AudioManager {
    private static instance: AudioManager;

    // SFX
    private hitSounds: Sound[] = [];
    private wallHitSound!: Sound;
    private successSound!: Sound;
    private failedSound!: Sound;

    // Music
    private menuMusic!: Sound;

    private _loaded = false;

    private constructor() {}

    static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    async load(): Promise<void> {
        if (this._loaded) return;

        this.hitSounds = [
            new Sound('/assets/sfx/hitsound1.ogg'),
            new Sound('/assets/sfx/hitsound2.ogg'),
        ];
        this.wallHitSound  = new Sound('/assets/sfx/wall_hit.ogg');
        this.successSound  = new Sound('/assets/sfx/success.ogg');
        this.failedSound   = new Sound('/assets/sfx/failed.ogg');
        this.menuMusic     = new Sound('/assets/soundtrack/main_menu.ogg');

        this.menuMusic.loop = true;

        await Promise.all([
            ...this.hitSounds.map(s => s.load()),
            this.wallHitSound.load(),
            this.successSound.load(),
            this.failedSound.load(),
            this.menuMusic.load(),
        ]);

        this._loaded = true;
    }

    // Music

    playMenuMusic(): void {
        if (!this.menuMusic.isPlaying()) {
            this.menuMusic.play();
        }
    }

    stopMenuMusic(): void {
        this.menuMusic.stop();
    }

    // SFX

    playHitSound(): void {
        // Randomly pick one of the two hit sounds for variety
        const sound = this.hitSounds[Math.floor(Math.random() * this.hitSounds.length)];
        sound.play(0.7);
    }

    playWallHit(): void {
        this.wallHitSound.play(0.5);
    }

    playSuccess(): void {
        this.successSound.play();
    }

    playFailed(): void {
        this.failedSound.play();
    }
}
