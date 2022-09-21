class Intro extends Phaser.Scene {
    constructor() {
        super({key: "Intro"});       

    }

    preload() {
        this.load.image('intro', '../assets/intro.jpg');
        this.load.image('title', '../assets/start.png');
    }

    create() {
        let background = this.add.sprite(0, 0, 'intro');
        background.setOrigin(0, 0);
        
        let title = this.add.sprite(250, -250, 'title'); 
        title.setScale(.2);
        title.setInteractive();
        title.on('pointerdown', () => { console.log('clicked'); this.scene.start('Game'); });
        // title.anchor.set(0.5);
        // title.tint = 0x000000;
        // title.alpha = 0.6;
        

        let opening = this.tweens.add({
            targets: title,
            y: 350,
            ease: 'Bounce',
            duration: 2500,
            delay: 500
            
        });
        
        
        console.log("set next Scene...");
        // setTimeout(() => this.scene.start('Screen1'), 5000);
    }
}

export default Intro;