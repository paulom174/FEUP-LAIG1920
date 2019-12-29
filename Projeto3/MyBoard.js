/**
 * MyBoard
 * @constructor
 */
class MyBoard extends CGFobject {
    constructor(scene, boardString){
        super(scene);

        this.updateBoard(boardString);
        this.initBuffers();
        this.init();
        this.piece = new MyPiece(this.scene);
    }

    initBuffers()
    {
        this.vertices = [];
        this.indices = [];
        this.normals=[];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    init(){
        //white texture
        this.white = new CGFappearance(this.scene);
        this.white.setAmbient(1, 1, 1, 1);
        this.white.setDiffuse(1, 1, 1, 1);
        this.white.setSpecular(1, 1, 1, 1);
        this.white.setShininess(10.0);
        this.white.loadTexture('images/white.jpg');
        this.white.setTextureWrap('REPEAT', 'REPEAT');

        //green texture
        this.green = new CGFappearance(this.scene);
        this.green.setAmbient(0, 1, 0, 1);
        this.green.setDiffuse(0, 1, 0, 1);
        this.green.setSpecular(0, 1, 0, 1);
        this.green.setShininess(10.0);

        //red texture
        this.red = new CGFappearance(this.scene);
        this.red.setAmbient(1, 0, 0, 1);
        this.red.setDiffuse(1, 0, 0, 1);
        this.red.setSpecular(1, 0, 0, 1);
        this.red.setShininess(10.0);

        //yellow texture
        this.yellow = new CGFappearance(this.scene);
        this.yellow.setAmbient(1, 1, 0, 1);
        this.yellow.setDiffuse(1, 1, 0, 1);
        this.yellow.setSpecular(1, 1, 0, 1);
        this.yellow.setShininess(10.0);

        //blue texture
        this.blue = new CGFappearance(this.scene);
        this.blue.setAmbient(0, 0, 1, 1);
        this.blue.setDiffuse(0, 0, 1, 1);
        this.blue.setSpecular(0, 0, 1, 1);
        this.blue.setShininess(10.0);
    }

	updateBoard(boardString){
		this.boardString = boardString;
		this.boardArray = JSON.parse(boardString);
    }

    
    updateValidMoves(movesString){
        this.movesString = movesString;
        this.movesArray = JSON.parse(movesString);
    }
    


    display(){
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 1,0,0);

        for(var i= 0; i < this.boardArray.length; i++){
            this.scene.pushMatrix();
            for(var j = 0; j < this.boardArray[i].length; j++){
                this.scene.translate(2,0,0);
                
                if((i % 2) ==1){
                    this.scene.pushMatrix();
                    this.scene.translate(1,0,0);
                }

                if(this.boardArray[i][j] == 0){
                    this.piece.changeColor(this.white);
                }
                if(this.boardArray[i][j] == 1){
                    this.piece.changeColor(this.red);
                }
                if(this.boardArray[i][j] == 3){
                    this.piece.changeColor(this.green);
                }

                if(this.movesArray != null){
                    this.movesArray.forEach(move => {
                        if(i == move[0] && j == move[1]){
                            this.piece.changeColor(this.yellow);
                        }
                    });
                }

                this.piece.display();
                if((i % 2) ==1){
                    this.scene.popMatrix();
                }
            }
            this.scene.popMatrix();
            this.scene.translate(0,1.8,0);
        }
        this.scene.popMatrix();
    }
    updateTexCoords(s, t) {

        this.updateTexCoordsGLBuffers();
    }

};