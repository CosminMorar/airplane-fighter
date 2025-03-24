let gameBoard, airplane;

function createGameBoard() {
  document.body.innerHTML += '<div class="game-board"></div>';
  gameBoard = document.getElementsByClassName("game-board")[0];
}

function createAirplane() {
  gameBoard.innerHTML += '<img class="airplane" src="airplane-image.png" alt="airplane image missing">';
  airplane = document.getElementsByClassName("airplane")[0];
}

function startGame() {
  createGameBoard();
  createAirplane();
}
