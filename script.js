const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreDrawEl = document.getElementById('score-draw');
const scoreXBox = document.getElementById('score-x-box');
const scoreOBox = document.getElementById('score-o-box');
const resetBtn = document.getElementById('reset-btn');
const resetScoreBtn = document.getElementById('reset-score-btn');
const modeBtns = document.querySelectorAll('.mode-btn');

let gameState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'ai';
let scores = { X: 0, O: 0, draw: 0 };

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function updateStatus() {
  if (!gameActive) return;
  
  scoreXBox.classList.toggle('turn-active', currentPlayer === 'X');
  scoreOBox.classList.toggle('turn-active', currentPlayer === 'O');
  
  if (gameMode === 'ai') {
    statusDisplay.textContent = currentPlayer === 'X' ? 'Your Turn' : 'Computer Thinking...';
  } else {
    statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function updateScoreboard() {
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDrawEl.textContent = scores.draw;
}

function handleCellClick(e) {
  const index = parseInt(e.target.dataset.index);
  
  if (!gameActive || gameState[index] !== '' || (gameMode === 'ai' && currentPlayer === 'O')) {
    return;
  }

  makeMove(index);
  checkWinner();
}

function makeMove(index) {
  gameState[index] = currentPlayer;
  cells[index].textContent = currentPlayer;
  cells[index].classList.add('taken');
}

function checkWinner() {
  let won = false;
  let winningCells = [];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      won = true;
      winningCells = pattern;
      break;
    }
  }

  if (won) {
    gameActive = false;
    winningCells.forEach(i => cells[i].classList.add('win'));
    
    if (gameMode === 'ai') {
      statusDisplay.textContent = currentPlayer === 'X' ? '🎉 You Win!' : '🤖 Computer Wins!';
    } else {
      statusDisplay.textContent = `🎉 Player ${currentPlayer} Wins!`;
    }
    
    scores[currentPlayer]++;
    updateScoreboard();
    return;
  }

  if (!gameState.includes('')) {
    gameActive = false;
    statusDisplay.textContent = '🤝 Draw!';
    scores.draw++;
    updateScoreboard();
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus();

  if (gameMode === 'ai' && currentPlayer === 'O' && gameActive) {
    setTimeout(aiMove, 600);
  }
}

function aiMove() {
  if (!gameActive) return;

  const available = gameState.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
  
  if (available.length === 0) return;

  const randomIndex = available[Math.floor(Math.random() * available.length)];
  makeMove(randomIndex);
  checkWinner();
}

function resetGame() {
  gameState = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken', 'win');
  });
  
  updateStatus();
}

function resetScores() {
  scores = { X: 0, O: 0, draw: 0 };
  updateScoreboard();
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
resetScoreBtn.addEventListener('click', resetScores);

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    gameMode = btn.dataset.mode;
    resetGame();
  });
});

// Initialize
updateStatus();
updateScoreboard();