function resetBoard(){
    const grid = document.getElementById("grid");
    for (let i = 0; i < 9; i++) {
        // Create cell 
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.setAttribute("data-index", i);
        cell.textContent = "";
        // Assign onclick handler
        cell.onclick = function() {
            markCell(i);
        };
        grid.appendChild(cell);
    }
};

function newGame() {
    resetBoard();
};
function updateName(name){};
function markCell(cell){};
function processMove(){};
function updateGameStatus(){};
function endGame(winner){};

newGame();