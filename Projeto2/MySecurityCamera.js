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
    }

    display() {
        this.scene.setActiveShader(this.scene.screenUI);
        this.scene.pushMatrix();
        this.rtt.bind();
        this.rect.display();
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}