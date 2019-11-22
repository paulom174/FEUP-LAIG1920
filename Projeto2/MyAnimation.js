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

        this.lastKey = this.keyframes[0];
        this.nextKey = this.keyframes[1];
        this.keyON = this.lastkey;

        this.totalTime = this.keyframes[this.keyframes.length-1] - this.keyframes[0];
        this.timePassed = 0;
    }

    switchKey(){

        if(this.counter >= this.keyframes.length){
            this.anime= false;
            return;
        }

        this.lastkey = this.keyframes[++this.counter];
        this.nextKey = this.keyframes[(this.counter+1)];
    }

    startAnimation(){
        this.anime = true;
    }

    update(time){

        if(this.anime == false){
            return;
        }

        this.timePassed +=time;
        if(this.timePassed > this.totalTime){
            this.anime = false;
        }



        this.updateKeyframe(this.timePassed/this.totalTime);

    }

    updateKeyframe(factor){

        this.keyON = this.keyON.calcKeyframe(this.lastKey, this.nextKey, factor);

    }

    apply(){
        this.scene.translate(this.keyON.translate[0], this.keyON.translate[1], this.keyON.translate[2]);
        this.scene.scale(this.keyON.scaling[0], this.keyON.scaling[1], this.keyON.scaling[2]);
        this.scene.rotate(this.keyON.rotation[0], 1,0,0);
        this.scene.rotate(this.keyON.rotation[1], 0,1,0);
        this.scene.rotate(this.keyON.rotation[2], 0,0,1);
    }



}
