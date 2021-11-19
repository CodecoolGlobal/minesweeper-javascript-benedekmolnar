const game = {
    init: function () {
        this.drawBoard();

        // TODO: do the rest of the game setup here (eg. add event listeners)
        this.initRightClick();

        this.initLeftClick();
    },

    drawBoard: function () {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const rows = parseInt(urlParams.get('rows'));
        const cols = parseInt(urlParams.get('cols'));
        const mineCount = parseInt(urlParams.get('mines'));
        const minePlaces = this.getRandomMineIndexes(mineCount, cols, rows);
        let allTheShit = [];

        let gameField = document.querySelector(".game-field");
        this.setGameFieldSize(gameField, rows, cols);
        let cellIndex = 0;
        for (let row = 0; row < rows; row++) {
            const rowElement = this.addRow(gameField);
            for (let col = 0; col < cols; col++) {
                this.addCell(rowElement, row, col, minePlaces.has(cellIndex));
                cellIndex++;
                allTheShit.push(rowElement.lastChild);
            }
        }
        this.numberCell(allTheShit, cols);
    },
    getRandomMineIndexes: function (mineCount, cols, rows) {
        const cellCount = cols * rows;
        let mines = new Set();
        do {
            mines.add(Math.round(Math.random() * (cellCount - 1)));
        } while (mines.size < mineCount && mines.size < cellCount);
        return mines;
    },
    setGameFieldSize: function (gameField, rows, cols) {
        gameField.style.width = (gameField.dataset.cellWidth * rows) + 'px';
        gameField.style.height = (gameField.dataset.cellHeight * cols) + 'px';
    },
    addRow: function (gameField) {
        gameField.insertAdjacentHTML(
            'beforeend',
            '<div class="row"></div>'
        );
        return gameField.lastElementChild;
    },
    addCell: function (rowElement, row, col, isMine) {
        rowElement.insertAdjacentHTML(
            'beforeend',
            `<div class="field${isMine ? ' mine' : ''}"
                        data-row="${row}"
                        data-col="${col}"
                        ></div>`);
    },
    numberCell: function (rowElement, width) {
            for (let i = 0; i < rowElement.length; i++) {
                let total = 0;
                const isLeftEdge = (i % width === 0);
                const isRightEdge = (i % width === width -1);
                if (!rowElement[i].classList.contains("mine")) {
                    if (i > 0 && !isLeftEdge && rowElement[i -1].classList.contains("mine")) total ++;
                    if (i > 9 && !isRightEdge && rowElement[i +1 -width].classList.contains("mine")) total ++;
                    if (i > 10 && rowElement[i -width].classList.contains("mine")) total ++;
                    if (i > 11 && !isLeftEdge && rowElement[i -1 -width].classList.contains("mine")) total ++;
                    if (i < 98 && !isRightEdge && rowElement[i +1].classList.contains("mine")) total ++;
                    if (i < 90 && !isLeftEdge && rowElement[i -1 +width].classList.contains("mine")) total ++;
                    if (i < 88 && !isRightEdge && rowElement[i +1 +width].classList.contains("mine")) total ++;
                    if (i < 89 && rowElement[i +width].classList.contains("mine")) total ++;
                    rowElement[i].setAttribute("data-number", total);
                }
        }
    },
    youWin: function() {

    },

    initRightClick() {
        const fields = document.querySelectorAll('.game-field .row .field');
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const flagField = document.querySelector("#flags-left-counter")
        let flagsLeft = parseInt(urlParams.get('mines'));
        flagField.setAttribute("value", flagsLeft.toString())
        fields.forEach( field => {
            field.addEventListener("contextmenu", event => {
                if (!event.currentTarget.classList.contains("opened") && !event.currentTarget.classList.contains("boom")) {
                    if (event.currentTarget.classList.contains("flagged")) {
                        event.preventDefault();
                        event.currentTarget.classList.toggle("flagged");
                        flagsLeft++;
                        flagField.setAttribute("value", flagsLeft.toString())
                    } else {
                        event.preventDefault();
                        event.currentTarget.classList.toggle("flagged");
                        flagsLeft--;
                        flagField.setAttribute("value", flagsLeft.toString())
                    }
                }
            });
        })
    },

    initLeftClick() {
        const fields = document.querySelectorAll('.game-field .row .field');
        const allMines = document.querySelectorAll(".mine");
        let isEventListenerActive = true;
        fields.forEach( field => {
            field.addEventListener("click", event => {
                if (!isEventListenerActive) return;
                if (!event.currentTarget.classList.contains("flagged")) {
                    event.currentTarget.classList.add("opened");
                    let numberInfo = event.currentTarget.getAttribute("data-number");
                    if (numberInfo !== "0") {
                       event.currentTarget.textContent = numberInfo;
                    }
                }
                if (event.currentTarget.classList.contains("mine") && !event.currentTarget.classList.contains("flagged")) {
                    event.currentTarget.classList.add("boom");
                    allMines.forEach(mineField => {
                        mineField.classList.add("boom");
                    })
                    alert("End of game, you lost!");
                    isEventListenerActive = false;
                }
                if (document.querySelectorAll(".opened").length === (fields.length - allMines.length)) {
                    alert("You won!")
                    isEventListenerActive = false;
                }
            });
        })
    },
};

game.init();
