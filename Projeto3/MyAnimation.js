/**
 * MyKeyFrame
 * @constructor
 */
class MyAnimation extends CGFobject {
    constructor(scene, id, keyframes){

        super(scene);
        this.scene = scene;
        this.id = id;
        this.keyframes = keyframes;
        
        this.counter = 0;
        this.anime = false;
        
        this.timePassed = 0;
        this.onEndCB = null;

        if(keyframes == null)
            return;

        this.lastKey = this.keyframes[0];
        this.nextKey = this.keyframes[1];
        this.keyON = this.lastKey;

        this.frameTime = this.keyframes[1].instant - this.keyframes[0].instant;

    }

    switchKey(){

        if(this.counter == (this.keyframes.length-2)){
            this.anime= false;
            this.keyON = this.keyframes[this.keyframes.length-1];
            if(this.onEndCB != null)
                this.onEndCB();
            return;
        }


        this.lastKey = this.keyframes[++this.counter];
        this.nextKey = this.keyframes[(this.counter+1)];
        this.timePassed =0;
        this.frameTime = this.keyframes[(this.counter + 1)].instant - this.keyframes[this.counter].instant;
    }

    replaceKeyframes(keyframes){
        this.keyframes = keyframes;
        this.timePassed = 0;
        this.anime = false;
        this.lastKey = this.keyframes[0];
        this.nextKey = this.keyframes[1];
        this.keyON = this.lastKey;
        this.frameTime = this.keyframes[1].instant - this.keyframes[0].instant;
        this.counter = 0;
        this.onEndCB = null;
    }

    startAnimation(){
        this.anime = true;
    }

    setEndCallback(func){
        this.onEndCB = func;
    }

    update(time){
        if(this.anime == false){
            return;
        }


        this.timePassed +=time;
        if(this.timePassed > this.frameTime){
            this.switchKey();
            if (this.anime == false) {
                return;
            }
        }
        this.updateKeyframe(this.timePassed/this.frameTime);
    }

    updateKeyframe(factor){

        this.keyON = this.keyON.calcKeyframe(this.lastKey, this.nextKey, factor);
    }

    apply(){

        this.scene.translate(this.keyON.translation[0], this.keyON.translation[1], this.keyON.translation[2]);
        this.scene.scale(this.keyON.scaling[0], this.keyON.scaling[1], this.keyON.scaling[2]);
        this.scene.rotate(this.keyON.rotation[0], 1,0,0);
        this.scene.rotate(this.keyON.rotation[1], 0,1,0);
        this.scene.rotate(this.keyON.rotation[2], 0,0,1);
    }



}
