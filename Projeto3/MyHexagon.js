/**
 * MyHexagon
 * @param gl
 * @constructor
 */
class MyHexagon extends CGFobject{
	constructor(scene) {
        super(scene);
        this.ang = Math.PI/3;
        this.slices = 6;
		this.initBuffers();
	}
initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals=[];
    //this.texCoords=[];

    this.vertices.push(0,0,0);
    this.normals.push(0,1,0);

    // for(var i=0; i< this.slices; i++)
    // {
    //     this.vertices.push(i*Math.cos(this.ang),0,Math.sin(this.ang));
    //     this.normals.push(0,1,0);
    // }

    // for(var i=0; i<this.slices; i++)
    // {
    //     this.indices.push(0,i+2,i+1);
    // }

    this.vertices=[
        0,0,0,
        Math.cos(Math.PI/3),0,Math.sin(Math.PI/3),	//2
        Math.cos(2*Math.PI/3),0,Math.sin(2*Math.PI/3),	//4
        Math.cos(Math.PI),0,Math.sin(Math.PI),	//6
        Math.cos(4*Math.PI/3),0,Math.sin(4*Math.PI/3),	//8
        Math.cos(5*Math.PI/3),0,Math.sin(5*Math.PI/3),	//10
        1,0,0
    ];

    this.indices=[
        0,2,1,
        0,3,2,
        0,4,3,
        0,5,4,
        0,6,5,
        0,1,6,
        0,2,1
    ];
    this.normals=[
        0,1,0,
        0,1,0,
        0,1,0,
        0,1,0,
        0,1,0,
        0,1,0,
        0,1,0
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();

}
}