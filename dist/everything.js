'use strict';

angular.module('myApp', []).factory('gameLogic', function() {


  /** Returns the initial Hex board, which is a 3x3 matrix containing ''. */
  function getInitialBoard() {
    return [['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], 
    ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', '']];
  }


  /*
	Checks whether there is a winner for the current board starting from cell rowxcol for the given color
  */
  function checkWinner(board,row,col,color){
  	var visited = [];
  	var sequence = [[row,col]];
  	var queue = [];
  	queue.push([row,col]);
  	var from = [];
  	from[[row,col]]=[[-1,-1]];

  	//Perform search in the queue for finding a path
  	while (queue.length>0) {
  		var current = queue.shift();
  		var cells = getAdjacentCell(board,current[0],current[1]);
  		for (var next in cells) {
  		
  		 	if(cells[next] in from == false)
  			{
  				queue.push(cells[next]);
  				from[cells[next]] = current;
  			}
  		}
  	}
  	
  	return from;
  }

  /*
	Checks for a horizontal win for color blue
  */
  function getHorizontalWin(board,row,col,color) {
   var from = checkWinner(board,row,col,color);
  
   var max = -1;
   var v = Object.keys(from);
   for(var f in v){
   		var x = v[f]
   		var col = x.split(',');
   	
   		if(col[1] == 10) {
   	
   			return true;
   		}
   }
   
   return false;
  }

  /*
	Checks for a vertical win for color red
  */
 function getVerticalWin(board,row,col,color) {
	var from = checkWinner(board,row,col,color)	
	
	var max = -1;
	var v = Object.keys(from);
	for(var f in v){
		var x = v[f]
		var col = x.split(',');
	
		if(col[0] == 10) {
			return true;
		}
	}
	
	return false;
  }

/*
	Checks if there is a winner with the current board configuration
*/
function getWinner (board) {
  		
  		for(var i=0;i<11;i++) {
  			if(board[i][0]=='B'&&getHorizontalWin(board,i,0,'B')) {
  				return 'B';
  			}
  		}

  		for(var j=0;j<11;j++) {
  			if(board[0][j]=='R'){ 
  				if(getVerticalWin(board,0,j,'R')) {
  				return 'R';
  			}}
  		}

  		return '';
  	}
  


/*
	Gets the cells adjacent to a given cell with the same color
	Possible adjacent x for cell y. Here (1,y,6) (2,4) and (3,5) belong to a particular column.

		1 		2
		
	3 		y 		4

		5 		6

*/
function getAdjacentCell(board,row,col){
  	var cells = [];
  	if(limits(row-1) && limits(col) && (board[row-1][col] === board[row][col])) {
  		cells.push([row-1,col]);
  	}	
  	if(limits(row-1) && limits(col+1) && (board[row-1][col+1] === board[row][col])) {
  		cells.push([row-1,col+1]);
  	}
  	if(limits(row) && limits(col-1) && (board[row][col-1] == board[row][col])) {
  		cells.push([row,col-1]);
  	}
  	if(limits(row) && limits(col+1) && (board[row][col+1] == board[row][col])) {
  		cells.push([row,col+1]);
  	}
  	
  	if(limits(row+1) && limits(col-1) && (board[row+1][col-1] == board[row][col])) {
  		cells.push([row+1,col-1]);
  	}
  	if(limits(row+1) && limits(col) && (board[row+1][col] == board[row][col])) {
  		cells.push([row+1,col]);
  	}
  	return cells;
  }


  /*
	Check whether the row or column indexed is valid
  */
  function limits(num){
  	if(num >= 0 && num <11){
  		return true;
  	}
  	return false;
  }


  /**
   * COMMENTED FOR TESTING PURPOSES
   * Returns all the possible moves for the given board and turnIndexBeforeMove.
   * Returns an empty array if the game is over.
   */
  
  function getPossibleMoves(board, turnIndexBeforeMove) {
    var possibleMoves = [];
    var i, j;
    for (i = 0; i < 11; i++) {
      for (j = 0; j < 11; j++) {
        try {
          possibleMoves.push(createMove(board, i, j, turnIndexBeforeMove));
        } catch (e) {
          // The cell in that position was full.
        }
      }
    }
    return possibleMoves;
  }
  

  /*
	Creates a move at rowxcol for turnIndex
  */
  function createMove(board,row,col,turnIndexBeforeMove){
  	if(board === undefined){
  		board = getInitialBoard();
  	}
  	if(board[row][col]!=''){
  		throw new Error('The position is not empty!');
  	}
  	if(getWinner(board)!=''){
  		throw new Error('The game has ended already!');
  	}

  	var boardAfterMove = angular.copy(board);
  	boardAfterMove[row][col] = turnIndexBeforeMove === 0? 'R':'B';

  	var winner = getWinner(boardAfterMove);
  	var firstOperation;

  	//There is no tie in Hex
  	if(winner!=''){
  		firstOperation = {endMatch: {endMatchScores: (winner === 'R' ? [1, 0] : (winner === 'B' ? [0, 1] : [0, 0]))}}
  	} 
  	else {
  		  firstOperation = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
  	}
  	return [firstOperation,
  	{set:{key:'board',value:boardAfterMove}},
  	{set:{key:'delta',value:{row: row,col:col}}}]
  }


  function isMoveOk(params) {
    var move = params.move;
    var turnIndexBeforeMove = params.turnIndexBeforeMove;
    var stateBeforeMove = params.stateBeforeMove;
    
    // We can assume that turnIndexBeforeMove and stateBeforeMove are legal, and we need
    // to verify that move is legal.
    try {
      // Example move:
      // [{setTurn: {turnIndex : 1},
      /*  {set: {key: 'board', value: [['', '', 'R', '', '', '', '', '', '', '', ''], 
      ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], 
    ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', '']
      ]}},
        {set: {key: 'delta', value: {row: 0, col: 2}}}]*/

      var deltaValue = move[2].set.value;
      var row = deltaValue.row;
      var col = deltaValue.col;
      var board = stateBeforeMove.board;
      var expectedMove = createMove(board, row, col, turnIndexBeforeMove);
      if (!angular.equals(move, expectedMove)) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  }



return {
      getInitialBoard: getInitialBoard,
      getPossibleMoves: getPossibleMoves,
      createMove: createMove,
      checkWinner: checkWinner,
      getHorizontalWin: getHorizontalWin,
      getVerticalWin: getVerticalWin,
      getWinner: getWinner,
      isMoveOk: isMoveOk
  };
});;angular.module('myApp')
  .controller('Ctrl',
      ['$scope', '$log', '$timeout',
       'gameService', 'stateService', 'gameLogic', 'resizeGameAreaService',
      function ($scope, $log, $timeout,
        gameService, stateService, gameLogic, resizeGameAreaService) {

    'use strict';

    resizeGameAreaService.setWidthToHeight(1);

    function sendComputerMove() {
      var possMoves = gameLogic.getPossibleMoves($scope.board,$scope.turnIndex);
      //console.log('Possible Moves=',possMoves);
      var randomNo = Math.floor(Math.random()*possMoves.length);
      //console.log('random move=',possMoves[randomNo]);
      gameService.makeMove(possMoves[randomNo]); 
     
      // gameService.makeMove(aiService.createComputerMove($scope.board, $scope.turnIndex,
      //     // at most 1 second for the AI to choose a move (but might be much quicker)
      //     {millisecondsLimit: 1000}));
    }

    function updateUI(params) {

      
      $scope.board = params.stateAfterMove.board;
      $scope.delta = params.stateAfterMove.delta;
      if ($scope.board === undefined) {
        $scope.board = gameLogic.getInitialBoard();
      }
      $scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
      $scope.turnIndex = params.turnIndexAfterMove;

      // Is it the computer's turn?
      if ($scope.isYourTurn &&
          params.playersInfo[params.yourPlayerIndex].playerId === '') {
        console.log('computer turn');
        $scope.isYourTurn = false; // to make sure the UI won't send another move.
        // Waiting 0.5 seconds to let the move animation finish; if we call aiService
        // then the animation is paused until the javascript finishes.
        $timeout(sendComputerMove, 500);
      }
    }
   // window.e2e_test_stateService = stateService; // to allow us to load any state in our e2e tests.

    $scope.cellClicked = function (row, col) {
      $log.info(["Clicked on cell:", row, col]);
      if (window.location.search === '?throwException') { // to test encoding a stack trace with sourcemap
        throw new Error("Throwing the error because URL has '?throwException'");
      }
      if (!$scope.isYourTurn) {
        return;
      }
      try {
        var move = gameLogic.createMove($scope.board, row, col, $scope.turnIndex);
        $scope.isYourTurn = false; // to prevent making another move
        gameService.makeMove(move);
      } catch (e) {
        $log.info(["Cell is already full in position:", row, col]);
        return;
      }
    };
    $scope.shouldShowImage = function (row, col) {
      var cell = $scope.board[row][col];
      return cell !== "";
    };
    $scope.getImageSrc = function (row, col) {
      var cell = $scope.board[row][col];
      return cell === "R" ? "imgs/R.png"
          : cell === "B" ? "imgs/B.png" : "";
    };
    $scope.shouldSlowlyAppear = function (row, col) {
      return $scope.delta !== undefined &&
          $scope.delta.row === row && $scope.delta.col === col;
    };

    gameService.setGame({
      gameDeveloperEmail: "npb245@nyu.edu",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      isMoveOk: gameLogic.isMoveOk,
      updateUI: updateUI
    });
  }]);
