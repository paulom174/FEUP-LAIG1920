/*
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
 
class MyUnitCubeQuad extends CGFobject {
	constructor(scene) {
        super(scene);
        this.init();
        this.display(); 
    }

    init(){
        this.quad1 = new MyQuad(this.scene);
        this.quad2= new MyQuad(this.scene);
	    this.quad3=new MyQuad(this.scene);
	    this.quad4=new MyQuad(this.scene);
		this.quadtop=new MyQuad(this.scene);
        this.quadbot=new MyQuad(this.scene);
		 
		 
		
    }

    

    
    display() {
        this.scene.pushMatrix();
		this.scene.translate(0.5, 0.5, 0);
		this.scene.rotate(Math.PI, 0, 1, 0);		
        this.quad1.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
		this.scene.translate(0.5, 0.5, 0);
        this.quad2.display();  
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(0.5, 0.5, 1);
        this.quad3.display(); 
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(1, 0.5, 0.5);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.quad4.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(0.5, 1, 0.5);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.quadtop.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0.5);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.quadbot.display();
        this.scene.popMatrix();
        
		
		
    } 

    enableNormalViz(){
      
		//IF YOU WANT, ENABLE FOR EACH QUAD...
	  /*this.diamond.enableNormalViz();
        this.triangle1.enableNormalViz();
        this.parallelogram.enableNormalViz();
        this.trianglesmall1.enableNormalViz();
		this.trianglesmall2.enableNormalViz();
        this.trianglebig1.enableNormalViz();
        this.trianglebig2.enableNormalViz();*/
    }
    
}