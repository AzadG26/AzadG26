// Game settings and initial variables
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let level = 1;
let slices = 0;
let gamePaused = false;
let gameOver = false;
const gameSpeed = 1;
const objects = [];
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

document.getElementById("highScore").textContent = highScore;

// Game control elements
const scoreDisplay = document.getElementById("score");
const finalScoreDisplay = document.getElementById("finalScore");
const gameOverMessage = document.getElementById("gameOverMessage");
const portfolioHeader = document.getElementById("portfolioHeader");

// Functions for handling game states
function updateScore(value) {
  score += value;
  scoreDisplay.textContent = score;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    document.getElementById("highScore").textContent = highScore;
  }
}

function levelUp() {
  level++;
  slices = 0;
  unlockPortfolioSection();
}

function unlockPortfolioSection() {
  portfolioHeader.classList.remove("hidden");
  const sections = ["aboutLink", "educationLink", "skillsLink", "experienceLink", "projectsLink", "contactLink"];
  if (level <= sections.length) {
    document.getElementById(sections[level - 1]).classList.remove("hidden");
  }
}

function gameOverScreen() {
  gameOver = true;
  finalScoreDisplay.textContent = score;
  gameOverMessage.classList.remove("hidden");
}

function resetGame() {
  score = 0;
  level = 1;
  slices = 0;
  scoreDisplay.textContent = score;
  gameOverMessage.classList.add("hidden");
  portfolioHeader.classList.add("hidden");
  gameOver = false;
  gamePaused = false;
}

// Object creation and slicing mechanics
function createObject() {
  const x = Math.random() * canvas.width;
  const size = 30 + Math.random() * 20;
  const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  const object = { x, y: canvas.height, size, color, sliced: false };
  objects.push(object);
}

function drawObject(obj) {
  ctx.fillStyle = obj.color;
  ctx.beginPath();
  ctx.arc(obj.x, obj.y, obj.size, 0, Math.PI * 2);
  ctx.fill();
}

function sliceObject(object) {
  object.sliced = true;
  updateScore(10);
  slices++;
  if (slices >= 5) {
    levelUp();
  }
}

function animate() {
  if (gameOver || gamePaused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  objects.forEach((object, index) => {
    if (!object.sliced) {
      object.y -= 2 * gameSpeed;
      drawObject(object);
    } else {
      objects.splice(index, 1);
    }

    if (object.y < 0 && !object.sliced) {
      gameOverScreen();
    }
  });

  requestAnimationFrame(animate);
}

canvas.addEventListener("mousemove", (event) => {
  objects.forEach((object) => {
    const dx = event.clientX - object.x;
    const dy = event.clientY - object.y;
    if (Math.sqrt(dx * dx + dy * dy) < object.size) {
      sliceObject(object);
    }
  });
});

canvas.addEventListener("touchmove", (event) => {
  const touch = event.touches[0];
  objects.forEach((object) => {
    const dx = touch.clientX - object.x;
    const dy = touch.clientY - object.y;
    if (Math.sqrt(dx * dx + dy * dy) < object.size) {
      sliceObject(object);
    }
  });
});

document.getElementById("pauseResume").addEventListener("click", () => {
  gamePaused = !gamePaused;
  if (!gamePaused) animate();
});

document.getElementById("tryAgain").addEventListener("click", resetGame);
document.getElementById("restart").addEventListener("click", () => {
  resetGame();
  animate();
});

document.getElementById("skipLevel").addEventListener("click", () => {
  if (level < 6) levelUp();
});

window.onload = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  animate();
  setInterval(createObject, 1000);
};
