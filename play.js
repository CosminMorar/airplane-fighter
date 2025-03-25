let curMovingDir, obstacleCount, time, alive, gameSpeed;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createGameBoard() {
  document.body.innerHTML += '<div class="game-board"></div>';
  gameBoard = document.getElementsByClassName("game-board")[0];
}

function createAirplane() {
  document.getElementsByClassName("game-board")[0].innerHTML += '<img class="airplane" src="airplane-image.png" alt="airplane image missing" style="top: 400px; left: 225px;">';
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
}

function movePlane() {
  let airplane = document.getElementsByClassName("airplane")[0];
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

function createObstacle() {
  ++obstacleCount;
  let left = getRandomInt(0, 485);
  document.getElementsByClassName('game-board')[0].innerHTML += '<img class="rocket-obstacle" id="rocket-obstacle-' + obstacleCount + '" src="rocket-obstacle.png" alt="rocket obstacle image missing" style="top: 0px; left: ' + left + 'px;">';
}

function obstacleHitAirplane(obstacle) {
  let airplane = document.getElementsByClassName("airplane")[0];
  let rect1 = airplane.getBoundingClientRect();
  let rect2 = obstacle.getBoundingClientRect();
  return !(
      ((rect1.top + rect1.height) < (rect2.top)) ||
      (rect1.top > (rect2.top + rect2.height)) ||
      ((rect1.left + rect1.width) < rect2.left) ||
      (rect1.left > (rect2.left + rect2.width))
  );
}

function increaseScore() {
  let scoreElement = document.getElementsByClassName("score")[0];
  scoreElement.innerHTML = parseInt(scoreElement.innerHTML) + 1;
}

function moveAllObstacles() {
  for (let i = 1; i <= obstacleCount; ++i) {
    let currentObstacle = document.getElementById("rocket-obstacle-" + i);
    if (currentObstacle != null) {
      currentObstacle.style.top = (parseInt(currentObstacle.style.top) + 2) + "px";
      if (obstacleHitAirplane(currentObstacle)) {
        alive = false;
      }
      if (parseInt(currentObstacle.style.top) == 500) {
        currentObstacle.remove();
        increaseScore();
      }
    }
  }
}

function playGame() {
  if (!alive) {
    return;
  }
  ++time;
  if (time % 100 == 0) {
    createObstacle();
  }
  moveAllObstacles();
  movePlane();
}

function startGame() {
  if (document.getElementsByClassName("game-board").length) {
    document.getElementsByClassName("game-board")[0].remove();
    clearInterval(gameSpeed);
    document.getElementsByClassName("score")[0].innerHTML = "0";
  }
  createGameBoard();
  createAirplane();
  setupAirplaneMovement();
  obstacleCount = 0;
  time = 0;
  alive = true;
  gameSpeed = window.setInterval(playGame, 5);
}
