/**
 * MySemiSphere
 * @constructor
 */
class MySemiSphere extends CGFobject {
    constructor(scene, id, radius, slices,stacks){
    super(scene);

    this.slices = slices;
    this.stacks = 2* stacks;
    this.radius = radius;


    this.initBuffers();
}

initBuffers()
{
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];
    
    var ang = 2 * Math.PI / this.slices;
    var fi = 2* Math.PI/ this.stacks;
    
    for (var j = 0; j <= this.stacks; j++) {
    
        for (let i = 0; i <= this.slices; i++) {
            this.vertices.push(this.radius*Math.cos(ang * i) * Math.cos(fi * j), this.radius*Math.sin(ang * i) * Math.cos(fi * j), this.radius*Math.sin(fi * j));
            this.normals.push(this.radius*Math.cos(ang * i) * Math.cos(fi * j), this.radius*Math.sin(ang * i) * Math.cos(fi * j), this.radius*Math.sin(fi * j));
            this.texCoords.push(i * 1 / this.slices, j * 1 / this.stacks);
        }
    }
    
    
    for (var i = 0; i < this.stacks; i++) {
        for (let j = 0; j < this.slices; j++) {
    
            this.indices.push(i * (this.slices + 1) + j, i * (this.slices + 1) + 1 + j, (i + 1) * (this.slices + 1) + j);
            this.indices.push(i * (this.slices + 1) + 1 + j, (i + 1) * (this.slices + 1) + 1 + j, (i + 1) * (this.slices + 1) + j);
        }
    }
    
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
    }
};