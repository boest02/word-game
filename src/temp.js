var items = {text: [], circles: [] };
let letters = ['A', 'B', 'C', 'D'];
var graphics;
let line;

class Screen2 extends Phaser.Scene {
    constructor() {
        super({key: "Screen2"});
        this.startingPoint = {};
        this.startingPoint.x = 0;       
        this.startingPoint.y = 0;
        this.startingPoint.target = null; 
    }

    preload() { 
    }

    create() {
        let background = this.add.sprite(0, 0, 'intro');
        background.setOrigin(0, 0);
        
        // const myCircle = new Phaser.Geom.Circle(-250, 510, 175);
       
        // var circle = this.add.graphics({ lineStyle: { width: 12, color: 0xffffff } });
        // circle.strokeCircleShape(myCircle);

        var circle = this.add.circle(250, 510, 175, 0x686868);
        circle.setStrokeStyle(14, 0xfffff);

        // this.input.setDraggable(circle, true);
        // console.log("OK");

        graphics = this.add.graphics();

        console.log("events", circle.eventNames());

        
        const layer = this.add.layer(); 

        let x = 125;
        let y = 400;
        let x_incr = 200;
        let y_incr = 150;

        for (var i = 0; i < letters.length; i++)
        {
            let text;
            let circle;

            // graphics.fillCircleShape(circle);
            // circle =  new Phaser.Geom.Circle(x+23, y+35, 35);
            

            let tempCircle = this.add.circle(x + 25, y + 35, 40, 0x000000);
            tempCircle.setFillStyle(0x000000, 10);
            // tempCircle.setInteractive(true);
                        

            // circle = this.add.circle(x + 25, y + 35, 40, 0x000000);
            circle = new Phaser.Geom.Circle(x + 25, y + 35, 40);
            let drawCircle = this.add.graphics({ lineStyle: { width: 5, color: 0xffffff } });            
            drawCircle.strokeCircleShape(circle);
            
            // circle.setFillStyle(0x000000, 10);
            
            
            // circle.setStrokeStyle(14, 0x000000);
            circle.setInteractive({ useHandCursor: true });
                        
            text = this.add.text(x, y, letters[i], { font: "65px Arial", fill: "#ffffff"});
                            
            // text.stroke = '#000000';
            // text.strokeThickness = 5;
            text.setStroke('rgba(0,0,0,0.9)', 3);
            text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
            // text.setStyle({ backgroundColor: '#111' });
            
            text.setData({count: i, letter: letters[i]});
            circle.setData({count: i, letter: letters[i]});
            
            items.text.push(text);
            items.circles.push(circle);
            
            x = i % 2 ? x - x_incr : x + x_incr ;
            y = i % 2 ? y  + y_incr : y;
        }   
        
        console.log("Items: ", items);
        
        this.input.setDraggable(items.circles, true);
        
        this.input.on('dragstart', (pointer, gameObject, dragX, dragY) => {
            
            console.log(gameObject);
            console.log(`dragstart: ${gameObject.getData('count')} - ${gameObject.getData('letter')}`);
            // items.circles[gameObject.getData('count')].setFillStyle(0xffffff, 1);
            this.startingPoint.x = gameObject.x + 25;
            this.startingPoint.y = gameObject.y + 30;      
            this.startingPoint.target = gameObject.getData('count');
            console.log("Started:", this.startingPoint.target);
            
            drawLine(this.startingPoint.x, this.startingPoint.y);
    
        });

        const drawLine = (endX, endY) => {
            
            // graphics.beginPath();   
            
            // graphics.lineStyle(20, 0xffffff);
            // this.add.graphics({ lineStyle: { width: 16, color: 0xffffff, alpha: 1 } });
            line = new Phaser.Geom.Line(this.startingPoint.x, this.startingPoint.y, endX, endY);
            graphics.strokeLineShape(line);
            // console.log("Move");
            // graphics.moveTo(this.startingPoint.x, this.startingPoint.y);
        }

        const extendLine = (endX, endY) => {
            
            line.setTo(this.startingPoint.x, this.startingPoint.y, endX, endY);
            graphics.strokeLineShape(line);
            // graphics.lineTo(endX, endY);
        }

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {      
                    
            graphics.clear();
            
            gameObject.x = dragX;
            gameObject.y = dragY;
            extendLine(dragX+25, dragY+30);
        });

        this.input.on('dragend', (pointer, gameObject, dragX, dragY) => {    
            console.log(`dragend: ${gameObject.getData('count')} - ${gameObject.getData('letter')}`);  
            // items.circles[gameObject.getData('count')].setFillStyle(0x686868, 0);            
            
            graphics.clear();
            this.startingPoint.x = 0;
            this.startingPoint.y = 0;      
            this.startingPoint.target = null;
        });

        this.tweens.add({
            targets: items.text,
            ease: 'EaseInOut',
            duration: 5000,
            delay: 1000,
            alpha: 1            
        });

    }

    checkOverlap = (dragItem, stationaryItem) => {      
        
        return Phaser.Geom.Intersects.GetCircleToCircle(dragItem, stationaryItem);
        // let boundsA = dragItem.getBounds();
        // let boundsB = stationaryItem.getBounds();

        // console.log("checkOverlap", {boundsA, boundsB} );
    
        // return Phaser.Rectangle.intersects(boundsA, boundsB);
    }

    update() {
        // if(line) console.log("Intersects?", Phaser.Geom.Intersects.LineToCircle(line, items.circles[1]));
       
        if(this.startingPoint.target != null) {
            console.log(this.startingPoint.target);
            items.circles.forEach((item, index) => {
                if(index != this.startingPoint.target) {
                    if(this.checkOverlap(items.circles[this.startingPoint.target], item)) {
                        console.log("Intersection!", {drag: items.circles[this.startingPoint.target], item});
                    }
                }
            });
        } 
    }
}

export default Screen2;