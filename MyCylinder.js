/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */
 
 class MyCylinder extends CGFobject {
	 constructor(scene, id, baseRadius, topRadius, height, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.height = height;
        this.topRadius = topRadius;
        this.baseRadius = baseRadius;
		this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals=[];
        this.texCoords=[];


        //Variables needed for the FOR loops
        var new_radius = this.baseRadius;
        var delta_rad = (this.topRadius - this.baseRadius) / this.stacks;
        var delta_radius = 2* Math.PI / this.slices;
        var delta_z = this.height / this.stacks;
        var k = this.height / (this.baseRadius - this.topRadius);

        //Calculating the max height
        var h = 0;
        if(this.topRadius < this.baseRadius){
            h = this.topRadius * k + this.height;
        } 
        else{
            h = this.baseRadius * k + this.height;
        }

        //Vertices, normals and textcoords loop
        for(var i = 0; i <= this.stacks; i++){
            for(var j = 0; j <= this.slices; j++){
                //Vertices
                this.vertices.push(new_radius * Math.cos(delta_radius * j), new_radius * Math.sin(delta_radius * j), delta_z*i);

                //Normals
                if(this.baseRadius > this.topRadius){
                    this.normals.push(
                        h * Math.cos(delta_radius*j) / Math.sqrt(Math.pow(this.baseRadius, 2) + Math.pow(h,2)),
                        h * Math.sin(delta_radius*j) / Math.sqrt(Math.pow(this.baseRadius, 2) + Math.pow(h,2)),
                        this.baseRadius / Math.sqrt(Math.pow(this.baseRadius,2) + Math.pow(h,2))
                    );
                } else if (this.baseRadius < this.topRadius){
                    this.normals.push(
                        h * Math.cos(delta_radius * j) / Math.sqrt(Math.pow(this.topRadius, 2) + Math.pow(h, 2)),
                        h * Math.sin(delta_radius * j) / Math.sqrt(Math.pow(this.topRadius, 2) + Math.pow(h, 2)),
                        this.topRadius / Math.sqrt(Math.pow(this.topRadius, 2) + Math.pow(h, 2))
                    ); 
                } else{
                    this.normals.push(Math.cos(delta_radius*j), Math.sin(delta_radius*j), 0);
                }
                //TextCoords
                this.texCoords.push(j / this.slices, i/this.stacks);
            }
            new_radius = this.baseRadius + delta_rad * (i +1);
        }

        for(var i = 0; i < this.stacks; i++){
            for(var j = 0; j < this.slices; j++){
                //Indices
                this.indices.push(i * (this.slices +1) + j,
                    i * (this.slices + 1) + (j + 1), 
                    (i + 1) * (this.slices + 1) + (j + 1)
                );

                this.indices.push((i + 1)*(this.slices +1) + (j +1),
                    (i + 1) * (this.slices +1) + j,
                    i * (this.slices +1) + j
                );
            }
        }

    
        
        this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }
 }
