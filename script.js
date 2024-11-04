const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let highScore = 0;
let level = 0;
let objectsSliced = 0;
let gameOver = false;
const maxLevels = 6;

// Game controls
document.getElementById('pauseResume').addEventListener('click', togglePause);
document.getElementById('tryAgain').addEventListener('click', restartGame);
document.getElementById('skipLevel').addEventListener('click', skipLevel);
document.getElementById('restart').addEventListener('click', restartGame);

// Define game objects
const objects = [];
const colors = ['#67d7f0', '#a6e02c', '#fa2473', '#fe9522'];
let spawnInterval;

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawObjects();
  updateObjects();

  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

function drawObjects() {
  for (let obj of objects) {
    ctx.fillStyle = obj.color;
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function updateObjects() {
  for (let i = objects.length - 1; i >= 0; i--) {
    objects[i].y -= 2; // Move object up
    if (objects[i].y < 0) {
      objects.splice(i, 1); // Remove off-screen objects
      gameOver = true;
      showGameOver();
    }
  }
}

// Spawn objects
function spawnObject() {
  const size = Math.random() * 30 + 20;
  const x = Math.random() * (canvas.width - size);
  const color = colors[Math.floor(Math.random() * colors.length)];
  objects.push({ x, y: canvas.height + size, size, color });
}

function togglePause() {
  if (gameOver) return;
  if (spawnInterval) {
    clearInterval(spawnInterval);
    spawnInterval = null;
  } else {
    spawnInterval = setInterval(spawnObject, 1000);
  }
}

// Mouse interaction
canvas.addEventListener('mousemove', sliceObject);
canvas.addEventListener('mousedown', (e) => {
  sliceObject(e);
  canvas.addEventListener('mousemove', sliceObject);
});
canvas.addEventListener('mouseup', () => {
  canvas.removeEventListener('mousemove', sliceObject);
});
canvas.addEventListener('touchstart', (e) => {
  sliceObject(e.touches[0]);
  canvas.addEventListener('touchmove', (e) => {
    sliceObject(e.touches[0]);
  });
});
canvas.addEventListener('touchend', () => {
  canvas.removeEventListener('touchmove', sliceObject);
});

// Slice objects
function sliceObject(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  for (let i = objects.length - 1; i >= 0; i--) {
    const obj = objects[i];
    const dist = Math.sqrt((mouseX - obj.x) ** 2 + (mouseY - obj.y) ** 2);
    if (dist < obj.size) {
      objects.splice(i, 1);
      score += 10;
      objectsSliced++;

      if (objectsSliced % 5 === 0) {
        level++;
        if (level < maxLevels) {
          unlockSections();
        } else {
          // If max level reached, game over
          showGameOver();
        }
      }

      updateScore();
      break;
    }
  }
}

function updateScore() {
  document.getElementById('score').innerText = score;
  if (score > highScore) {
    highScore = score;
    document.getElementById('highScore').innerText = highScore;
  }
}

function unlockSections() {
  if (level === 1) {
    document.getElementById('portfolioHeader').classList.remove('hidden');
    document.getElementById('aboutLink').classList.remove('hidden');
  } else if (level === 2) {
    document.getElementById('skillsLink').classList.remove('hidden');
  } else if (level === 3) {
    document.getElementById('experienceLink').classList.remove('hidden');
  } else if (level === 4) {
    document.getElementById('educationLink').classList.remove('hidden');
  } else if (level === 5) {
    document.getElementById('contactLink').classList.remove('hidden');
  }
}

function showGameOver() {
  document.getElementById('finalScore').innerText = score;
  document.getElementById('gameOverMessage').classList.remove('hidden');
}

// Restart game
function restartGame() {
  score = 0;
  level = 0;
  objectsSliced = 0;
  objects.length = 0;
  gameOver = false;
  document.getElementById('gameOverMessage').classList.add('hidden');
  document.getElementById('score').innerText = score;
  document.getElementById('highScore').innerText = highScore;
  document.getElementById('portfolioHeader').classList.add('hidden');
  resetLinks();
  spawnInterval = setInterval(spawnObject, 1000);
  gameLoop();
}

// Skip level
function skipLevel() {
  level++;
  unlockSections();
}

// Reset section links
function resetLinks() {
  document.getElementById('aboutLink').classList.add('hidden');
  document.getElementById('skillsLink').classList.add('hidden');
  document.getElementById('experienceLink').classList.add('hidden');
  document.getElementById('educationLink').classList.add('hidden');
  document.getElementById('contactLink').classList.add('hidden');
}

// Start the game
spawnInterval = setInterval(spawnObject, 1000);
gameLoop();
