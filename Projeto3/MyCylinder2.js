/**
* Cylinder2
* @constructor
*/
 
class MyCylinder2 extends CGFobject
{

    constructor(scene, id, baseRadius, topRadius, height, slices, stacks) {
        super(scene);
        this.baseRadius=baseRadius;
        this.topRadius=topRadius;
        this.height=height;
        this.slices=slices;
        this.stacks=stacks;
        this.initBuffers();
       
    }
 
    initBuffers() {
        var k=Math.sqrt(2) / 2;
        this.controlPoints = [
                              [[0, - this.baseRadius, 0, 1], [0, -this.topRadius, this.height, 1]],
                              [[- this.baseRadius, - this.baseRadius, 0, k], [-this.topRadius, -this.topRadius, this.height, k]],
                              [[- this.baseRadius, 0, 0, 1], [-this.topRadius, 0, this.height, 1]],
                              [[- this.baseRadius,  this.baseRadius, 0, k], [-this.topRadius, this.topRadius, this.height, k]],
                              [[0, this.baseRadius,0,1], [0,this.topRadius,this.height, 1]],
                              [[ this.baseRadius, this.baseRadius,0,k], [this.topRadius,this.topRadius,this.height,k]],
                              [[ this.baseRadius,0,0,1], [this.topRadius,0, this.height,1]],
                              [[ this.baseRadius,- this.baseRadius,0,k], [this.topRadius, -this.topRadius, this.height,k]],
                              [[0, - this.baseRadius, 0, 1], [0, -this.topRadius, this.height, 1]]
                            ];
 
        this.controlPoints.reverse();
       
        var nurbsSurface =  new CGFnurbsSurface(8, 1 , this.controlPoints);
        this.obj = new CGFnurbsObject(this.scene, this.slices, this.stacks, nurbsSurface);
 
        }
 
        display() {
            this.obj.display();
          };
 
}