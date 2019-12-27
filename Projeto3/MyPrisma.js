/**
 * MyPrisma
 * @constructor
 * @param scene - Reference to MyScene object
 */
 
 class MyPrisma extends CGFobject {
	 constructor(scene, slices) {
        super(scene);
        this.slices = slices;
		this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals=[];
        this.texCoords=[];


        var ang = 0;
        var alphaAng = 2*Math.PI/this.slices;

        var textcord = 0;
		var division=1/this.slices;


        for(var i = 0; i < this.slices; i++){
            // All vertices have to be declared for a given face
            // even if they are shared with others, as the normals 
            // in each face will be different

            var sa=Math.sin(ang);
            var saa=Math.sin(ang+alphaAng);
            var ca=Math.cos(ang);
            var caa=Math.cos(ang+alphaAng);

            this.vertices.push(ca, 0, -sa);
            this.vertices.push(caa, 0, -saa);
            this.vertices.push(ca, 1, -sa);
            this.vertices.push(caa, 1, -saa);

            this.texCoords.push(textcord,1);
            this.texCoords.push(textcord,0);
            this.texCoords.push(textcord + division,1);
			this.texCoords.push(textcord + division,0);


            this.normals.push(Math.cos(ang+alphaAng/2), 0, -Math.sin(ang+alphaAng/2));
            this.normals.push(Math.cos(ang+alphaAng/2), 0, -Math.sin(ang+alphaAng/2));
            this.normals.push(Math.cos(ang+alphaAng/2), 0, -Math.sin(ang+alphaAng/2));
            this.normals.push(Math.cos(ang+alphaAng/2), 0, -Math.sin(ang+alphaAng/2));
           
            this.indices.push(4*i, (4*i+1) , (4*i+2) );
            this.indices.push((4*i+2), (4*i+1) , (4*i+3) );
            ang+=alphaAng;

        }
        
        
        this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }
 }