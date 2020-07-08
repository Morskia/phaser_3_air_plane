import 'phaser';

export default class Tanks extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, camera, player) {
        super(scene, x, y, 'tank');
        this.scene = scene;
        this.scene.add.existing(this);
        this.setScale(0.7);
        this.x = x;
        this.player = player;
        this.y = y;
        this.camera = camera
        this.entryPoint = this.x;
        this.alive = true
            //NOTE add math.rand() for better experience
        setTimeout(_ => { this.fire() }, 1500)
    }

    update() {
        if (this.entryPoint - this.camera.scrollX <= 0) {
            this.alive = false;
            this.destroy()
        }
    }

    move() {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(this.x, this.y);

    }

    fire() {
        //NOTE: if player is to fast tank will be dead at the moment of shot
        var angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
        if (this.alive) {
            this.scene.addBullet(this.x + 35, this.y - 50, angle);

        }


    }
}