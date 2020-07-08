import 'phaser';

export default class Bullet extends Phaser.GameObjects.Image {
    constructor(scene, x, y, camera) {
        super(scene, x, y, 'bullet');
        this.scene = scene;
        this.dx = 0;
        this.dy = 0;
        this.lifespan = 0;
        this.speed = Phaser.Math.GetSpeed(600, 1);
        this.entryPoint = this.x;
        this.scene.add.existing(this);
        this.camera = camera;
    }

    update(time, delta) {
        this.x += this.dx * (this.speed * delta);
        this.y += this.dy * (this.speed * delta);
    }

    fire(x, y, angle) {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        this.dx = Math.cos(angle);
        this.dy = Math.sin(angle);
    }
}