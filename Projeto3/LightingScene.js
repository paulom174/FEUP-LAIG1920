class LightingScene extends CGFscene{
	constructor() {
		super();
		this.texture = null;
		this.appearance = null;
		this.surfaces = [];
		this.translations = [];

		this.response = null;
		this.board = null;
		this.game = [];
		this.validMoves=null;
		this.stateEnum = Object.freeze({"start":1, "validMoves":2, "end":10});
		this.state = this.stateEnum.start;
	}
	init(application) {
		super.init(application);
		this.initCameras();
		this.initLights();
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


		this.piece = new MyPiece(this);

		this.setupConditions();
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
		this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(20, 135, 20), vec3.fromValues(20, 0, 10));
	}

	display() {

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
	
	makeRequest(requestString)
	{			
		// Make Request
		this.getPrologRequest(requestString, this.handleReply.bind(this));

	}

	sendQuit()
	{
		// Make Request
		this.getPrologRequest("quit", this.handleReply);
	}
		

		//Handle the Reply
	handleReply(data){
		this.response = data.target.response;
		//document.querySelector("#query_result").innerHTML=data.target.response;
	}

	parseBoard(boardString){
		// this.updateBoard(boardString);
		// this.board = new MyBoard(this, this.game.boardString);

		if(this.board == null)
			this.board = new MyBoard(this, boardString);
		else
			this.board.updateBoard(this.board);
	}

	parseMoves(movesString){
		this.game.movesString = movesString;
		this.game.movesArray = JSON.parse(movesString);
		this.board.updateValidMoves(this.game.movesArray);
		console.log(this.game.movesArray);
	}


	setupConditions(){
		this.game.maxPieces = 40;
		this.game.numPlayers = 2;
		this.game.currentPlayer = 0;
		this.game.nextPlayer = 1;
		this.game.numPieces = 0;
		this.game.movesString = "";
		this.game.movesArray = null;
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

	drawBoard(){
		if(this.board != null) {
            this.pushMatrix();
            this.board.display();
            this.popMatrix();
        }
        else {
            this.makeRequest("board(Board)");
            if(this.response != null) {
                this.parseBoard(this.response);
            }
		}
	}

	getValidMoves(){
		if(this.board != null){
            this.makeRequest("valid_moves("+this.board.boardString+","+this.game.currentPlayer+",Moves)");
            if(this.response != null) {
                this.parseMoves(this.response);
            }
		}
	}

	stateMachine(state){

		switch (state){
			case this.stateEnum.start:
				this.drawBoard();
				this.state = this.stateEnum.validMoves;
				break;
			
			case this.stateEnum.validMoves:
				this.getValidMoves();
				this.drawBoard();
				break;
			
		}

	}


					
}







