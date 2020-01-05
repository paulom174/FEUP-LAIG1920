class LightingScene extends CGFscene{
	constructor(myinterface) {
		super();
		this.interface = myinterface;
		this.response = null;
		this.board = null;
		this.validMoves=null;
		this.stateInit = false;
		this.piecePicked = false;	
		this.start = false;
		this.gameEnded = false;
		this.bot = false;
		this.mode = null;
		this.botReady = false;
		this.won = false;
		this.alreadyPlayed = false;
		this.total =0;
		this.initTime =0;
		this.timePerPlay =0;
		this.initTimePlay =0;

	}

	init(application) {
		super.init(application);
		this.graphs = new Map();
		this.graphsName = [];
		this.curScene = "demo";

		this.game = [];
		this.stateEnum = Object.freeze({"start":1, "init":2, "validMoves":3, "makeMove":4, "checkEndGame":5, "checkHex":6, "gameOver":7, "gameMovie":8, "end":10});
		this.state = this.stateEnum.start;
		
		this.piece = new MyPiece(this);
		this.table = new MyTable(this);
		
		this.setPickEnabled(true);

		this.scenesOnHold = 0;

		this.loadScene("demo.xml", "demo");
		this.loadScene("exp.xml", "exp");
	}

	loadScene(filename, name){
		this.scenesOnHold++;
		let scene = new MySceneGraph(filename, this);
		this.graphs.set(name, scene);
		this.graphsName.push(name);
	}

	onChangeScene(){
		this.sceneInited = false;

		this.graph = this.graphs.get(this.curScene);
		this.load();

		this.sceneInited = true;
	}

	load(){

		this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
		this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);
		
		this.initCameras();
		this.initLights();
	}

	onGraphLoaded() {

		this.scenesOnHold--;

		if(this.scenesOnHold > 0)
			return;

		this.interface.addScenes();
		this.onChangeScene();


		this.enableTextures(true);
		
        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
		this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
		
		
		this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);
		
		this.axis = new CGFaxis(this, this.graph.referenceLength);
		
		this.setUpdatePeriod(100);
		this.lastUpdate = Date.now();
		
        this.initCameras();
		this.initLights();
		this.initMaterials();

        this.sceneInited = true;
	}
	
	update(time){
		
		this.time = time;
		var dif = (this.time - this.lastUpdate)/1000;

		
        if(!this.sceneInited)
			return;
		if(this.start){
			this.timePerPlay += (dif);
			this.total += (dif);
		}	
        //this.graph.updateAnimation(dif/1000);
    }

    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                this.lights[i].setConstantAttenuation(light[6]);
                this.lights[i].setLinearAttenuation(light[7]);
                this.lights[i].setQuadraticAttenuation(light[8]);



                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[9]);
                    this.lights[i].setSpotExponent(light[10]);
                    this.lights[i].setSpotDirection(light[11][0], light[11][1], light[11][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

	initCameras() {
        this.viewSelected =0;
        this.cameraNamestoIndex = {};

        for(var i=0; i < this.graph.views.length; i++){
            this.cameraNamestoIndex[this.graph.views[i][0]] = i;
        }

        this.interface.addCameras();

        this.onChangeCamera();
    }


	initMaterials(){
		this.appearance = new CGFappearance(this);
		this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
		this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
		this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
		this.appearance.setShininess(120);
	}

	updateHTML(){
		if (this.start) {
			if (this.game.currentPlayer == 1) {
			  document.getElementById("player").innerText = "Player: White\n";
			} else if (this.game.currentPlayer == 0) {
				document.getElementById("player").innerText = "Player: Black\n";
			}
			document.getElementById("timePerPlay").innerText = "Time to play:  " + ((this.alreadyPlayed ? (30 -this.timePerPlay) : (30 -(this.total%30))).toFixed(2));
			document.getElementById("timeTotal").innerText = "\n\nTotal Time: " + (this.total.toFixed(2)) + "\n\n";
		}
		if(this.gameEnded){
			if(this.won)
				document.getElementById("gameover").innerText = "GAME OVER!!\n\n"+((this.game.currentPlayer == 1) ? "Black":"White")+" won the game!";
			else{
				document.getElementById("gameover").innerText = "Game ended by request!\n\n";
			}
		}
	}

	display() {

		if(!this.sceneInited)
			return;

		this.logPicking();
		// Clear image and depth buffer every time we update the scene
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.gl.enable(this.gl.DEPTH_TEST);
		// Initialize Model-View matrix as identity (no transformation
		this.updateProjectionMatrix();
		this.loadIdentity();
		// Apply transformations corresponding to the camera position relative to the origin
		this.applyViewMatrix();
		// Update all lights used
		this.lights[0].update();
		// Draw axis
		this.axis.display();
		//this.appearance.apply();
		// draw objects

		//this.graph.displayScene();
		this.updateHTML();


		this.stateMachine(this.state);
		this.table.display();
		this.drawBoard();

		
		this.clearPickRegistration();
		
	}
	getPrologRequest(requestString, onSuccess, onError, port)
	{
		var requestPort = port || 8081
		var request = new XMLHttpRequest();
		request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

		request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
		request.onerror = onError || function(){console.log("Error waiting for response");};

		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send();
	}
	
	makeRequest(requestString, onSuccess)
	{			
		// Make Request
		this.getPrologRequest(requestString, onSuccess.bind(this));
	}

	sendQuit()
	{
		// Make Request
		this.getPrologRequest("quit", this.handleReply);
	}

	logPicking() {
		if (this.pickMode == false) {
			if (this.pickResults != null && this.pickResults.length > 0) {
				for (var i = 0; i < this.pickResults.length; i++) {
					var obj = this.pickResults[i][0];
					if (obj) {
						this.piecePicked = true;
						this.newPiece = this.pickResults[i][1];
						console.log("Picked object: " + obj + ", with pick id " + this.newPiece);						
					}
				}
				this.pickResults.splice(0, this.pickResults.length);
			}
		}
	}

	randomNumberBetweenInterval(min, max) {  
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
	}
	
    onChangeCamera() {
        this.camera = this.graph.views[this.viewSelected][1];

        this.interface.setActiveCamera(this.camera);
	}
	
	setMode(){
		this.modeID = 0;

		if(this.mode == "player vs player"){
			this.isBot = false;
			this.modeID = 0;
		}
		else if(this.mode == "player vs bot"){
			this.isBot = true;
			this.modeID = 1;
		}
		else if(this.mode == "bot vs bot"){
			this.isBot = true;
			this.modeID = 2;
		}
	}

	startGame(){
		console.log("start game!");
		this.reset();
		this.setMode();
		this.interface.addActions();
		this.state = this.stateEnum.start;
		this.start = true;
		this.initTime = this.time;
		this.stateInit = false;
		this.setupConditions();
	}

	quitGame(){
		this.state = this.stateEnum.gameOver;
		this.start = false;
	}

	gameMovie(){
		this.board.showValid = false;
		(async function loop(board) {
			for (let i = 0; i < board.allBoards.length; i++) {
				await new Promise(resolve => setTimeout(resolve, 1000));
				board.updateBoard(board.allBoards[i]);
			}
		})(this.board);
	}

	reset(){
		this.board = null;
		this.start = false;
	}

	undoPlay(){
		if(this.board.allBoards.length < 2)
			return;

		this.board.saveBoards.push(this.board.allBoards.pop());
		this.board.updateBoard(this.board.allBoards[this.board.allBoards.length -1]);
		this.changePlayers();
		this.state = this.stateEnum.validMoves;
	}

	redoPlay(){
		if(this.board.saveBoards.length < 1)
			return;

		var string = this.board.saveBoards.pop();
		this.board.allBoards.push(string);
		this.board.updateBoard(string);
		this.changePlayers();
		this.state = this.stateEnum.validMoves;
	}
		
	//Handle the Reply
	getBoardRequest(data){
		this.response = data.target.response;
		this.parseBoard(this.response);
		//document.querySelector("#query_result").innerHTML=data.target.response;
	}

	getValidMovesRequest(data){
		this.response = data.target.response;
		this.parseMoves(this.response);
	}

	getCheckEndGame(data){
		this.response = data.target.response;
		this.parseEndGame(this.response);
	}

	changeCamera(){
		if(this.game.currentPlayer == 1)
			this.camera = this.graph.views[1][1];
		else
			this.camera = this.graph.views[2][1];

		this.interface.setActiveCamera(this.camera);
	}

	getCheckHex(data){
		this.response = data.target.response;
		this.parseHex(this.response);
		this.changeCamera();
	}

	getMoveRequest(data){
		this.response = data.target.response;
		this.board.allBoards.push(this.response);
		this.board.updateBoard(this.response);
		this.changePlayers();
		this.board.showValid = false;
		this.state = this.stateEnum.checkEndGame;
		this.stateInit = false;
	}

	parseBoard(boardString){
		if(this.board == null){
			this.board = new MyBoard(this, boardString);
			this.board.allBoards.push(boardString);
		}

		else
			this.board.updateBoard(this.board);

		this.state = this.stateEnum.validMoves;
		this.stateInit = false;
	}

	parseMoves(movesString){
		this.board.updateValidMoves(movesString);
		this.botReady = false;
		this.state = this.stateEnum.makeMove;
		this.stateInit = false;
	}

	parseHex(boardString){
		this.board.updateBoard(boardString);
		this.state = this.stateEnum.validMoves;
		this.stateInit = false;
	}

	parseEndGame(result){
		if(result == "1"){
			this.won = true;
			this.state = this.stateEnum.gameOver;
		}
		else{
			this.state = this.stateEnum.checkHex;
		}
		this.stateInit = false;
	}

	setupConditions(){
		this.game.maxPieces = 40;
		this.game.numPlayers = 2;
		this.game.currentPlayer = 1;
		this.game.nextPlayer = 0;
		this.game.numPieces = 0;
		this.game.curMove = [];
		this.game.gameOver = false;
	}

	checkConditions(){
		if(this.game.numPieces >= this.game.maxPieces)
			return -1;
		if(this.numPlayers > 2)
			return -1;
		if(this.game.currentPlayer > 1 || this.game.nextPlayer > 1)
			return -1;

		return 0;
	}

	changePlayers(){
		if(this.game.currentPlayer == 0){
			this.game.currentPlayer = 1;
			this.game.nextPlayer = 0;
		}
		else{
			this.game.currentPlayer = 0;
			this.game.nextPlayer = 1;
		}
	}

	drawBoard(){
		if(this.board != null) {
            this.pushMatrix();
            this.board.display();
            this.popMatrix();
        }
	}

	getValidMoves(){
		if(this.board != null){
			// if(this.board.movesArray == null){
				this.makeRequest("valid_moves("+this.board.boardString+","+this.game.currentPlayer+",Moves)");
				if(this.response != null) {
					this.parseMoves(this.response);
				}
			// }
		}
	}

	timeout(){
		this.changePlayers();
		this.changeCamera();
		this.state = this.stateEnum.validMoves;
	}

	move(){

		if(this.isBot && this.botReady)
			return;

		if(this.timePerPlay >= 30){
			this.timeout();
		}
		this.alreadyPlayed = true;

		if(!this.piecePicked && !this.isBot){
			return;
		}

		switch(this.modeID){
			case 0:
				this.game.curMove[0] = Math.floor((this.newPiece-1)/20);
				this.game.curMove[1] =  Math.floor((this.newPiece-1)%20);
				break;

			case 1:
				if(this.game.currentPlayer == 1){
					this.game.curMove[0] = Math.floor((this.newPiece-1)/20);
					this.game.curMove[1] =  Math.floor((this.newPiece-1)%20);
				}
				else{
					var n = this.randomNumberBetweenInterval(0, (this.board.movesArray.length-1));
					this.game.curMove[0] = this.board.movesArray[n][0];
					this.game.curMove[1] = this.board.movesArray[n][1];	
				}
				break;

			case 2:
				var n = this.randomNumberBetweenInterval(0, (this.board.movesArray.length-1));
				this.game.curMove[0] = this.board.movesArray[n][0];
				this.game.curMove[1] = this.board.movesArray[n][1];	
				break;

			default:
				break;
		}
		
		if(!this.stateInit){
			let cur = JSON.stringify(this.game.curMove);
			for(var i=0; i < this.board.movesArray.length; i++){
				let move = JSON.stringify(this.board.movesArray[i]);
				if(cur === move){
					this.makeRequest("do_action("+this.board.boardString+","+this.game.currentPlayer+","+this.board.movesString+","+(i+1)+",0,NewBoard)", this.getMoveRequest);
					this.piecePicked = false;
					this.botReady = true;
					//this.stateInit = true;
				}
			}
		}
	}

	stateMachine(state){

		if(state != this.stateEnum.start && this.start == false){
			state = this.stateEnum.gameOver;
		}

		switch (state){
			case this.stateEnum.start:
					if(this.start)
						this.state = this.stateEnum.init;

				break;

			case this.stateEnum.init:
				if(!this.stateInit){
					this.makeRequest("board(Board)", this.getBoardRequest);
					this.stateInit = true;
				}
				break;
			
			case this.stateEnum.validMoves:
				if(!this.stateInit){
					this.timePerPlay = 0;
					this.makeRequest("valid_moves("+this.board.boardString+","+this.game.currentPlayer+",Moves)", this.getValidMovesRequest);
					this.stateInit = true;
				}
				break;

			case this.stateEnum.makeMove:
				this.move();
				break;
				
			case this.stateEnum.checkEndGame:
				if(!this.stateInit){
					this.makeRequest("check_endgame("+this.board.boardString+","+"["+this.game.curMove[0]+","+this.game.curMove[1]+"],"+this.game.nextPlayer+",State)", this.getCheckEndGame);
					this.stateInit = true;
				}
				break;

			case this.stateEnum.checkHex:
				if(!this.stateInit){
					this.makeRequest("check_hex("+this.board.boardString+","+this.game.curMove[1]+","+this.game.curMove[0]+","+this.game.nextPlayer+",Newboard)", this.getCheckHex);
					this.stateInit = true;
				}
				break;

			case this.stateEnum.gameOver:
				if(!this.stateInit){
					this.gameEnded = true;
					this.stateInit = true;
					this.interface.addMovie();
					console.log("aqui");
				}
				break;
		}
	}				
}







