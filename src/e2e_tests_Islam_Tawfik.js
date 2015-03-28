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

    it("game should have a title", function(){

      expect(browser.getTitle()).toEqual('Hex game');

    });

    it("game should start with an empty board", function(){
       expectBoard(initalBoard);
    });

    it("click on the inital board and expect the board state to change", function(){
       clickDivAndExpectPiece(0,0,'R');
        expectBoard([['R', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', '']])
    });

    it("click the same hex twice and expect board state not to change", function(){
        clickDivAndExpectPiece(0,0,'R');
        expectBoard([['R', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', '']]);

        clickDivAndExpectPiece(0,0,'B');
        expectBoard([['R', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', '']]);
    });


    it("have second player click in a legal spot should display", function(){
        clickDivAndExpectPiece(0,0,'R');
        expectBoard([['R', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', '']]);

        clickDivAndExpectPiece(0,1,'B');
        expectBoard([['R', 'B', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', '']]);
    });

    it("Test a blue player clicking a space", function(){
        setMatchState(matchState2 ,'passAndPlay');
        clickDivAndExpectPiece(4,1,'B');
    });

    it("Test another blocking move", function(){
        setMatchState(matchState4 ,'passAndPlay');
        getDiv(0,0).click();
        expectBoard(board4);
    });

    it("test a blue win", function(){
        setMatchState(matchState6 ,'passAndPlay');
        clickDivAndExpectPiece(3,10,'B');
    });

    it("test red cannot move again after blue win", function(){
        setMatchState(matchState6 ,'passAndPlay');
        clickDivAndExpectPiece(3,10,'B');
        getDiv(0,3).click();
        expectBoard(board6);
    });


    it("test a seires of moves to make sure no bugs in state change", function(){
        clickDivAndExpectPiece(0,0,'R');
        clickDivAndExpectPiece(1,0,'B');
        clickDivAndExpectPiece(0,5,'R');
        clickDivAndExpectPiece(3,3,'B');
        clickDivAndExpectPiece(9,0,'R');
        clickDivAndExpectPiece(7,6,'B');
        clickDivAndExpectPiece(10,1,'R');
        clickDivAndExpectPiece(5,3,'B');
        clickDivAndExpectPiece(8,7,'R');
        clickDivAndExpectPiece(4,4,'B');

    });

    var board1 =[['', 'B', '', '', '', '', '', '', '', 'B', ''], ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', '', '', '', '', '', '', '', '', ''],
        ['R', '', '', '', 'B', '', '', '', '', '', ''], ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', '', '', '', '', '', '', '', '', ''],
        ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', '', '', '', '', 'B', 'B', 'B', 'B', ''], ['', '', '', 'B', '', '', '', '', '', '', ''],
        ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', 'B', '', '', '', '', '', '', '', '']];

    var board2 =[['R', 'B', '', '', '', '', '', '', '', 'B', ''], ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', '', '', '', '', '', '', '', '', ''],
        ['R', '', '', '', 'B', '', '', '', '', '', ''], ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', '', '', '', '', '', '', '', '', ''],
        ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', '', '', '', '', 'B', 'B', 'B', 'B', ''], ['', '', '', 'B', '', '', '', '', '', '', ''],
        ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', 'B', '', '', '', '', '', '', '', '']];

    var delta2 = {row: 7, col: 2};

    var matchState2 = {
        turnIndexBeforeMove: 1,
        turnIndex: 0,
        endMatchScores: null,
        lastMove: [{setTurn: {turnIndex: 0}},
            {set: {key: 'board', value: board1}},
            {set: {key: 'delta', value: {row:0 , column:0}}}],
        lastState: {board: board1, delta: {row:0 , column:0}},
        currentState: {board: board2, delta: delta2},
        lastVisibleTo: {},
        currentVisibleTo: {}
    };

    var board3 =[['', 'B', '', '', '', '', '', '', '', 'B', ''], ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', '', '', '', '', '', '', '', '', ''],
        ['R', '', '', '', 'B', '', '', '', '', '', ''], ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', '', '', '', '', '', '', '', '', ''],
        ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', '', '', '', '', 'B', 'B', 'B', 'B', ''], ['', '', '', 'B', '', '', '', '', '', '', ''],
        ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', 'B', '', '', '', '', '', '', '', '']];

    var board4 =[['R', 'B', '', '', '', '', '', '', '', 'B', ''], ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', '', '', '', '', '', '', '', '', ''],
        ['R', '', '', '', 'B', '', '', '', '', '', ''], ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', '', '', '', '', '', '', '', '', ''],
        ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', '', '', '', '', 'B', 'B', 'B', 'B', ''], ['', '', '', 'B', '', '', '', '', '', '', ''],
        ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', 'B', '', '', '', '', '', '', '', '']];

    var delta4 = {row: 7, col: 2};

    var matchState4 = {
        turnIndexBeforeMove: 1,
        turnIndex: 0,
        endMatchScores: null,
        lastMove: [{setTurn: {turnIndex: 0}},
            {set: {key: 'board', value: board3}},
            {set: {key: 'delta', value: {row:0 , column:0}}}],
        lastState: {board: board3, delta: {row:0 , column:0}},
        currentState: {board: board4, delta: delta4},
        lastVisibleTo: {},
        currentVisibleTo: {}
    };

    var board5 =[['', 'B', 'R', '', '', '', '', '', '', 'B', 'R'], ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', '', '', '', '', '', '', '', '', ''],
        ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', ''], ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', '', '', '', '', '', '', '', '', ''],
        ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', '', '', '', '', 'B', 'B', 'B', 'B', ''], ['', '', '', 'B', '', '', '', '', '', '', ''],
        ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', 'B', '', '', '', '', '', '', '', '']];

    var board6 =[['R', 'B', 'R', '', '', '', '', '', '', 'B', 'R'], ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', '', '', '', '', '', '', '', '', ''],
        ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', ''], ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', '', '', '', '', '', '', '', '', ''],
        ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', '', '', '', '', 'B', 'B', 'B', 'B', ''], ['', '', '', 'B', '', '', '', '', '', '', ''],
        ['R', '', '', '', '', '', '', '', '', '', ''], ['R', '', 'B', '', '', '', '', '', '', '', '']];

    var delta6 = {row: 7, col: 2};

    var matchState6 = {
        turnIndexBeforeMove: 1,
        turnIndex: 0,
        endMatchScores: null,
        lastMove: [{setTurn: {turnIndex: 0}},
            {set: {key: 'board', value: board5}},
            {set: {key: 'delta', value: {row:0 , column:0}}}],
        lastState: {board: board5, delta: {row:0 , column:0}},
        currentState: {board: board6, delta: delta6},
        lastVisibleTo: {},
        currentVisibleTo: {}
    };


    var initalBoard = [['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '', '', '']];


  
});
