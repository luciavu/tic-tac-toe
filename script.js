document.addEventListener('DOMContentLoaded', () => {
    // IIFE Gameboard module
    const Gameboard = (() => {
        // Private variable
        const board = Array(9).fill(null);

        const reset = () => {
            board.fill(null);
        }

        // Place mark if unmarked and return true, else return false
        const placeMark = (index, mark) => {
            if (!board[index]) {
                board[index] = mark;
                return true;
            }
            return false;
        };

        const getBoard = () => board;
        
        // Return public methods
        return {reset, placeMark, getBoard};
    })();

    // Player module
    const Player = (name, mark) => {
        let winCount = 0;

        const changeName = (newName) => {
            name = newName;
        }
        
        const getName = () => {
            return name;
        }

        const incrementWins = () => {
            winCount++;
        }

        const getWins = () => {
            return winCount;
        }

        return {mark, changeName, getName, incrementWins, getWins};
    }


    // IIFE Game Module
    const Game = (() => {
        let player1, player2;
        let currentPlayer;
        let markIcons = {
            'X': '<i class="icon-cancel-2"></i>', 
            'O': '<i class="icon-circle-empty"></i>'
        }

        const startGame = () => {
            const player1NameInput = document.getElementById("player1-name");
            const player2NameInput = document.getElementById("player2-name");

            player1 = Player(player1NameInput.value || "Player 1", 'X');
            player2 = Player(player2NameInput.value || "Player 2", 'O');
            currentPlayer = player1;

            // Reset gameboard
            Gameboard.reset();
            resetBoard();
            renderBoard();
            updateGameState();

            // Input event listeners
            player1NameInput.addEventListener('input', () => {
                player1.changeName(player1NameInput.value);
                updateGameState();
            });

            player2NameInput.addEventListener('input', () => {
                player2.changeName(player2NameInput.value);
                updateGameState();
            });
        };

        const updateGameState = () => {
            document.getElementById("game-state").textContent = `${currentPlayer.getName()}'s Turn`;
        }

        const resetBoard = () => {
            const grid = document.getElementById("grid");
            grid.innerHTML = "";
    
            for (let i = 0; i < 9; i++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.setAttribute("data-index", i);
                cell.textContent = "";
                cell.addEventListener('click', () => Game.markCell(i));
                grid.appendChild(cell);
            }
        };

        const newGame = () => {
            Gameboard.reset();
            resetBoard();
            currentPlayer = player1;
            
            // Unlock name changing, remove button highlight
            const nameInputs = document.querySelectorAll('input');
            nameInputs.forEach((input) => {
                input.classList.remove('disabled');
            });
            document.getElementById('newGamebtn').classList.remove('highlight');
            document.getElementById('game-state').textContent = `${currentPlayer.getName()}'s Turn`;
        };

        const renderBoard = () => {
            const grid = document.getElementById("grid");
            const board = Gameboard.getBoard();
        
            board.forEach((mark, index) => {
                const cell = grid.children[index];
                cell.innerHTML = markIcons[mark] || "";
            }); 
        };

        const markCell = (index) => {
            if (Gameboard.placeMark(index, currentPlayer.mark)) {
                renderBoard();
                if (checkWin()) {
                    endGame(currentPlayer);
                } else if (checkTie()) {
                    endGame(null);
                } else {
                    currentPlayer = currentPlayer === player1 ? player2 : player1;
                    document.getElementById('game-state').textContent = `${currentPlayer.getName()}'s Turn`;
                }
                
            }
        };

        const checkWin = () => {
            const winningCombinations = [
                [0, 1, 2], [0, 4, 8], [0, 3, 6],
                [1, 4, 7], [2, 5, 8], [2, 4, 6],
                [3, 4, 5], [6, 7, 8]  
            ]
            const board = Gameboard.getBoard();

            // Check for winning combinations of same mark
            for (const combo of winningCombinations) {
                const [a,b,c] = combo;
                // Mark exists in a,b and c
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    // Mark the winning combination
                    for (const cell of combo) {
                        document.querySelector(`[data-index='${cell}']`).classList.add('winningCombo');
                    }
                    // Display winning player
                    document.getElementById("game-state").textContent = `${currentPlayer.getName()} Wins!`;
                    return true;
                }
            }
            return false;
        };

        const checkTie = () => {
            const board = Gameboard.getBoard();
            if (!board.includes(null)) {
                document.getElementById("game-state").textContent = "It's a tie!";
                return true;
            }
            return false;
        };

        const endGame = (player) => {
            if (player) {
                // Update win count
                player.incrementWins(); 
                const stats = player.getName() === player1.getName()
                ? document.querySelector('.player1-stats')
                : document.querySelector('.player2-stats');
                stats.textContent = `Wins: ${player.getWins()}`;
            }

            // Disable gameboard, names, and highlight new game button
            const cells = document.querySelectorAll('.cell')
            cells.forEach((cell) => {
                cell.classList.add('disabled');
            });
            const nameInputs = document.querySelectorAll('input');
            nameInputs.forEach((input) => {
                input.classList.add('disabled');
            });
            document.getElementById('newGamebtn').classList.add('highlight');
        };

        return {startGame, newGame, markCell};
    })();

    // Initialize
    document.getElementById("newGamebtn").addEventListener('click', Game.newGame);
    Game.startGame(); // Set up the board on load
});