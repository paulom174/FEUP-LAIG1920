class LightingScene extends CGFscene{
	constructor(myinterface) {
		super();
		this.interface = myinterface;
		this.texture = null;
		this.appearance = null;
		this.surfaces = [];
		this.translations = [];
		this.response = null;
		this.board = null;
		this.game = [];
		this.validMoves=null;
		this.stateEnum = Object.freeze({"start":1, "init":2, "validMoves":3, "makeMove":4, "checkEndGame":5, "checkHex":6, "gameOver":7, "end":10});
		this.state = this.stateEnum.start;
		this.stateInit = false;
		this.piecePicked = false;	
		this.start = false;
	}

	init(application) {
		super.init(application);
		
		this.initLights();
		this.initCameras();
		this.gl.clearColor(0, 0, 0, 1.0);
		this.gl.clearDepth(10000.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.depthFunc(this.gl.LEQUAL);
		this.axis = new CGFaxis(this);
		this.appearance = new CGFappearance(this);
		this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
		this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
		this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
		this.appearance.setShininess(120);

		this.setUpdatePeriod(1000/60);

		this.piece = new MyPiece(this);
		this.table = new MyTable(this);
		
		this.setPickEnabled(true);

	}

	initLights() {
		this.lights[0].setPosition(1, 1, 1, 1);
		this.lights[0].setAmbient(0.1, 0.1, 0.1, 1);
		this.lights[0].setDiffuse(0.9, 0.9, 0.9, 1);
		this.lights[0].setSpecular(0, 0, 0, 1);
		this.lights[0].enable();
		this.lights[0].update();
		
		this.lights[1].setPosition(3,3,3,1);
		this.lights[1].setAmbient(0.1, 0.1, 0.1, 1);
		this.lights[1].setDiffuse(0.9, 0.9, 0.9, 1);
		this.lights[1].setSpecular(0, 0, 0, 1);
		this.lights[1].enable();
		this.lights[1].update();
	}

	initCameras() {
		//this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(20, 135, 20), vec3.fromValues(20, 0, 10));
		this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(20, 50, 100), vec3.fromValues(20, 0, 10));
		this.view1 = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(20, 75, 100), vec3.fromValues(20, 0, 10));
		this.view2 = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(20, 75, -70), vec3.fromValues(20, 0, 10));

		this.viewSelected = 0;

		this.views = [];
		this.views.push(this.camera);
		this.views.push(this.view1);
		this.views.push(this.view2);

		this.interface.addCameras();
	}

	

	display() {

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
		//this.scale(5,5,5);
		// Update all lights used
		this.lights[0].update();
		// Draw axis
		this.axis.display();
		//this.appearance.apply();
		// draw objects

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

    onChangeCamera() {
        this.camera = this.views[this.viewSelected];

        this.interface.setActiveCamera(this.camera);
    }

	startGame(){
		console.log("start game!");
		this.reset();
		this.state = this.stateEnum.start;
		this.start = true;
		this.stateInit = false;
		this.setupConditions();
	}

	quitGame(){
		this.state = this.stateEnum.gameOver;
		this.start = false;
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

	getCheckHex(data){
		this.response = data.target.response;
		this.parseHex(this.response);
		if(this.game.currentPlayer == 1)
			this.camera = this.view1;
		else
			this.camera = this.view2;

		this.interface.setActiveCamera(this.camera);
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

	move(){
		// choose a valid move...
		if(!this.piecePicked){
			return;
		}
		
		this.game.curMove[0] = Math.floor((this.newPiece-1)/20);
		this.game.curMove[1] =  Math.floor((this.newPiece-1)%20);


		if(!this.stateInit){
			let cur = JSON.stringify(this.game.curMove);
			for(var i=0; i < this.board.movesArray.length; i++){
				let move = JSON.stringify(this.board.movesArray[i]);
				if(cur === move){
					this.makeRequest("do_action("+this.board.boardString+","+this.game.currentPlayer+","+this.board.movesString+","+(i+1)+",0,NewBoard)", this.getMoveRequest);
					this.piecePicked = false;
					//this.stateInit = true;
				}
			}
		}
	}

	stateMachine(state){

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
					console.log("Game ended!");
					this.stateInit = true;
				}
				break;

		}

	}


					
}







