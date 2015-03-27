describe('TicTacToe', function() {

  'use strict';

beforeEach(function() {
    browser.get('http://localhost:33945/game.min.html');
  });

  function getDiv(row, col) {
    return element(by.id('e2e_test_div_' + row + 'x' + col));
  }

  function getImg(row, col) {
    return element(by.id('e2e_test_img_' + row + 'x' + col));
  }

  function expectPiece(row, col, pieceKind) {
    // Careful when using animations and asserting isDisplayed:
    // Originally, my animation started from {opacity: 0;}
    // And then the image wasn't displayed.
    // I changed it to start from {opacity: 0.1;}
    expect(getImg(row, col).isDisplayed()).toEqual(pieceKind === "" ? false : true);
    expect(getImg(row, col).getAttribute("src")).toEqual(
      pieceKind === "" ? null : "http://localhost:33945/imgs/" + pieceKind + ".png");
  }

  function expectBoard(board) {
    for (var row = 0; row < 11; row++) {
      for (var col = 0; col < 11; col++) {
        expectPiece(row, col, board[row][col]);
      }
    }
  }

  function clickDivAndExpectPiece(row, col, pieceKind) {
    getDiv(row, col).click();
    expectPiece(row, col, pieceKind);
  }

  // playMode is either: 'passAndPlay', 'playAgainstTheComputer', 'onlyAIs',
  // or a number representing the playerIndex (-2 for viewer, 0 for white player, 1 for black player, etc)
  function setMatchState(matchState, playMode) {
    browser.executeScript(function(matchStateInJson, playMode) {
      var stateService = window.e2e_test_stateService;
      stateService.setMatchState(angular.fromJson(matchStateInJson));
      stateService.setPlayMode(angular.fromJson(playMode));
      angular.element(document).scope().$apply(); // to tell angular that things changes.
    }, JSON.stringify(matchState), JSON.stringify(playMode));
  }
  /*
  it('should have a title', function () {
    expect(browser.getTitle()).toEqual('Hex Game');
  });

  it('should have an empty Hex board', function () {
    expectBoard(
        [['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], 
    ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', '']]);
  });

  it('should show R if I click in 0x0', function () {
    clickDivAndExpectPiece(0, 0, "R");
    expectBoard(
        [['R', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], 
    ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', '']]);
  });

  it('should ignore clicking on a non-empty cell', function () {
    clickDivAndExpectPiece(0, 0, "R");
    clickDivAndExpectPiece(0, 0, "R"); // clicking on a non-empty cell doesn't do anything.
    clickDivAndExpectPiece(1, 1, "B");
    expectBoard(
        [['R', '', '', '', '', '', '', '', '', '', ''], ['', 'B', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], 
    ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', '']]);
  });
  */
  
//fails
   it('should end game if R wins', function () {
    for (var col = 0; col < 11; col++) {
      clickDivAndExpectPiece(1, col, "R");
      // After the game ends, player "O" click (in cell 2x2) will be ignored.
      clickDivAndExpectPiece(2, col, col === 2 ? "" : "R");
    }
    expectBoard(
      [['', '', '', '', '', '', '', '', '', '', ''], ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'], ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], 
    ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', '']]);
  });
  
   var delta1 = {row: 3, col: 3};
  var board1 =
      [['', '', 'R', '', '', '', '', '', 'B', 'R', ''], ['', '', 'R', '', '', '', '', 'B', 'R', '', ''], ['', 'R', '', '', 'B', 'B', '', '', '', '', ''],
    ['', 'R', '', 'B', '', 'B', 'B', 'B', '', '', ''], ['', 'R', 'B', '', '', '', '', 'B', '', '', ''], ['B', 'R', 'R', '', '', '', '', 'B', 'B', 'B', 'B'],
    ['', '', 'R', 'R', '', '', '', '', '', '', ''], ['', '', '', 'R', '', '', '', '', '', '', ''], ['', '', 'R', '', '', '', '', '', '', '', ''], 
    ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', '']];
    
    var delta2 = {row: 9, col: 2};
  var board2=
      [['', '', 'R', '', '', '', '', '', 'B', 'R', ''], ['', '', 'R', '', '', '', '', 'B', 'R', '', ''], ['', 'R', '', '', 'B', 'B', '', '', '', '', ''],
    ['', 'R', '', 'B', '', 'B', 'B', 'B', '', '', ''], ['', 'R', 'B', '', '', '', '', 'B', '', '', ''], ['B', 'R', 'R', '', '', '', '', 'B', 'B', 'B', 'B'],
    ['', '', 'R', 'R', '', '', '', '', '', '', ''], ['', '', '', 'R', '', '', '', '', '', '', ''], ['', '', 'R', '', '', '', '', '', '', '', ''], 
    ['', '', 'R', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', '']];
  var delta2 = {row: 10, col: 2};  
  var board3=
  [['', '', 'R', '', '', '', '', '', 'B', 'R', ''], ['', '', 'R', '', '', '', '', 'B', 'R', '', ''], ['', 'R', '', '', 'B', 'B', '', '', '', '', ''],
    ['', 'R', '', 'B', '', 'B', 'B', 'B', '', '', ''], ['', 'R', 'B', '', '', '', '', 'B', '', '', ''], ['B', 'R', 'R', '', '', '', '', 'B', 'B', 'B', 'B'],
    ['', '', 'R', 'R', '', '', '', '', '', '', ''], ['', '', '', 'R', '', '', '', '', '', '', ''], ['', '', 'R', '', '', '', '', '', '', '', ''], 
    ['', '', 'R', '', '', '', '', '', '', '', ''], ['', '', 'R', '', '', '', '', '', '', '', '']];    
    var matchState2 = {
    turnIndexBeforeMove: 1,
    turnIndex: 0,
    endMatchScores: null,
    lastMove: [{setTurn: {turnIndex: 0}},
          {set: {key: 'board', value: board2}},
          {set: {key: 'delta', value: delta2}}],
    lastState: {board: board1, delta: delta1},
    currentState: {board: board2, delta: delta2},
    lastVisibleTo: {},
    currentVisibleTo: {},
  };
  
    var matchState3 = {
    turnIndexBeforeMove: 0,
    turnIndex: -2,
    endMatchScores: [1, 0],
    lastMove: [{endMatch: {endMatchScores: [1, 0]}},
         {set: {key: 'board', value: board3}},
         {set: {key: 'delta', value: delta3}}],
    lastState: {board: board2, delta: delta2},
    currentState: {board: board3, delta: delta3},
    lastVisibleTo: {},
    currentVisibleTo: {},
  };
  
//fails
  it('can start from a match that is about to end, and win', function () {
    setMatchState(matchState2, 'passAndPlay');
    expectBoard(board2);
    clickDivAndExpectPiece(10, 2, "R"); // winning click!
    clickDivAndExpectPiece(10, 0, "B"); // can't click after game ended
    expectBoard(board3);
  });
  
  //fails
   it('cannot play if it is not your turn', function () {
    // Now make sure that if you're playing "O" (your player index is 1) then
    // you can't do the winning click!
    setMatchState(matchState2, 1); // playMode=1 means that yourPlayerIndex=1.
    expectBoard(board2);
    clickDivAndExpectPiece(10, 2, ""); // can't do the winning click!
    expectBoard(board2);
  });
  
  //fails
   it('can start from a match that ended', function () {
    setMatchState(matchState3, 'passAndPlay');
    expectBoard(board3);
    clickDivAndExpectPiece(2, 1, ""); // can't click after game ended
  });
  
  var deltaD1={row: 0, col: 1}; 
   var deltaD2={row: 10, col: 0}; 
  var deltaDiagWinBoard=  [['B', '', '', '', '', '', '', '', '', '', 'R'], ['', 'B', '', '', '', '', '', '', '', 'R', ''], ['', '', 'B', '', '', '', '', '', 'R', '', ''],
	 	    ['', '', '', 'B', '', '', '', 'R', '', '', ''], ['', '', '', '', 'B', '', 'R', '', '', '', ''], ['', '', '', '', 'B', 'R', '', '', '', '', ''],
		    ['', '', '', '', 'R', '', 'B', '', '', '', ''], ['', '', '', 'R', '', '', '', 'B', '', '', ''], ['', '', 'R', '', '', '', '', '', 'B', '', ''], 
		    ['', 'R', '', '', '', '', '', '', '', 'B', ''], ['', '', '', '', '', '', '', '', '', '', '']];
	
   	 var diagWinBoard= [['B', '', '', '', '', '', '', '', '', '', 'R'], ['', 'B', '', '', '', '', '', '', '', 'R', ''], ['', '', 'B', '', '', '', '', '', 'R', '', ''],
	 	  	 	    ['', '', '', 'B', '', '', '', 'R', '', '', ''], ['', '', '', '', 'B', '', 'R', '', '', '', ''], ['', '', '', '', 'B', 'R', '', '', '', '', ''],
	 			    ['', '', '', '', 'R', '', 'B', '', '', '', ''], ['', '', '', 'R', '', '', '', 'B', '', '', ''], ['', '', 'R', '', '', '', '', '', 'B', '', ''], 
	 			    ['', 'R', '', '', '', '', '', '', '', 'B', ''], ['R', '', '', '', '', '', '', '', '', '', '']];
  var matchStateDiagWin = {
    turnIndexBeforeMove: 1,
    turnIndex: 0,
    endMatchScores: null,
    lastMove: [{setTurn: {turnIndex: 0}},
          {set: {key: 'board', value: diagWinBoard}},
          {set: {key: 'delta', value: deltaD2}}],
    lastState: {board: deltaDiagWinBoard, delta: deltaD1},
    currentState: {board: diagWinBoard, delta: deltaD2},
    lastVisibleTo: {},
    currentVisibleTo: {},
  };	 			
	
	//fails
   it('R can get a DIAGONAL win', function () {
    setMatchState(matchStateDiagWin, 'passAndPlay');
    expectBoard(board3);
    clickDivAndExpectPiece(10, 0, ""); // can't click after game ended
  }); 			
  
  
  
});
