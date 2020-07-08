import 'phaser';

export default class Airplanes extends Phaser.GameObjects.Image {
    constructor(scene, x, y, camera, player) {
        super(scene, x, y, 'badGuy');
        this.scene = scene;
        this.scene.add.existing(this);
        this.speed = 50
        this.x = x;
        this.y = y;
        this.setScale(0.3);
        this.camera = camera
        this.entryPoint = this.x;
        this.angle = -parseInt(Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y)) * 10;
        this.setAngle(this.angle)


    }
    update() {
        this.y -= 1 * (Math.sign(this.angle))
        this.x -= 4;
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