let gameBoard, airplane, curMovingDir;

function createGameBoard() {
  document.body.innerHTML += '<div class="game-board"></div>';
  gameBoard = document.getElementsByClassName("game-board")[0];
}

function createAirplane() {
  gameBoard.innerHTML += '<img class="airplane" src="airplane-image.png" alt="airplane image missing">';
  airplane = document.getElementsByClassName("airplane")[0];
  airplane.style.left = "225px";
  airplane.style.top = "400px";
}

function onKeyDown(event) {
  curMovingDir[event.key] = true;
  console.log(event.key);
}

function onKeyUp() {
  curMovingDir[event.key] = false;
}

function setupAirplaneMovement() {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  curMovingDir = {};
  window.setInterval(movePlane, 5);
}

function movePlane() {
  if (curMovingDir['a'] || curMovingDir["ArrowLeft"]) {
    airplane.style.left = Math.max(10, parseInt(airplane.style.left) - 2) + "px";
  }
  if (curMovingDir['d'] || curMovingDir["ArrowRight"]) {
    airplane.style.left = Math.min(440, parseInt(airplane.style.left) + 2) + "px";
  }
  if (curMovingDir['w'] || curMovingDir["ArrowUp"]) {
    airplane.style.top = Math.max(350, parseInt(airplane.style.top) - 1) + "px";
  }
  if (curMovingDir['s'] || curMovingDir["ArrowDown"]) {
    airplane.style.top = Math.min(440, parseInt(airplane.style.top) + 1) + "px";
  }
}

function startGame() {
  if (document.getElementsByClassName("game-board").length) {
    return;
  }
  createGameBoard();
  createAirplane();
  setupAirplaneMovement();
}
