
class Game extends Phaser.Scene {
    constructor() {
        super({key: "Game"});
        // as user selects    
        this.selectedCircles = [];
        // current active
        this.activeCircle = null;
        
        // active line we're drawing
        this.activeLine = {start: {x: 0, y: 0}, end: {x: 0, y: 0}};    

        this.graphics = null;
        this.screenCenterH = 0;

        // initial circles and text
        this.pointerCircles = [];
        this.pointerText = [];

        // user selection playback area
        this.playBackText = '';

        let answerRow = {
            word: 'TESTER', // word for user
            boxes: [], // boxes for letters
            line: {} // position for boxes
        };

        let answerRow2 = {
            word: 'TEST', // word for user
            boxes: [], // boxes for letters
            line: {} // position for boxes
        };
        let answerRow3 = {
            word: 'TES', // word for user
            boxes: [], // boxes for letters
            line: {} // position for boxes
        };

        // word rows
        this.rows = [answerRow, answerRow2, answerRow3];

        // sample letters
        // this.letters = ['A', 'B', 'C'];
        // this.letters = ['A', 'B', 'C', 'D'];
        this.letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    }

    preload() {
        // get screen center
        this.screenCenterH = this.cameras.main.worldView.x + this.cameras.main.width / 2;

        // scene background
        let background = this.add.sprite(0, 0, 'intro');
        background.setOrigin(0, 0);
        
        // scene letter area circle
        let letterAreaRadius = 175;
        let letterAreaX = 250;
        let letterAreaY = 575;
        var circle = this.add.circle(letterAreaX, letterAreaY, letterAreaRadius, 0x686868, .7);
        circle.setStrokeStyle(7, 0xffffff), .7;      
        
        // graphics layer for circles and letters
        this.graphics = this.add.graphics();

        // setup the circles
        this.buildCircles();    
                
        // setup user selection playback area
        let playbackAreaFromTop = 355;
        this.playBackText = this.add.text(this.screenCenterH, playbackAreaFromTop, '', {font: "50px Arial"})
                                    .setOrigin(0.5)
                                    .setColor("#ffffff")
                                    .setPadding(10)
                                    .setStroke("#000000", 2)
                                    .setShadow(5, 10, 'rgba(0,0,0,0.5)', 5);; 
    }

    //
    // Draw everything that can change, on each change
    //
    redraw()
    {   
        // reset the screen     
        this.graphics.clear();

        this.addRows();
        
        // set fill for letter circles
        this.graphics.fillStyle(0xffffff, .2);

        // update the user selection letters
        this.showSelected();

        // reset letter colors
        this.pointerText.forEach((letter) => letter.setColor('#ffffff'))

        // redraw circles
        this.drawCircles(this.pointerCircles);
        
        // highlight selected circles and completed lines
        this.selectedCircles.length && this.selectedCircles.forEach((circle, index) => {
            let letter = this.findText(circle);
            // set highlighted letter color
            letter.setColor('#000000');
            
            // set highlighted circle fill
            this.graphics.fillStyle(0xffffff, 1);
            this.graphics.fillCircleShape(circle);

            // draw lines for already selected circles
            if(index) {
                this.strokeLine(this.selectedCircles[index-1].x,
                                this.selectedCircles[index-1].y, 
                                circle.x, 
                                circle.y);
            }
        });            

        // draw active line
        if(this.activeCircle) {
            this.strokeLine(this.activeLine.start.x, 
                            this.activeLine.start.y, 
                            this.activeLine.end.x, 
                            this.activeLine.end.y);
        }        
    }

    addRows() {

        let rounded = {
            tl: 5, 
            tr: 5, 
            bl: 5, 
            br: 5
        };

        let rows = this.rows;
        let rowPosition = 40;
        let maxColumns = 6;
        let columnWidth = 70;
        
        this.graphics.lineStyle(2, 0xffffff, 1);
        this.graphics.fillStyle(0x000000, .3);
        
        rows.forEach((row) => {
            let firstPosition = this.screenCenterH - columnWidth * (row.word.length/2);
            console.log("Starting Position: ", firstPosition);
            [...row.word].forEach((letter, i) => {
                this.graphics.strokeRoundedRect(firstPosition, rowPosition, 60, 60, rounded)
                             .fillRoundedRect(firstPosition, rowPosition, 60, 60, rounded);                
                firstPosition += columnWidth;
            });            
            rowPosition += 70;
        });

        console.log("Rows:", rows);

        

        
        
    }

    //
    // Set starting point for the active line
    //
    setLineStart(x, y) {
        this.activeLine.start.x = x;
        this.activeLine.start.y = y;
    }

    //
    // Set ending point for the active line
    //
    setLineEnd(x, y) {
        this.activeLine.end.x = x;
        this.activeLine.end.y = y;
    };

    //
    // Using current mouse/touch pointer location find which circle is selected
    //
    // Input/Output: x and y points and get back a circle IF points are in the circle
    //
    setSelectedCircle(x, y) {
        let match = null;
        // search all circles
        this.pointerCircles.forEach((circle) => {            
            var distanceToCenterOfCircle = Phaser.Math.Distance.Between(circle.x, circle.y, x, y);
            var circleRadius = circle._radius;
            if (distanceToCenterOfCircle <= circleRadius){
                match = circle;  // found circle
            }
        });
        return match;
    }

    //
    // Using the selected circle, in order, playback user selections
    //
    showSelected() {        
        let content = '';
        this.selectedCircles.forEach((circle) => {
            content += this.findText(circle).getData('letter');            
        });       
        this.playBackText.setText(content);                       
    }

    //
    // For a given circle find the text in it
    //
    // Input/Output: circle and return the text object that is associated with that circle
    //    
    findText(circle) {
        const searchForParent = (text) => {
            let parent = text.getData('parent');
            return parent.x === circle.x && parent.y === circle.y;
        };
        return this.pointerText.find(searchForParent);
    }

    //
    // Set the starting points of the line
    //
    drawLine(startX, startY) {
        this.graphics.beginPath();  
        this.graphics.moveTo(startX, startY);
    }

    //
    // extend the active line's end points
    //
    extendLine(endX, endY){
        this.graphics.lineTo(endX, endY);
    }

    //
    // Draw the actual line
    //
    strokeLine(startX, startY, endX, endY) {
        // active line width, color, and opacity/ 
        this.graphics.lineStyle(12, 0xffffff, .9);
        this.drawLine(startX, startY);
        this.extendLine(endX, endY);
        this.graphics.strokePath();
    }

    //
    // Draw the given circles
    //
    drawCircles(circles) {
        circles.forEach((circle) => {
            this.graphics.fillCircleShape(circle);
        });            
    }  

    //
    // Switch active circle, only if it's not already selected
    //
    // Input/Output: circle and selected circles find if this circle can be next
    //    
    addNextCircle(circle, selected){
        // only add if it's not already added            
        return selected.length === 0 || selected.find((i)=> i.x === circle.x && i.y === circle.y) === undefined;
    }

    //
    // reset the drawings to start before drag
    //
    resetAll(){
        this.activeCircle = null;
        this.selectedCircles = [];
    }

    buildCircles() {
        const getCircleCoordinates = (letters) => {
            var radius = 120; // radius of container
            var offsetX = 70; // offset from left of the page
            var offsetY = 345; // offset from top of the page
            var width = 400;  // width of render area
            var height = 500; // height of render area
            var angle = letters.length === 3 ? 10 : 0; // handle positioning different for 3 letters
            var step = (2 * Math.PI) / letters.length; // increment between letters
            let localLetters = []; // letters with positions
          
            letters.forEach((letter) => { 
              var x = Math.round(width / 2 + radius * Math.cos(angle) + offsetX - 40/2);
              var y = Math.round(height / 2 + radius * Math.sin(angle) + offsetY - 40/2);
              localLetters.push({letter, x, y });                     
              angle += step;
            });
            return localLetters;
        };

        // get positions for each letter
        let newLetters = getCircleCoordinates(this.letters);
        
        newLetters.forEach((item, i) => {
            let text;
            let circle;
                   
            //create letter circle
            circle = new Phaser.Geom.Circle(item.x, item.y, 40);
            
            // add text over circle, set font 
            text = this.add.text(item.x, item.y, item.letter, {font: "50px Arial"})
                           .setColor("#ffffff")
                           .setShadow(5, 5, 'rgba(0,0,0,0.5)', 5)
                           .setData({parent: circle, letter: item.letter}) // set data to use later
                           .setOrigin(0.5)
                           .setPadding(5);            
            
            // push each to arrays               
            this.pointerText.push(text);
            this.pointerCircles.push(circle);
          });
    }    

    create() {     
        // detect pointer down
        this.input.on('pointerdown', (pointer) => {
            // check for primary button
            if(pointer.primaryDown){
                // set active to simulate drag, IF point is in a circle, start line
                this.activeCircle = this.setSelectedCircle(pointer.x, pointer.y);
                if(this.activeCircle) {
                    this.selectedCircles.push(this.activeCircle);                    
                    this.setLineStart(this.activeCircle.x, this.activeCircle.y);  
                }
            }
        }); 

        // detect pointer movement
        this.input.on('pointermove', (pointer) => {    
            // only if a circle is actively clicked, to simulate drag  
            if(this.activeCircle) {
                // continue line to pointer location
                this.setLineEnd(pointer.x, pointer.y);
                
                // detect if pointer enters another (non-selected) circle
                let nextCircle = this.setSelectedCircle(pointer.x, pointer.y);                
                if(nextCircle && nextCircle != this.activeCircle) {
                    if(this.addNextCircle(nextCircle, this.selectedCircles))
                    {
                        // add to selected circles and update as the active circle
                        this.selectedCircles.push(nextCircle);                        
                        this.activeCircle = nextCircle;
                        // start new line from new circle
                        this.setLineStart(this.activeCircle.x, this.activeCircle.y);
                    } 
                }
                // redraw everything on each move
                this.redraw();  
            }                            
        });        

        // detect pointer up
        this.input.on('pointerup', (pointer) => {
            // only if a circle is actively clicked 
            if(this.activeCircle) {

                /// TODO: check if word match here...

                this.resetAll();
                this.redraw();
            }
        });               
        
        // first draw
        this.redraw();        
    }

    update() {
    }
}

export default Game;