class Game {
  constructor(p1, p2, HEIGHT = 6, WIDTH = 7) {
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.board = [];
    this.players = [p1, p2];
    this.currPlayer = p1;
    this.gameOver = false;
  }

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }
  makeHtmlBoard() {
    let htmlBoard = document.querySelector("#board");
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleClick.bind(this));

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }
    htmlBoard.append(top);

    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }
      htmlBoard.append(row);
    }
  }
  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  endGame(msg) {
    let timer = setInterval(function () {
      alert(msg);
      clearInterval(timer);
    }, 300);
    const top = document.querySelector("#column-top");
    top.removeEventListener("click", this.handleClick);
  }
  handleClick(evt) {
    if (this.gameOver) {
      return;
    }
    const x = +evt.target.id;
    let y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`${this.currPlayer.color.toUpperCase()} Player won!`);
    }
    if (this.board.every((row) => row.every((cell) => cell))) {
      return this.endGame("Tie!");
    }
    this.currPlayer =
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }
  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
  checkForWin() {
    const _win = (cells) => {
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    };

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
    return false;
  }
}
class Player {
  constructor(color) {
    this.color = color;
  }
}

let startBtn = document.querySelector("#startBtn");

startBtn.addEventListener("click", () => {
  let p1 = new Player(document.querySelector("#p1-color").value);
  let p2 = new Player(document.querySelector("#p2-color").value);
  if (
    document.querySelector("#p1-color").value ===
    document.querySelector("#p2-color").value
  ) {
    alert("Players must be different colors.");
    return;
  }

  let htmlBoard = document.querySelector("#board");
  htmlBoard.innerHTML = null;
  const h1 = document.querySelector("h1");
  const p = document.querySelector("p");
  h1.classList.remove("hidden");
  p.classList.remove("hidden");
  startBtn.innerText = "Restart Game";
  let newGame = new Game(p1, p2);
  newGame.makeBoard();
  newGame.makeHtmlBoard();
});
