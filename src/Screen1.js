class Screen1 extends Phaser.Scene {
    constructor() {
        super({key: "Screen1"});    
        this.selectedCircles = [];
        this.activeCircle = null;
        
        this.activeLine = {start: {x: 0, y: 0}, end: {x: 0, y: 0}};    
        this.graphics = null;

        this.pointerCircles = [];
    }

    redraw()
    {        
        this.graphics.clear();

        this.drawCircles(this.pointerCircles);

        this.graphics.lineStyle(4, 0x00aa00);
        this.graphics.fillStyle(0xffffff, 1);
        
        this.selectedCircles.length && this.selectedCircles.forEach((circle, index) => {
            this.graphics.strokeCircleShape(circle);
            this.graphics.fillCircleShape(circle);
            if(index) {
                this.strokeLine(this.selectedCircles[index-1].x, this.selectedCircles[index-1].y, circle.x, circle.y);
            }
        });            

        if(this.activeCircle) {
            this.strokeLine(this.activeLine.start.x, this.activeLine.start.y, this.activeLine.end.x, this.activeLine.end.y);
        }            
    }

    setLineStart(x, y) {
        this.activeLine.start.x = x;
        this.activeLine.start.y = y;
    }

    setLineEnd(x, y) {
        this.activeLine.end.x = x;
        this.activeLine.end.y = y;
    };

    setSelectedCircle(x, y) {
        let match = null;
        this.pointerCircles.forEach((circle) => {
            
            var distanceToCenterOfCircle = Phaser.Math.Distance.Between(circle.x, circle.y, x, y);
            var circleRadius = circle._radius;
            if (distanceToCenterOfCircle <= circleRadius){
                match = circle;
            }
        });
        return match;
    }

    drawLine(startX, startY) {
        this.graphics.beginPath();  
        this.graphics.moveTo(startX, startY);
    }

    extendLine(endX, endY){
        this.graphics.lineTo(endX, endY);
    }

    strokeLine(startX, startY, endX, endY) {
        this.graphics.lineStyle(12, 0xffffff);
        this.drawLine(startX, startY);
        this.extendLine(endX, endY);
        this.graphics.strokePath();
    }

    drawCircles(circles) {
        circles.forEach((circle) => {
            this.graphics.strokeCircleShape(circle);
        });            
    }  

    addNextCircle(circle, selected){
        // only add if it's not already added            
        return selected.length === 0 || selected.find((i)=> i.x === circle.x && i.y === circle.y) === undefined;
    }

    resetAll(){
        this.activeCircle = null;
        this.selectedCircles = [];
    }

    preload() { 
        this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x0000aa } });
    }

    create() {
                
        this.pointerCircles.push(new Phaser.Geom.Circle(175, 350, 25));
        this.pointerCircles.push(new Phaser.Geom.Circle(300, 100, 25));
        this.pointerCircles.push(new Phaser.Geom.Circle(350, 650, 25));
        this.pointerCircles.push(new Phaser.Geom.Circle(130, 100, 25));

        this.input.on('pointermove', (pointer) => {      
            if(this.activeCircle) {
                this.setLineEnd(pointer.x, pointer.y);
                let nextCircle = this.setSelectedCircle(pointer.x, pointer.y);
                
                if(nextCircle && nextCircle != this.activeCircle) {
                    if(this.addNextCircle(nextCircle, this.selectedCircles))
                    {
                        this.selectedCircles.push(nextCircle);                        
                        this.activeCircle = nextCircle;
                        this.setLineStart(this.activeCircle.x, this.activeCircle.y);
                    } 
                }
                this.redraw();  
            }                            
        });

        this.input.on('pointerdown', (pointer) => {
            if(pointer.primaryDown){
                this.activeCircle = this.setSelectedCircle(pointer.x, pointer.y);
                if(this.activeCircle) {
                    this.selectedCircles.push(this.activeCircle);                    
                    this.setLineStart(this.activeCircle.x, this.activeCircle.y);  
                }
            }
        });        

        this.input.on('pointerup', (pointer) => {
            this.resetAll();
            this.redraw();
        });               

        this.redraw();
        
    }

    update() {
    }
}

export default Screen1;