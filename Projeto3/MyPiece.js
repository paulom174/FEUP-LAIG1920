/**
 * MyPiece
 * @constructor
 */
class MyPiece extends CGFobject {
    constructor(scene){
        super(scene);
        this.scene = scene;
        this.prisma = new MyPrisma(this.scene, 6);
        this.base = new MyHexagon(this.scene);
        this.color;
    }
    
    initBuffers()
    {
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    changeColor(color){
        color.apply();
    }

    display(){

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 1,0,0);
        this.scene.rotate(Math.PI/2, 0,1,0);

        //body
        this.scene.pushMatrix();
        this.scene.scale(1,0.3,1);
        this.scene.translate(0,-1,0);
        this.prisma.display();
        this.scene.popMatrix();

        //top
        this.scene.pushMatrix();
        this.base.display();
        this.scene.popMatrix();

        //bottom
        this.scene.pushMatrix();
        this.scene.translate(0,-0.3,0);
        this.scene.rotate(Math.PI, 1,0,0);
        this.base.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }

    updateTexCoords(s, t) {

        this.updateTexCoordsGLBuffers();
    }
    
};