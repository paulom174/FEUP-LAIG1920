/**
 * MyTable
 * @constructor
 */
class MyTable extends CGFobject {
    constructor(scene){
        super(scene);

        this.initBuffers();
        this.init();
        this.quad = new MyUnitCubeQuad(this.scene);
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


    }


    
    display(){
        this.scene.pushMatrix();
        this.scene.translate(0,-0,-1);

        this.scene.pushMatrix();
        this.scene.translate(2,-35,0);
        this.scene.scale(4,30,4);
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(37,-35,0);
        this.scene.scale(4,30,4);
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2,-35,33);
        this.scene.scale(4,30,4);
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(37,-35,33);
        this.scene.scale(4,30,4);
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1,-5,-2);
        this.scene.scale(41,5,41);
        this.quad.display();
        this.scene.popMatrix();

        this.scene.popMatrix();


    }

    updateTexCoords(s, t) {
        this.updateTexCoordsGLBuffers();
    }
};