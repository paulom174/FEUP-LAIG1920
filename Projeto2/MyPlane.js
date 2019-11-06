/**
 * MyPlane
 * @constructor
 */
class MyPlane extends CGFobject {
    constructor(scene, id, npartsU, npartsV){
    super(scene);

    this.npartsU = npartsU;
    this.npartsV = npartsV;
    this.scene = scene;

    this.makeSurface(1,1, [[[0,0,0,1], [0,1,0,1]], [[1,0,0,1], [1,1,0,1]]]);
    //this.initBuffers();
}

makeSurface(degree1, degree2, controlvertexes){
    this.nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);
    this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.nurbsSurface);
}

// initBuffers()
// {
//     this.primitiveType = this.scene.gl.TRIANGLES;
//     this.initGLBuffers();
// }

display(){
    this.obj.display();
}



    updateTexCoords(s, t) {

        this.updateTexCoordsGLBuffers();
    }
};