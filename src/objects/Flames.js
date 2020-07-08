import 'phaser';

export default class Flames extends Phaser.GameObjects.Image {
    constructor(scene, x, y, camera) {
        super(scene, x, y, 'flame');
        this.scene = scene;
        this.scene.add.existing(this);
        this.speed = 50
        this.x = x;
        this.y = y;
        this.camera = camera
        this.entryPoint = this.x;
    }

    update() {
        if (this.entryPoint - this.camera.scrollX <= 0) {
            this.destroy()
        }
    }

    fire() {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(this.x, this.y);

    }
}