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
      ['$scope','$rootScope', '$log', '$timeout',
       'gameService', 'stateService', 'gameLogic', 'resizeGameAreaService',
      function ($scope,$rootScope, $log, $timeout,
        gameService, stateService, gameLogic, resizeGameAreaService) {

    'use strict';

    resizeGameAreaService.setWidthToHeight(1);

    $scope.numbersTo=      function numbersTo(start,end) {
        var res = [];
        for (var i=start; i<end; i++) {
          res[i] = i;
        }
      
        return res;
      }
  
    $scope.getStyle = function (row, col) {
          var cell = $scope.board[row][col];
          if (cell === 'R') {
              return {
                  "-webkit-animation": "moveAnimation 2s",
                  "animation": "moveAnimation 2s"};
          }
          if (cell === 'B') {
            return {
                "-webkit-animation": "moveAnimation 2s",
                "animation": "moveAnimation 2s"};
          }
          return {}; // no style
        }
   var draggingLines = document.getElementById("draggingLines");
     var horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
     var verticalDraggingLine = document.getElementById("verticalDraggingLine");
   //  var clickToDragPiece = document.getElementById("clickToDragPiece");
     var gameArea = document.getElementById("gameArea");
     
     var rowsNum = 13;
     var colsNum = 15;
     var colsNum = 16;
     window.handleDragEvent = handleDragEvent;
     function handleDragEvent(type, clientX, clientY) {
       // Center point in gameArea
       
       var x = clientX - gameArea.offsetLeft;
       var y = clientY - gameArea.offsetTop;
       //Use width and height of border image
       var w = document.getElementById('border').width;
       var h = document.getElementById('border').height;
       //document.getElementById('extradiv').style.width = ""
       // x = x - document.getElementById('extradiv').style.width;
       // y = y-document.getElementById('extradiv').style.height;
       // Is outside gameArea?
       if (x < 0 || y < 0 || x >= w || y >= h) {
        // clickToDragPiece.style.display = "none";
         draggingLines.style.display = "none";
         return;
       }
      // clickToDragPiece.style.display = "inline";
       draggingLines.style.display = "inline";
       
       // Inside gameArea. Let's find the containing square's row and col
       var col  = Math.floor((colsNum * x) / w);

       var row  = Math.floor((rowsNum * y) / h);
       var oldcol = col;
       var oldrow = row;
       
       console.log('old=',oldcol)
       
        if((row-1) == 0){
          col = col-1;
        }
        else if(row-1 == 1 || row-1 == 2 ) {
          col = col - 1;
        }
        else if(row-1 == 3){
         col = col-2;

        }
        else if(row-1 == 4 || row-1 == 5){
          col = col-3;
        }
        else if(row-1 == 6 || row-1 ==7 || row-1 ==8){
          col = col-4;
        }
        else
          col = col-5;



       if(col > 11){
        console.log('wrong col = ',col);
       }
       var centerXY = getSquareCenterXY(oldrow, oldcol);
       console.log(centerXY);
       verticalDraggingLine.setAttribute("x1", centerXY.x);
       verticalDraggingLine.setAttribute("x2",  centerXY.x);
       horizontalDraggingLine.setAttribute("y1", centerXY.y);
       horizontalDraggingLine.setAttribute("y2", centerXY.y);
       var topLeft = getSquareTopLeft(row, col);
      // clickToDragPiece.style.left = topLeft.left + "px";
      // clickToDragPiece.style.top = topLeft.top + "px";
       if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
         // drag ended
        // clickToDragPiece.style.display = "none";
         draggingLines.style.display = "none";
         dragDone(row-1, col);
       }
     }
     function getSquareWidthHeight() {
        var w = document.getElementById('border').width-5;
        var h = document.getElementById('border').height-10;
        //Use width of hexagon or calculate square
        var w1 = document.getElementById('hexagon').width;
       return {

         // width: w1,
         width : (rowsNum%2==0? (((w-10) / colsNum )- (colsNum * x)/2):w / colsNum),
         height : (rowsNum%2==0? (((h-50) / rowsNum )- (rowsNum * y)/2):h / rowsNum)
       };
     }
     function getSquareTopLeft(row, col) {
       var size = getSquareWidthHeight();
       return {top: row * size.height+4, left: col * size.width+4}
     }
     function getSquareCenterXY(row, col) {
       var size = getSquareWidthHeight();
       return {
         x: col * size.width + size.width / 2+4,
         y: row * size.height + size.height / 2+4
       };
     }
       function isWhiteSquare(row, col) {
         return ((row+col)%2)==0;
       }
       function getIntegersTill(number) {
         var res = [];
         for (var i = 0; i < number; i++) {
           res.push(i);
         }
         return res;
       }




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

     $scope.isPieceR = function (row, col) {
        return $scope.board[row][col] === 'R';
      };
      $scope.isPieceB = function (row, col) {
        return $scope.board[row][col] === 'B';
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

      function dragDone(row, col) {
        $rootScope.$apply(function () {
          var msg = "Dragged to " + row + "x" + col;
          $log.info(msg);
          $scope.msg = msg;
          $scope.cellClicked(row, col);
        });
      }
   

  var isMouseDown = false;

  function touchHandler(event) {
    var touch = event.changedTouches[0];
    handleEvent(event, event.type, touch.clientX, touch.clientY);
  }

  function mouseDownHandler(event) {
    isMouseDown = true;
    handleEvent(event, "touchstart", event.clientX, event.clientY);
  }

  function mouseMoveHandler(event) {
    if (isMouseDown) {
      handleEvent(event, "touchmove", event.clientX, event.clientY);
    }
  }

  function mouseUpHandler(event) {
    isMouseDown = false;
    handleEvent(event, "touchend", event.clientX, event.clientY);
  }

  function handleEvent(event, type, clientX, clientY) {
    event.preventDefault();
    console.log("handleDragEvent:", type, clientX, clientY);
    handleDragEvent(type, clientX, clientY);
  }

  document.addEventListener("touchstart", touchHandler, true);
  document.addEventListener("touchmove", touchHandler, true);
  document.addEventListener("touchend", touchHandler, true);
  document.addEventListener("touchcancel", touchHandler, true);
  document.addEventListener("touchleave", touchHandler, true);
  document.addEventListener("mousedown", mouseDownHandler, true);
  document.addEventListener("mousemove", mouseMoveHandler, true);
  document.addEventListener("mouseup", mouseUpHandler, true);

    gameService.setGame({
      gameDeveloperEmail: "npb245@nyu.edu",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      isMoveOk: gameLogic.isMoveOk,
      updateUI: updateUI
    });
  }]);





