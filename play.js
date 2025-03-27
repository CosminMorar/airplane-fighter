/// Game board sizing
const GAME_BOARD_WIDTH = 500;
const GAME_BOARD_HEIGHT = 500;

/// Airplane sizing
const AIRPLANE_WIDTH = 50;
const AIRPLANE_HEIGHT = 50;

/// Obstacle sizing
const OBSTACLE_WIDTH = 15;
const OBSTACLE_HEIGHT = 40;

/// Projectile sizing
const PROJECTILE_WIDTH = 8;
const PROJECTILE_HEIGHT = 30;

/// Game speed (lower is faster)
const OBSTACLE_CREATION_TIME = 50;
const PROJECTILE_SHOOTING_TIME = 50;
const GAME_TICK_TIME = 5;

/// Airplane start position
const AIRPLANE_START_LEFT_POS = (GAME_BOARD_WIDTH - AIRPLANE_WIDTH) / 2;
const AIRPLANE_START_TOP_POS = GAME_BOARD_HEIGHT - AIRPLANE_HEIGHT - 50;

/// Airplane movement boundaries
const AIRPLANE_MIN_ALLOWED_LEFT_POS = 0;
const AIRPLANE_MAX_ALLOWED_LEFT_POS = GAME_BOARD_WIDTH - AIRPLANE_WIDTH;
const AIRPLANE_MIN_ALLOWED_TOP_POS = GAME_BOARD_HEIGHT - 3 * AIRPLANE_HEIGHT;
const AIRPLANE_MAX_ALLOWED_TOP_POS = GAME_BOARD_HEIGHT - AIRPLANE_HEIGHT;

/// Points
const POINTS_FOR_DODGED_OBSTACLE = 1;
const POINTS_FOR_DESTROYED_OBSTACLE = 5;

/// Moving speeds
const AIRPLANE_HORIZONTAL_MOVING_SPEED = 2;
const AIRPLANE_VERTICAL_MOVING_SPEED = 1;
const PROJECTILES_VERTICAL_MOVING_SPEED = 2;
const OBSTACLE_VERTICAL_MOVING_SPEED = 2;

let pressedKeys, obstacleCount, projectileCount, time, gameTick;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function intersection(el1, el2) {
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
  document.querySelector('.container').innerHTML +=
    `<div class="game-board" style="
    width: ${GAME_BOARD_WIDTH}px; height: ${GAME_BOARD_HEIGHT}px;"></div>`;
}

function createAirplane() {
  document.getElementsByClassName("game-board")[0].innerHTML +=
    `<img class="airplane" src="airplane-image.png" alt="airplane image missing" style="
    top: ${AIRPLANE_START_TOP_POS}px; left: ${AIRPLANE_START_LEFT_POS}px;
    width: ${AIRPLANE_WIDTH}px; height: ${AIRPLANE_HEIGHT}px;">`;
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
    airplane.style.left = Math.max(
      AIRPLANE_MIN_ALLOWED_LEFT_POS,
      parseInt(airplane.style.left) - AIRPLANE_HORIZONTAL_MOVING_SPEED
    ) + "px";
  }
  if (pressedKeys['d'] || pressedKeys["ArrowRight"]) {
    airplane.style.left = Math.min(
      AIRPLANE_MAX_ALLOWED_LEFT_POS,
      parseInt(airplane.style.left) + AIRPLANE_HORIZONTAL_MOVING_SPEED
    ) + "px";
  }
  if (pressedKeys['w'] || pressedKeys["ArrowUp"]) {
    airplane.style.top = Math.max(
      AIRPLANE_MIN_ALLOWED_TOP_POS,
      parseInt(airplane.style.top) - AIRPLANE_VERTICAL_MOVING_SPEED
    ) + "px";
  }
  if (pressedKeys['s'] || pressedKeys["ArrowDown"]) {
    airplane.style.top = Math.min(
      AIRPLANE_MAX_ALLOWED_TOP_POS,
      parseInt(airplane.style.top) + AIRPLANE_VERTICAL_MOVING_SPEED
    ) + "px";
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
  clearInterval(gameTick);
  updateHighScore();
}

function moveAllObstacles() {
  let gameBoard = document.getElementsByClassName("game-board")[0];
  let airplane = document.getElementsByClassName("airplane")[0];
  for (let i = 1; i <= obstacleCount; ++i) {
    let currentObstacle = document.getElementById("rocket-obstacle-" + i);
    if (currentObstacle != null) {
      currentObstacle.style.top = (parseInt(currentObstacle.style.top) + OBSTACLE_VERTICAL_MOVING_SPEED) + "px";
      if (intersection(currentObstacle, airplane)) {
        endGame();
      }
      if (parseInt(currentObstacle.style.top) >= GAME_BOARD_HEIGHT - OBSTACLE_HEIGHT) {
        currentObstacle.remove();
        increaseScore(POINTS_FOR_DODGED_OBSTACLE);
      }
    }
  }
}

function createObstacle() {
  let gameBoard = document.getElementsByClassName('game-board')[0];
  ++obstacleCount;
  let left = getRandomInt(0, (parseInt(gameBoard.style.width) - OBSTACLE_WIDTH));
  gameBoard.innerHTML +=
    `<img class="rocket-obstacle" id="rocket-obstacle-${obstacleCount}"
    src="rocket-obstacle.png" alt="rocket obstacle image missing" style="
    top: ${0}px; left: ${left}px;
    height: ${OBSTACLE_HEIGHT}px; width: ${OBSTACLE_WIDTH}px;">`;
}

function projectileHitObstacle(projectile) {
  let hitSomething = false;
  for (let i = 1; i <= obstacleCount; ++i) {
    let currentObstacle = document.getElementById("rocket-obstacle-" + i);
    if (currentObstacle != null) {
      if (intersection(currentObstacle, projectile)) {
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
      currentProjectile.style.top = (parseInt(currentProjectile.style.top) - PROJECTILES_VERTICAL_MOVING_SPEED) + "px";
      if (projectileHitObstacle(currentProjectile)) {
        increaseScore(POINTS_FOR_DESTROYED_OBSTACLE);
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
      `<img class="projectile" id="projectile-${projectileCount}"
      src="projectile.png" alt="airplane image missing" style="
      top: ${airplanePosTop}px; left: ${airplanePosLeft}px;
      width: ${PROJECTILE_WIDTH}px; height: ${PROJECTILE_HEIGHT}px;">`;
  }
}

function playGame() {
  ++time;
  if (time % OBSTACLE_CREATION_TIME == 0) {
    createObstacle();
  }
  if (time % PROJECTILE_SHOOTING_TIME == 0) {
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
  obstacleCount = projectileCount = time = 0;
  gameTick = window.setInterval(playGame, GAME_TICK_TIME);
}
