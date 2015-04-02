angular.module('myApp')
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
     var clickToDragPiece = document.getElementById("clickToDragPiece");
     var gameArea = document.getElementById("gameArea");
     
     var rowsNum = 13;
     
     //extra columns for a square shape
     var colsNum = 11;

     window.handleDragEvent = handleDragEvent;
     function handleDragEvent(type, clientX, clientY) {
       // Center point in gameArea
       
       var x = clientX - gameArea.offsetLeft;
       var y = clientY - gameArea.offsetTop;
       console.log('old xy=',x,',',y);

       var left_hex = document.getElementById('e2e_test_div_0x0').offsetLeft;
       var top_hex = document.getElementById('e2e_test_div_0x0').offsetTop;
       console.log('left top = ',left_hex);
       console.log('left top = ',top_hex);
       x = x - left_hex;
       y = y - top_hex;
       console.log('x,y=',x,',',y);
       //Use width and height of border image
       var w = document.getElementById('border').width;
       var h = document.getElementById('border').height;
      
       // Is outside gameArea?
       if (x < 0 || y < 0 || x >= w || y >= h || x < left_hex ) {
         clickToDragPiece.style.display = "none";
         draggingLines.style.display = "none";
         return;
       }
       clickToDragPiece.style.display = "inline";
       draggingLines.style.display = "inline";
       var size = document.getElementById('hexagon').height/2;
        
       // Inside gameArea. Let's find the containing square's row and col
       var col  = Math.floor((colsNum * x) / w);

       var row  = Math.floor((rowsNum * y) / h);
       
       
       var oldcol = col;
       var oldrow = row;
       
       
         row = Math.floor((x * Math.sqrt(3)/3 - y / 3) / size);
       col = Math.floor(y * 2/3 / size);
       console.log('old=',oldrow,',',oldcol);

        var RADIUS = document.getElementById('hexagon').clientWidth/2;
        console.log('RADIUS=',RADIUS);
        var SIDE = 3/2*RADIUS;
         var ci = Math.floor(x/SIDE);
         var HEIGHT = document.getElementById('hexagon').height;

        var cx = x - SIDE*ci;

        var ty = y - (ci % 2) * HEIGHT / 2;
        var cj = Math.floor(ty/HEIGHT);
        var cy = ty - HEIGHT*cj;

        // if (cx > Math.abs(RADIUS / 2 - RADIUS * cy / HEIGHT)) {
        //     col = ci;
        //     row = cj;
        // } else {
        //     //setCellIndex(ci - 1, cj + (ci % 2) - ((cy < HEIGHT / 2) ? 1 : 0));
        //     col = ci-1;
        //     row = cj + (ci % 2) - ((cy < HEIGHT / 2) ? 1 : 0);
        // }


        x = (x - RADIUS) / document.getElementById('hexagon').clientWidth;

        var t1 = y / RADIUS;
        var t2 = Math.floor(x + t1);
        var r = Math.floor((Math.floor(t1 - x) + t2) / 3); 
        var q = Math.floor((Math.floor(2 * x + 1) + t2) / 3) - r;
        row = r;
        col =  q;
         
        var columns = getColumn(row,col);
        

       

       if(col > 12 || col <= 0){
        console.log('wrong col = ',col);
        draggingLines.style.display = "none";
        clickToDragPiece.style.display = "none";
       }
       var centerXY = getSquareCenterXY(row, columns);
       var centerXY4 = getSquareCenterXY(0, columns);
       console.log(centerXY);
       verticalDraggingLine.setAttribute("x1", centerXY.x);
       verticalDraggingLine.setAttribute("y1", centerXY4.y);
       var centerXY1 = getSquareCenterXY(12,col);
       verticalDraggingLine.setAttribute("x2",  centerXY.x);
       verticalDraggingLine.setAttribute("y2",  centerXY1.y);
       var centerXY2 = getSquareCenterXY(row, getColumn(row,0));
       var centerXY3 = getSquareCenterXY(row, getColumn(row,12));
       horizontalDraggingLine.setAttribute("x1", centerXY2.x);
       horizontalDraggingLine.setAttribute("x2", centerXY3.x);
       horizontalDraggingLine.setAttribute("y1", centerXY.y);
       horizontalDraggingLine.setAttribute("y2", centerXY.y);
       if($scope.turnIndex === 1){
        
        horizontalDraggingLine.setAttribute("stroke","blue");
       verticalDraggingLine.setAttribute("stroke","blue");
      }
      else {
        horizontalDraggingLine.setAttribute("stroke","red");
        verticalDraggingLine.setAttribute("stroke","red");
      }
         
       //rotate vertical line
       var rot = "rotate(-34.5 "+Math.floor(centerXY.x)+" "+Math.floor(centerXY.y)+")";
        verticalDraggingLine.setAttribute("transform",rot);
       
       var topLeft = getSquareTopLeft(row, columns);
      clickToDragPiece.style.left = topLeft.left + "px";
      clickToDragPiece.style.top = topLeft.top + "px";

       if(row < 2 && row > 9 ) {
       draggingLines.style.display = "none";
        clickToDragPiece.style.display = "none";             
        return;
    }

       if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
         // drag ended
         clickToDragPiece.style.display = "none";
         draggingLines.style.display = "none";
         dragDone(row-1, col-1);
       }

      
  
     }

     function getColumn(row,col) {
      var columns;

        if((row-1) == 0){
          columns = col+1;
        }
        else if(row-1 == 1) {
          columns = col + 1;
        }
        else if(row-1 == 2 || row-1 == 3){
         columns = col+2;

        }
        else if(row-1 == 4 || row-1 == 5){
          columns = col+3;
        }
        else if(row-1 == 6 || row-1 ==7){
          columns = col+4;
        }
        else if(row-1 ==8 || row-1 == 9)
          columns = col+5;
        else {
          columns = col+6;
        }
        return columns;
     }

     function getSquareWidthHeight() {
        var w = document.getElementById('border').width-5;
        var h = document.getElementById('border').height;
        //Use width of hexagon or calculate square?
        var w1 = document.getElementById('hexagon').width;
        var h1 = document.getElementById('hexagon').height;
       return {

        width: w1,
        //height: h1
        // width : (rowsNum%2==0? (((w-10) / colsNum )- (colsNum * x)/2):w / colsNum),
         height : h / rowsNum
        
       };
     }
     function getSquareTopLeft(row, col) {
       var size = getSquareWidthHeight();
       if(row%2 == 0){
          var left1 = col*size.width + (size.width/2);
       }
       else {
          var left1 = col*size.width;
       }
       return {top: row * size.height, left: left1}
     }
     function getSquareCenterXY(row, col) {
       var size1 = getSquareWidthHeight();
        // var x = size * Math.sqrt(3) * (row - 0.5 * (row&1));
        // var size = document.getElementById('hexagon').height/2;
        //  var y = size * 3/2 * col;
       //  console.log('X Y CONVERTED=',x,',',y);
       if(row%2 == 1){
        var x1 = col * size1.width + size1.width / 2;

       }
       else{
        var x1 = col * size1.width + size1.width;
       }
       return {
        // x:Math.floor(x),
        // y:Math.floor(y)
         x: x1,
         y: row * size1.height + size1.height / 2
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
    // $scope.shouldSlowlyAppear = function (row, col) {
    //   return $scope.delta !== undefined &&
    //       $scope.delta.row === row && $scope.delta.col === col;
    // };

    $scope.getPreviewSrc = function () {
      return  $scope.turnIndex === 1 ? "imgs/B.png" : "imgs/R.png";
    };

      function dragDone(row, col) {
        $rootScope.$apply(function () {
          var msg = "Dragged to " + row + "x" + col;
          $log.info(msg);
          $scope.msg = msg;
          $scope.cellClicked(row, col);
        });
      }
   
       $scope.rowsNum = rowsNum;
    $scope.colsNum = colsNum;

       

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




