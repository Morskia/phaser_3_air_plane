import 'phaser';
import Flames from '../objects/Flames';
import Torpedos from '../objects/Torpedos';
import Airplanes from '../objects/Airplanes';
import Tanks from '../objects/Tanks';
import Bullets from '../objects/Bullets';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');

    }

    init() {
        this.nextEnemy = 0;
        this.nextTank = 0;
        this.distance = 0;
        this.inAir = true;
        //NOTE levelModifier can be use to incarease number of enemies and theirs
        this.levelModifier = 1;
        this.speed = 100;
        this.typeOfEnemies = ['addFlame', 'addTorpedo', 'addAirplane', 'addTank']
        this.gameStart = false;
    }

    create() {
        this.anims.create({
            key: 'leftwalk',
            frames: this.anims.generateFrameNumbers('tank', { start: 1, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        this.physics.world.setBounds(0, 0, this.game.width, 638);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.game_bg = this.add.tileSprite(0, 0, this.cameras.main.width, this.game.height, "game_bg").setOrigin(0, 0).setScrollFactor(0, 1);
        this.plane = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'plane').setScale(0.4);
        this.cameras.main.startFollow(this.plane);
        //prevent camera tracking Y movement
        this.cameras.main.setLerp(true, 0);
        this.physics.world.enable(this.plane);
        this.plane.body.setVelocityX(this.speed, 0);
        this.plane.body.setCollideWorldBounds(true);
        this.distancePass = this.add.text(5, 5, 'Distance: 0 km', { fontSize: '16px', fill: '#fff', fontFamily: 'DirtyWar' }).setScrollFactor(0);

        this.timedEvent = this.time.delayedCall(2000, this.addEnemies, [], this);

    }

    addEnemies() {
        this.flames = this.physics.add.group({ classType: Flames, runChildUpdate: true });
        this.torpedos = this.physics.add.group({ classType: Torpedos, runChildUpdate: true });
        this.airplanes = this.physics.add.group({ classType: Airplanes, runChildUpdate: true });
        this.tanks = this.physics.add.group({ classType: Tanks, runChildUpdate: true });
        this.bullets = this.physics.add.group({ classType: Bullets, runChildUpdate: true });
        this.physics.add.overlap(this.plane, [this.flames, this.airplanes, this.torpedos, this.bullets], this.dead, null, this);
        this.gameStart = true;
    }
    dead(player, withThis) {
        withThis.destroy()
        this.inAir = false;
        Phaser.Actions.Call(this.flames.children.entries, childflames => childflames.destroy());
        Phaser.Actions.Call(this.torpedos.children.entries, childTorpedos => childTorpedos.destroy());
        Phaser.Actions.Call(this.airplanes.children.entries, childAirplanes => childAirplanes.destroy());
        Phaser.Actions.Call(this.tanks.children.entries, childTanks => childTanks.destroy());
        this.plane.destroy()
        this.add.text(this.cameras.main.scrollX + (this.cameras.main.width - 180) / 2, this.cameras.main.height / 2, "GAME OVER", { fontSize: '36px', fill: '#fff', fontFamily: 'DirtyWar' });
        //TODO: Create Class for parashute animation
        const parachute = this.add.sprite(0, 0, 'parachute').setOrigin(0.5, 0.5);
        const start = this.add.sprite(0, 75, 'start').setOrigin(0.5, 0.5).setInteractive({ cursor: 'pointer' });
        const startText = this.add.text(-40, 65, 'Retry !', { fontSize: '24px', fill: '#fff', fontWeight: 'bolder', fontFamily: 'DirtyWar' });
        const container = this.add.container(this.cameras.main.scrollX + this.cameras.main.width / 2, -100, [parachute, start, startText]).setAngle(10);
        this.tweens.add({
            targets: container,
            callbackScope: this,
            container: this.tweens,
            y: 350,
            duration: 4000,
            onComplete() {
                start.on('pointerdown', _ => {
                    container.destroy();
                    this.nextEnemy = 0;
                    this.nextTank = 5000;
                    this.distance = 0;
                    this.inAir = true;
                    this.levelModifier = 1;
                    this.speed = 100;
                    this.scene.start('Game');
                })
            }
        });
        this.tweens.add({
            targets: parachute,
            alpha: 0,
            delay: 2000,
            duration: 2000,
            repeat: 0,
        });
        this.tweens.add({
            targets: container,
            angle: { from: 10, to: -10 },
            duration: 1000,
            yoyo: true,
            repeat: 1,
            onComplete() {
                container.setAngle(0)
            }
        });


    }


    update(time) {

            if (this.inAir) {
                this.game_bg.tilePositionX = this.cameras.main.scrollX * .3;
                //this.game_bg.tilePositionY = 0;
                if (this.cursors.right.isDown) {
                    this.speed += 10;
                } else {
                    if (this.speed > 100) {
                        this.speed -= 10;
                    }
                }
                if (this.cursors.left.isDown && this.speed > 100) {
                    this.speed -= 10;
                }
                if (this.cursors.up.isDown) {
                    this.plane.y -= 5;
                }
                if (this.cursors.down.isDown) {
                    this.plane.y += 5;
                }
                this.distancePass.setText('Distance: ' + parseInt(this.plane.x) + ' km');
                this.plane.body.setVelocityX(this.speed, 0)
                if (this.gameStart) {
                    this.tanks.playAnimation('leftwalk', true)
                    if (time > this.nextEnemy) {
                        Math.floor(Math.random() * this.cameras.main.height + 27)
                        this[this.typeOfEnemies[Math.floor(Math.random() * Math.floor(3))]]()
                        this.nextEnemy = (time - this.plane.body.velocity.x) + 2000;
                    }
                    if (time > this.nextTank) {
                        this[this.typeOfEnemies[3]]()
                        this.nextTank = (time - this.plane.body.velocity.x) + 8000;
                    }
                }


            }

        }
        //NOTE all of this methods are added for faster development. One method with param must be implemented.
    addAirplane() {
        let airPlane = this.airplanes.getFirstDead();
        if (!airPlane) {
            airPlane = new Airplanes(this, this.cameras.main.width + this.cameras.main.scrollX, Math.floor(Math.random() * (this.cameras.main.height - 150) + 27), this.cameras.main, this.plane);
            this.airplanes.add(airPlane);
        }
        airPlane.fire();
    }

    addTorpedo() {
        let torpedo = this.torpedos.getFirstDead();
        if (!torpedo) {
            torpedo = new Torpedos(this, this.cameras.main.width + this.cameras.main.scrollX, Math.floor(Math.random() * (this.cameras.main.height - 150) + 27), this.cameras.main);
            this.torpedos.add(torpedo);
        }
        torpedo.fire();
    }
    addFlame() {
        let flame = this.flames.getFirstDead();
        if (!flame) {
            flame = new Flames(this, this.cameras.main.width + this.cameras.main.scrollX, Math.floor(Math.random() * (this.cameras.main.height - 150) + 27), this.cameras.main);
            this.flames.add(flame);
        }
        flame.fire();
    }
    addTank() {
        this.tank = this.tanks.getFirstDead();
        if (!this.tank) {
            this.tank = new Tanks(this, this.cameras.main.width + this.cameras.main.scrollX, this.cameras.main.height - 20, this.cameras.main, this.plane);
            this.tanks.add(this.tank);
        }
        this.tank.move();
    }
    addBullet(x, y, angle) {
        var bullet = this.bullets.getFirstDead();
        if (!bullet) {
            bullet = new Bullets(this, 0, 0, this.cameras.main);
            this.bullets.add(bullet);
        }
        bullet.fire(x, y, angle);
    }


}