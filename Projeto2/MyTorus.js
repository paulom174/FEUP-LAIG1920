/**
 * MyTorus
 * @constructor
 */
class MyTorus extends CGFobject {
    constructor(scene, id, slices,loops,outer,inner){
    super(scene);

    this.slices = slices;
    this.loops = loops;
    this.outer = outer;
    this.inner = inner;


    this.initBuffers();
}

initBuffers()
{
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];
    this.auxtexCoords = [];
    
    var ang = 2 * Math.PI / this.slices;
    var fi = 2 * Math.PI / this.loops;
    
    for (var j = 0; j <= this.loops; j++) {
    
        for (let i = 0; i <= this.slices; i++) {
            this.vertices.push((this.outer + this.inner*Math.cos(ang * i)) * Math.cos(fi * j), (this.outer+this.inner*Math.cos(ang * i)) * Math.sin(fi * j), this.inner*Math.sin(ang * i));
            this.normals.push(Math.cos(ang * i) * Math.cos(fi * j), Math.cos(ang * i) * Math.sin(fi * j), Math.sin(ang * i));
            this.auxtexCoords.push(i * 1 / this.slices, j * 1 / this.loops);
        }
    }
    
    
    for (var i = 0; i < this.loops; i++) {
        for (let j = 0; j < this.slices; j++) {

            this.indices.push((i + 1) * (this.slices + 1) + j, i * (this.slices + 1) + 1 + j,i * (this.slices + 1) + j);
            this.indices.push(i * (this.slices + 1) + 1 + j, (i + 1) * (this.slices + 1) + 1 + j, (i + 1) * (this.slices + 1) + j);
            this.indices.push((i + 1) * (this.slices + 1) + j, (i + 1) * (this.slices + 1) + 1 + j,i * (this.slices + 1) + 1 + j);
        }
    }


    
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
    }

    updateTexCoords(s, t) {
        for(var i=0; i < this.auxtexCoords.length; i+=2){
            this.texCoords[i] = this.auxtexCoords[i] / s;
            this.texCoords[i+1] = this.auxtexCoords[i+1] / t;
        }
        this.updateTexCoordsGLBuffers();
    }
};