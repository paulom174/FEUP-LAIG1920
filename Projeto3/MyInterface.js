/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)
        this.gui.add(this.scene, 'startGame').name('Start Game');
        this.gui.add(this.scene, 'quitGame').name('End Game');
        //this.gui.add(this.scene, 'bot').name('Bot');
        this.gui.add(this.scene, 'mode', [ 'player vs player', 'player vs bot', 'bot vs bot' ] );
        // var f = this.gui.addFolder('Actions');
        // f.add(this.scene, 'redoPlay').name('redo');
        // f.add(this.scene, 'undoPlay').name('undo');


        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;

        if(event.key === 'm') {
            this.scene.graph.key++;
        }
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    addScenes(){
        if(this.scenes != null){
            this.gui.remove(this.scenes);
        }
        this.scenes = this.gui.add(this.scene, 'curScene', this.scene.graphsName).onChange(this.scene.onChangeScene.bind(this.scene)).name('Scenes');
    }



    addCameras(){
        if(this.views != null){
            this.gui.remove(this.views);
        }

        this.views = this.gui.add(this.scene, 'viewSelected', this.scene.cameraNamestoIndex).onChange(this.scene.onChangeCamera.bind(this.scene)).name('Views');
    }

    addActions(){
        if(!this.scene.isBot){
            this.f = this.gui.addFolder('Actions');
            this.f.add(this.scene, 'redoPlay').name('redo');
            this.f.add(this.scene, 'undoPlay').name('undo');
        }
    }
    addMovie(){
        if(this.scene.gameEnded){
            if(this.movie != null)
                this.gui.remove(this.movie);
                
            this.movie = this.gui.add(this.scene, 'gameMovie').name('Game Movie');
        }
    }
}