/**
 * MyKeyFrame
 * @constructor
 */
class MyKeyFrame extends CGFobject {
    constructor(scene, instant, translation, scaling, rotation){
        super(scene);
        this.scene = scene;
        this.instant = instant;
        this.translation = translation;
        this.scaling = scaling;
        this.rotation = rotation;

    }


    calcKeyframe(keyframe1, keyframe2, factor){
        var ret = new MyKeyFrame(this.scene ,0, [], [], []);

        for(var i=0; i < 3; i++){

            ret.translation[i] = keyframe1.translation[i] + factor * (keyframe2.translation[i] - keyframe1.translation[i]);
            ret.scaling[i] = keyframe1.scaling[i] + factor * (keyframe2.scaling[i] - keyframe1.scaling[i]);
            ret.rotation[i] = keyframe1.rotation[i] + factor * (keyframe2.rotation[i] - keyframe1.rotation[i]);
        }
        return ret;
    }

}


