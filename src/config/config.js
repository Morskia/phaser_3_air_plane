export default {
    type: Phaser.AUTO,
    parent: 'airplane',
    width: 1332,
    height: 670,
    pixelArt: true,
    roundPixels: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    }
};