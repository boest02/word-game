let line;

class Screen1 extends Phaser.Scene {
    constructor() {
        super({key: "Screen1"});
        this.startingPoint = {};
        this.startingPoint.x = 0;       
        this.startingPoint.y = 0;
        this.startingPoint.target = null; 
    }

    preload() { 
    }

    create() {
        var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x0000aa } });
    
        // var circle = new Phaser.Geom.Circle(175, 350, 100);
        var selectedCircles = [];
        var activeCircle = {};
        var pointerCircles = [];
        
        var activeLine = {start: {x: 0, y: 0}, end: {x: 0, y: 0}};

        const setLineStart = (x, y) => {
            activeLine.start.x = x;
            activeLine.start.y = y;
        };

        const setLineEnd = (x, y) => {
            activeLine.end.x = x;
            activeLine.end.y = y;
        };

        pointerCircles.push(new Phaser.Geom.Circle(175, 350, 25));
        pointerCircles.push(new Phaser.Geom.Circle(300, 100, 25));
        pointerCircles.push(new Phaser.Geom.Circle(350, 650, 25));
        pointerCircles.push(new Phaser.Geom.Circle(130, 100, 25));

        
        activeCircle = null; //pointerCircles[Phaser.Math.RND.between(0, 2)];

        const setSelectedCircle = (x, y) => {
            let match = null;
            pointerCircles.forEach((circle) => {
                
                var distanceToCenterOfCircle = Phaser.Math.Distance.Between(circle.x, circle.y, x, y);
                var circleRadius = circle._radius;
                if (distanceToCenterOfCircle <= circleRadius){
                    match = circle;
                }
            });
            return match;
        };

        const drawLine = (startX, startY) => {
            graphics.beginPath();  
            graphics.moveTo(startX, startY);
        }

        const extendLine = (endX, endY) => {
            graphics.lineTo(endX, endY);
        }

        const addNextCircle = (circle) => {
            // only add if it's not already added            
            return selectedCircles.length === 0 || selectedCircles.find((item)=> item.x === circle.x && item.y === circle.y) === undefined;
        };

        this.input.on('pointermove', (pointer) => {      
            if(activeCircle) {
                setLineEnd(pointer.x, pointer.y);
                let nextCircle = setSelectedCircle(pointer.x, pointer.y);
                
                if(nextCircle && nextCircle != activeCircle) {
                    if(addNextCircle(nextCircle))
                    {
                        selectedCircles.push(nextCircle);                        
                        activeCircle = nextCircle;
                        setLineStart(activeCircle.x, activeCircle.y);
                    } 
                }
                redraw();  
            }                            
        });

        this.input.on('pointerdown', (pointer) => {
            if(pointer.primaryDown){
                activeCircle = setSelectedCircle(pointer.x, pointer.y);
                if(activeCircle) {
                    selectedCircles.push(activeCircle);
                    this.startingPoint.x = activeCircle.x;
                    this.startingPoint.y = activeCircle.y;
                    setLineStart(activeCircle.x, activeCircle.y);  
                }
            }
        });

        const resetAll = () => {
            activeCircle = null;
            selectedCircles = [];
        };

        this.input.on('pointerup', (pointer) => {
            resetAll();
            redraw();
        });
        

        redraw();

        const strokeLine = (startX, startY, endX, endY) => {
                graphics.lineStyle(12, 0xffffff);
                drawLine(startX, startY);
                extendLine(endX, endY);
                graphics.strokePath();
        }

        function redraw()
        {
            graphics.clear();

            pointerCircles.forEach((circle) => {
                graphics.strokeCircleShape(circle);
            });
            

            graphics.lineStyle(4, 0x00aa00);
            graphics.fillStyle(0xffffff, 1);
            
            selectedCircles.length && selectedCircles.forEach((circle, index) => {
                graphics.strokeCircleShape(circle);
                graphics.fillCircleShape(circle);
                if(index) {
                    strokeLine(selectedCircles[index-1].x, selectedCircles[index-1].y, circle.x, circle.y);
                }
            });
            // activeCircle && graphics.fillCircleShape(activeCircle);
            
            // activeCircle && pointerCircles.filter((circle)=> circle != activeCircle).forEach((circle) => {
            //     if (Phaser.Geom.Intersects.CircleToCircle(activeCircle, circle))
            //     {
            //         graphics.lineStyle(4, 0xaa0000);
            //         graphics.fillStyle(0x00aaa0, .1);
            //         graphics.strokeCircleShape(activeCircle);
            //     }                
            // });

            if(activeCircle) {
                strokeLine(activeLine.start.x, activeLine.start.y, activeLine.end.x, activeLine.end.y);
            }            
        }
        
    }

    update() {
    }
}

export default Screen1;