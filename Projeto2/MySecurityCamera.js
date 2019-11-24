/**
 * MySecurityCamera
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MySecurityCamera extends CGFobject
{
    constructor(scene, rtt)
    {
        super(scene);

        this.scene = scene;
        this.rtt = rtt;

        this.rect = new MyRectangle(scene, "security camera",
            0.5,
            1.0,
            -1.0,
            -0.5,
        );
        this.rect.updateTexCoords(0.5,0.5);

        this.scene.screenUI.setUniformsValues({ size: [this.scene.gl.canvas.width/4, this.scene.gl.canvas.height/4]});
    }

    display() {
        this.scene.setActiveShader(this.scene.screenUI);
        this.scene.screenUI.setUniformsValues({t: this.scene.time/100 %1000});
        this.scene.pushMatrix();
        this.rtt.bind();
        this.rect.display();
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
        
    }

            // this.rect = new MyRectangle(scene, "security camera",
            //     0.5,
            //     1.0,
            //     -1.0,
            //     -0.5,
            // );
}