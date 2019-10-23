/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - Scale of trinagle in X
 * @param y - Scale of triangle in Y
 */
class MyTriangle extends CGFobject {
	constructor(scene, id, x1, x2, x3, y1, y2, y3, z1, z2, z3) {
		super(scene);
		this.x1 = x1;
        this.x2 = x2;
		this.x3 = x3;
        this.y1 = y1;
        this.y2 = y2;
		this.y3 = y3;
		this.z1 = z1;
		this.z2 = z2;
		this.z3 = z3;

		this.initBuffers();
	}
	
	initBuffers() {


		this.a = Math.sqrt(Math.pow((this.x1 - this.x3), 2) + Math.pow((this.y1 - this.y3), 2) + Math.pow((this.z1 - this.z3), 2));
		this.b = Math.sqrt(Math.pow((this.x3 - this.x2), 2) + Math.pow((this.y3 - this.y2), 2) + Math.pow((this.z3 - this.z2), 2));
		this.c = Math.sqrt(Math.pow((this.x2 - this.x1), 2) + Math.pow((this.y2 - this.y1), 2) + Math.pow((this.z2 - this.z1), 2));

		this.cosalpha = ((this.a*this.a - this.b*this.b + this.c*this.c)/(2*this.a*this.c));

		this.sinalpha = Math.sqrt(1 - Math.pow(this.cosalpha,2));


		this.vertices = [
			this.x1, this.y1, this.z1,	//0
			this.x2, this.y2, this.z2,	//1
			this.x3, this.y3, this.z3,	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			0,2,1
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];
		
		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

		this.texCoords = [
			0, 0,
			0, 1,
			1, 0,
			1, 1
		];
		
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the triangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(s,t) {
		this.texCoords = [
			0,0,
			this.a/s, 0,
			this.c * this.cosalpha / s, this.c * this.sinalpha / t
		];
		this.updateTexCoordsGLBuffers();
	}
}