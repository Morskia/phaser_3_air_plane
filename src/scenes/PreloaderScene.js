import 'phaser';


export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        this.readyCount = 0;
    }

    preload() {
        // IF Logo must be displayed
        // this.timedEvent = this.time.delayedCall(2000, this.ready, [], this);
        this.createPreloader();
        this.loadAssets();
    }

    createPreloader() {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        // add background
        this.add.image(width / 2, height / 2 - 100, 'load_bg');
        let initialPositionX = width / 2 - 100;
        const plane = this.add.sprite(initialPositionX, height / 2 - 10, 'plane').setScale(0.5).setDepth(3);
        //add game title
        let gameTitle = this.make.text({
            x: width / 2,
            y: height / 4 - 50,
            text: 'Air Strike',
            style: {
                font: '80px DirtyWar',
                fill: '#ffffff'
            }
        }).setOrigin(0.5, 0.5);

        // display progress bar
        let progressBar = this.add.graphics();
        let progresBox = this.add.graphics();
        progresBox.fillStyle(0x222222, 0.8);
        progresBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50);

        // loading text
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        }).setOrigin(0.5, 0.5);

        // percent text
        let percenText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percenText.setOrigin(0.5, 0.5);

        // loading assets text
        let assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        // update progress bar
        this.load.on('progress', value => {
            plane.x = initialPositionX + (300 * value);
            percenText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xFDD049, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 20, 300 * value, 30);
        });

        // update file progress text
        this.load.on('fileprogress', function(file) {
            assetText.setText('Loading asset: ' + file.key);
        });

        // remove progress bar when complete
        this.load.on('complete', _ => {
            //NOTE: set time out is used because loading is to fast
            setTimeout(_ => {
                progresBox.destroy();
                gameTitle.destroy();
                progressBar.destroy();
                assetText.destroy();
                loadingText.destroy();
                percenText.destroy();
                plane.destroy();

                // this.scene.start('Game');

                this.ready();
            }, 1000)
        });
    }

    loadAssets() {
        // load assets needed in our game

        this.load.spritesheet('tank', 'assets/graphics/tank.png', { frameWidth: 258, frameHeight: 177 });
        this.load.image('game_bg', 'assets/graphics/warscene.png');
        this.load.image('start', 'assets/graphics/start_btn.png');
        this.load.image('parachute', 'assets/graphics/parachute.png');
        this.load.image('badGuy', 'assets/graphics/bad_guy.png');
        this.load.image('torpedo', 'assets/graphics/torpedo.png');
        this.load.image('torpedoFlame', 'assets/graphics/torpedo_flame.png');
        this.load.image('flame', 'assets/graphics/flame.png');
        this.load.image('bullet', 'assets/graphics/bullet.png');



    }

    ready() {
        this.readyCount++;
        if (this.readyCount === 1) {
            //NOTE this will be used on Game Over so better be add in single class
            const parachute = this.add.sprite(0, 0, 'parachute').setOrigin(0.5, 0.5);
            const start = this.add.sprite(0, 75, 'start').setOrigin(0.5, 0.5).setInteractive({ cursor: 'pointer' });
            const startText = this.add.text(-40, 65, 'Start!', { fontSize: '26px', fill: '#fff', fontWeight: 'bolder', fontFamily: 'DirtyWar' });
            const container = this.add.container(650, -100, [parachute, start, startText]).setAngle(10);
            this.tweens.add({
                targets: container,
                callbackScope: this,
                container: this.tweens,
                y: 300,
                duration: 4000,
                onComplete() {
                    start.on('pointerdown', _ => {
                        container.destroy();
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
    }
}