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
        var f = this.gui.addFolder('Actions');
        f.add(this.scene, 'redoPlay').name('redo');
        f.add(this.scene, 'undoPlay').name('undo');


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

    addCameras(){
        // this.gui.add(this.scene, 'viewSelected', this.scene.viewNames).onChange(this.scene.onChangeCamera.bind(this.scene)).name('Views');
        this.gui.add(this.scene, 'viewSelected', this.scene.cameraNamestoIndex).onChange(this.scene.onChangeCamera.bind(this.scene)).name('Views');
    }
}