import 'phaser';

export default class Torpedos extends Phaser.GameObjects.Container {
    constructor(scene, x, y, camera) {
        const torpedo = scene.add.sprite(0, 0, 'torpedo').setOrigin(0.5).setScale(0.3);
        const torpedoFlame = scene.add.sprite(25, -7, 'torpedoFlame').setOrigin(0).setScale(0.3);
        super(scene, x, y, [torpedo, torpedoFlame]);
        this.setSize(50, 20);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.add.tween({
            targets: torpedoFlame,
            scaleX: 0.1,
            scaleY: 0.1,
            ease: 'EaseInOut',
            duration: 50,
            yoyo: true,
            repeat: -1,
        });

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