let pressedKeys, obstacleCount, projectileCount, time, playInterval;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function areHitting(el1, el2) {
  let rect1 = el1.getBoundingClientRect();
  let rect2 = el2.getBoundingClientRect();
  return !(
      ((rect1.top + rect1.height) < (rect2.top)) ||
      (rect1.top > (rect2.top + rect2.height)) ||
      ((rect1.left + rect1.width) < rect2.left) ||
      (rect1.left > (rect2.left + rect2.width))
  );
}

function createGameBoard() {
  document.querySelector('.container').innerHTML += '<div class="game-board"></div>';
}

function createAirplane() {
  document.getElementsByClassName("game-board")[0].innerHTML +=
    '<img class="airplane" src="airplane-image.png" alt="airplane image missing" style="top: 400px; left: 225px;">';
}

function onKeyDown(event) {
  pressedKeys[event.key] = true;
}

function onKeyUp(event) {
  pressedKeys[event.key] = false;
}

function setupAirplaneMovement() {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  pressedKeys = {};
}

function movePlane() {
  let airplane = document.getElementsByClassName("airplane")[0];
  if (pressedKeys['a'] || pressedKeys["ArrowLeft"]) {
    airplane.style.left = Math.max(10, parseInt(airplane.style.left) - 2) + "px";
  }
  if (pressedKeys['d'] || pressedKeys["ArrowRight"]) {
    airplane.style.left = Math.min(440, parseInt(airplane.style.left) + 2) + "px";
  }
  if (pressedKeys['w'] || pressedKeys["ArrowUp"]) {
    airplane.style.top = Math.max(350, parseInt(airplane.style.top) - 1) + "px";
  }
  if (pressedKeys['s'] || pressedKeys["ArrowDown"]) {
    airplane.style.top = Math.min(440, parseInt(airplane.style.top) + 1) + "px";
  }
}

function increaseScore(points) {
  let scoreElement = document.getElementsByClassName("score")[0];
  scoreElement.innerHTML = parseInt(scoreElement.innerHTML) + points;
}

function updateHighScore() {
  let scoreElement = document.getElementsByClassName("score")[0];
  let highScoreElement = document.getElementsByClassName("high-score")[0];
  highScoreElement.innerHTML = Math.max(
    parseInt(scoreElement.innerHTML),
    parseInt(highScoreElement.innerHTML)
  );
}

function endGame() {
  clearInterval(playInterval);
  updateHighScore();
}

function moveAllObstacles() {
  let airplane = document.getElementsByClassName("airplane")[0];
  for (let i = 1; i <= obstacleCount; ++i) {
    let currentObstacle = document.getElementById("rocket-obstacle-" + i);
    if (currentObstacle != null) {
      currentObstacle.style.top = (parseInt(currentObstacle.style.top) + 2) + "px";
      if (areHitting(currentObstacle, airplane)) {
        endGame();
      }
      if (parseInt(currentObstacle.style.top) >= 500) {
        currentObstacle.remove();
        increaseScore(1);
      }
    }
  }
}

function createObstacle() {
  ++obstacleCount;
  let left = getRandomInt(0, 485);
  document.getElementsByClassName('game-board')[0].innerHTML +=
    '<img class="rocket-obstacle" id="rocket-obstacle-' +
    obstacleCount +
    '" src="rocket-obstacle.png" alt="rocket obstacle image missing" style="top: 0px; left: ' +
    left +
    'px;">';
}

function projectileHitObstacle(projectile) {
  let hitSomething = false;
  for (let i = 1; i <= obstacleCount; ++i) {
    let currentObstacle = document.getElementById("rocket-obstacle-" + i);
    if (currentObstacle != null) {
      if (areHitting(currentObstacle, projectile)) {
        currentObstacle.remove();
        hitSomething = true;
      }
    }
  }
  if (hitSomething) {
    projectile.remove();
    return true;
  }
  return false;
}

function moveProjectiles() {
  for (let i = 1; i <= projectileCount; ++i) {
    let currentProjectile = document.getElementById("projectile-" + i);
    if (currentProjectile != null) {
      currentProjectile.style.top = (parseInt(currentProjectile.style.top) - 2) + "px";
      if (projectileHitObstacle(currentProjectile)) {
        increaseScore(5);
      }
      if (parseInt(currentProjectile.style.top) <= 0) {
        currentProjectile.remove();
      }
    }
  }
}

function createProjectile() {
  if (pressedKeys[' ']) {
    let airplane = document.getElementsByClassName("airplane")[0];
    let airplanePosLeft = parseInt(airplane.style.left);
    let airplanePosTop = parseInt(airplane.style.top);
    let gameBoard = document.getElementsByClassName("game-board")[0];
    ++projectileCount;
    gameBoard.innerHTML +=
      '<img class="projectile" id="projectile-' +
      projectileCount +
      '" src="projectile.png" alt="airplane image missing" style="top: ' +
      airplanePosTop +
      'px; left: ' +
      airplanePosLeft +
      'px;">';
  }
}

function playGame() {
  ++time;
  if (time % 100 == 0) {
    createObstacle();
  }
  if (time % 50 == 0) {
    createProjectile();
  }
  moveAllObstacles();
  moveProjectiles();
  movePlane();
}

function startGame() {
  // Remove old game board if it exists
  if (document.getElementsByClassName("game-board").length) {
    document.getElementsByClassName("game-board")[0].remove();
    document.getElementsByClassName("score fs-4")[0].innerHTML = "0";
  }
  createGameBoard();
  createAirplane();
  setupAirplaneMovement();
  obstacleCount = projectileCount = 0;
  time = 0;
  playInterval = window.setInterval(playGame, 5);
}
