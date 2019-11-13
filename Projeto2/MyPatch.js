/**
 * MyPatch
 * @constructor
 */
class MyPatch extends CGFobject {
    constructor(scene, id,  npointsU, npointsV, npartsU, npartsV, cPoints){
    super(scene);

    this.npointsU = npointsU;
    this.npointsV = npointsV;
    this.npartsU = npartsU;
    this.npartsV = npartsV;
    this.cPoints = cPoints;
    this.scene = scene;

    //this.makeSurface(this.npointsU,this.npointsV, [[[0,0,0,1], [1,1,1,1]], [[2,2,2,1], [3,3,3,1]]]);
        this.makeSurface(this.npointsU,this.npointsV,this.cPoints);
    //this.initBuffers();
}

makeSurface(degree1, degree2, controlvertexes){
    console.log(controlvertexes);
    this.a = new CGFnurbsSurface(degree1, degree2, controlvertexes);
    this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.a);
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