class Game {
    #grid = document.querySelector(".grid");
    #counter = document.querySelector(".counter span");
    #timer = document.querySelector(".timer span");

    #score;
    #time;

    #interval;

    constructor() {
    }

    start() {
        this.#score = 0;
        this.#time = 60;

        this.#initializeInterval();
        this.#createGrid();
    }

    #initializeInterval() {
        clearInterval(this.#interval)
        this.#interval = setInterval(() => {
            this.#time--;
            if (this.#time < 0) {
                this.#lose();
            }
            this.#updateTimer();
        }, 1000)
    }

    #createGrid() {
        this.#clearGrid();
        this.#updateColors();
        this.#updateCounter();
        this.#updateTimer();

        const aimCell = this.#getRandomCell();
        const size = this.#getGridSize();
        for (let rowIndex = 0; rowIndex < size; rowIndex++) {
            const row = document.createElement("div");
            row.className = "row";
            for (let columnIndex = 0; columnIndex < size; columnIndex++) {
                const column = document.createElement("div");
                column.className = "column";
                {
                    const isAimCell = rowIndex === aimCell.row && columnIndex === aimCell.column;
                    const cell = this.#createCell(isAimCell);
                    column.appendChild(cell);
                }
                row.appendChild(column);
            }
            this.#grid.appendChild(row);
        }
    }

    #clearGrid() {
        this.#grid.innerHTML = "";
    }

    #updateColors() {
        const r = Math.floor(128 * Math.random()) + 64;
        const g = Math.floor(128 * Math.random()) + 64;
        const b = Math.floor(128 * Math.random()) + 64;

        const cssRules = document.styleSheets[0].cssRules;
        for (let i = 0; i < cssRules.length; i++) {
            const cssRule = cssRules[i];
            const selectorText = cssRule.selectorText;
            if (selectorText === ".grid") {
                const r0 = r / 2;
                const g0 = g / 2;
                const b0 = b / 2;
                cssRule.style.backgroundColor = rgb(r0, g0, b0);
            } else if (selectorText === ".cell") {
                cssRule.style.backgroundColor = rgb(r, g, b);
            } else if (selectorText === ".aim") {
                const upperBound = 0.8;
                const factor = 2;
                const a = 2 * upperBound * Math.atan((this.#score + 1) / factor) / Math.PI;
                cssRule.style.backgroundColor = rgba(r, g, b, a);
            }
        }
    }

    #updateCounter() {
        this.#counter.innerHTML = this.#score + "";
    }

    #updateTimer() {
        this.#timer.innerHTML = this.#time + "";
    }

    #getRandomCell() {
        const size = this.#getGridSize();
        return {
            row: Math.floor(Math.random() * size),
            column: Math.floor(Math.random() * size)
        };
    }

    #getGridSize() {
        return this.#score + 2;
    }

    #createCell(isAimCell) {
        const cell = document.createElement("div");
        cell.className = "cell" + (isAimCell ? " aim" : "");
        cell.addEventListener('click', event => {
            if (event.target.classList.contains("aim")) {
                this.#nextRound();
            } else {
                this.#lose();
            }
        });
        return cell;
    }

    #lose() {
        alert("You lose! Your score is " + this.#score + ".");
        this.start()
    }

    #nextRound() {
        this.#score++;
        this.#createGrid();
    }
}

(function () {
    const game = new Game();
    game.start();
})();
