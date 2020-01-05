/**
 * MyBoard
 * @constructor
 */
class MyBoard extends CGFobject {
    constructor(scene, boardString){
        super(scene);
        this.allBoards = [];
        this.saveBoards = [];
        this.updateBoard(boardString);
        this.initBuffers();
        this.init();
        this.piece = new MyPiece(this.scene);
        this.count = 0;
    }

    initBuffers()
    {
        this.vertices = [];
        this.indices = [];
        this.normals=[];

        this.hex = new CGFOBJModel(this.scene, 'models/piece.obj');
        this.tower = new CGFOBJModel(this.scene, 'models/tower.obj');

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
        this.white.setTextureWrap('REPEAT', 'REPEAT');

        //white texture
        this.beje = new CGFappearance(this.scene);
        this.beje.setAmbient(0.7, 0.7, 0.7, 1);
        this.beje.setDiffuse(0.7, 0.7, 0.7, 1);
        this.beje.setSpecular(0.7, 0.7, 0.7, 1);
        this.beje.setShininess(10.0);
        this.beje.setTextureWrap('REPEAT', 'REPEAT');

        //black texture
        this.black = new CGFappearance(this.scene);
        this.black.setAmbient(0.2, 0.2, 0.2, 1);
        this.black.setDiffuse(0.2, 0.2, 0.2, 1);
        this.black.setSpecular(0.2, 0.2, 0.2, 1);
        this.black.setShininess(10.0);
        this.black.setTextureWrap('REPEAT', 'REPEAT');

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

        //turquese
        this.turquese = new CGFappearance(this.scene);
        this.turquese.setAmbient(0, 1, 1, 1);
        this.turquese.setDiffuse(0, 0, 1, 1);
        this.turquese.setSpecular(0, 0, 1, 1);
        this.turquese.setShininess(10.0);
    }

	updateBoard(boardString){
		this.boardString = boardString;
        this.boardArray = JSON.parse(boardString);
    }

    
    updateValidMoves(movesString){
        this.movesString = movesString;
        this.movesArray = JSON.parse(movesString);
        this.showValid = true;
    }

    oddr_offset_to_pixel(coords){ //1.147
        var x = (2/Math.sqrt(3)) * Math.sqrt(3) * (coords[1] + 0.5 * (coords[0]&1));
        var y = (2/Math.sqrt(3)) * 3/2 * coords[0];
        return [x,y];
    }
    
    display(){
        this.scene.pushMatrix();
        //this.scene.rotate(Math.PI/2, 1,0,0);

        for(var i= 0; i < this.boardArray.length; i++){
            for(var j = 0; j < this.boardArray[i].length; j++){
                
                let pos = this.oddr_offset_to_pixel([i,j]);
                
                this.scene.pushMatrix();
                this.scene.translate(pos[0],0,pos[1]);
                
                // if((i % 2) ==1){
                //     this.scene.pushMatrix();
                //     this.scene.translate(1,0,0);
                // }
                if(this.boardArray[i][j] == 0){
                    this.piece.changeColor(this.white);
                }
                else if(this.boardArray[i][j] == 1){
                    this.scene.pushMatrix();
                    this.piece.changeColor(this.black);
                    this.hex.display();
                    this.scene.popMatrix();
                }
                else if(this.boardArray[i][j] == 3){
                    this.scene.pushMatrix();
                    this.piece.changeColor(this.beje);
                    this.hex.display();
                    this.scene.popMatrix();
                }
                else if(this.boardArray[i][j] == 4){
                    this.scene.pushMatrix();
                    this.piece.changeColor(this.beje);
                    this.scene.scale(0.8,1.3,0.8);
                    this.tower.display();
                    this.scene.popMatrix();
                }
                else if(this.boardArray[i][j] == 2){
                    this.scene.pushMatrix();
                    this.piece.changeColor(this.black);
                    this.scene.scale(0.8,1.5,0.8);
                    this.tower.display();
                    this.scene.popMatrix();
                }

                if(this.showValid){
                    this.movesArray.forEach(move => {
                        if(i == move[0] && j == move[1]){
                            this.piece.changeColor(this.yellow);
                        }
                    });
                }

                //Id for pickable objects must be >= 1
                this.scene.registerForPick((j + 1)+i*20, this.piece);

                this.scene.rotate(-Math.PI/2, 1,0,0);
                this.piece.display();
                this.scene.popMatrix();
                // if((i % 2) ==1){
                //     this.scene.popMatrix();
                //}
            }
            //this.scene.translate(0,1.8,0);
        }
        this.scene.popMatrix();
    }

    updateTexCoords(s, t) {
        this.updateTexCoordsGLBuffers();
    }
};