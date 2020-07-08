import 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image('load_bg', 'assets/graphics/load.jpg');
        this.load.image('plane', 'assets/graphics/plane.png');
    }

    create() {
        this.scene.start('Preloader');
    }
}