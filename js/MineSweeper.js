import { randomInteger } from './utils';

class Cell {
    constructor(y, x, id) {
        this.coords = { y, x };
        this.id = id;

        this.number = 0;
        this.isOpen = false;
        this.isFlag = false;
        this.isMine = false;

        this.HtmlElement = this.toHtml();
        this.HtmlElement.classList.add('hidden');
    }

    open() {
        this.isOpen = true;
        this.HtmlElement.classList.remove('hidden');
        if (this.number > 0) {
            this.HtmlElement.textContent = this.number;
        }
    }

    toggleFlag() {
        this.isFlag = !this.isFlag;
        this.HtmlElement.classList.toggle('flag');
    }

    placeMine() {
        this.isMine = true;
    }

    toHtml() {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.id = this.id;
        cellElement.oncontextmenu = () => false;

        return cellElement;
    }

    updateHtmlElement() {
        this.HtmlElement = this.toHtml();
        if (this.isFlag) {
            this.HtmlElement.classList.add('flag');
        }
        if (!this.open) {
            this.HtmlElement.classList.add('hidden');
        }
    }

    incrementNumber() {
        this.number += 1;
    }

    getCoords() {
        return this.coords;
    }
}

export default class MineSweeper {
    constructor(container, { rowsCount = 10, columnsCount = 10, bombsCount = 10 }) {
        this._container = container;
        this._rowsCount = rowsCount;
        this._columnsCount = columnsCount;
        this._bombsCount = bombsCount;

        this.bombsLeftCounterElement = document.createElement('div');
        this.bombsLeftCounterElement.textContent = bombsCount;
        this.bombsLeftCounter = bombsCount;

        this._matrix = this.createMatrix();
        this._init();
    }

    _init() {
        let firstClick = false;
        let fieldElement = this._placeHtml(false);

        const firstClickFunc = (event) => {
            let cell;
            this.forAllCells((item) => {
                if (item.id === Number(event.target.dataset.id)) {
                    cell = item;
                }
            });

            if (!firstClick) {
                this.mineMatrix(cell);
            }
            this.openChunck(cell);

            firstClick = true;

            let fieldElement = this._placeHtml();
            fieldElement.addEventListener('click', firstClickFunc);
        };

        fieldElement.addEventListener('click', firstClickFunc, { once: true });
    }

    _placeHtml(events = true) {
        const fieldElement = document.createElement('div');
        fieldElement.classList.add('field');

        for (let y = 0; y < this._rowsCount; y++) {
            const rowElement = document.createElement('div');
            rowElement.classList.add('row');

            for (let x = 0; x < this._columnsCount; x++) {
                const cell = this._matrix[y][x];
                const cellElement = cell.HtmlElement;

                rowElement.append(cellElement);
            }

            fieldElement.append(rowElement);
        }

        if (events) {
            const clickHandler = (event) => {
                // get current cell
                let cell;
                this.forAllCells((item) => {
                    if (item.id === Number(event.target.dataset.id)) {
                        cell = item;
                    }
                });

                // if left click
                if (event.button === 0) {
                    if (cell.isOpen) {
                        const cellsAround = this.getCellsAround(cell);
                        const flagsAroundCount = cellsAround.reduce((accum, currentValue) => {
                            if (currentValue.isFlag) {
                                return accum + 1;
                            }
                            return accum;
                        }, 0);

                        if (cell.number === flagsAroundCount) {
                            cellsAround.forEach((item) => {
                                this.openChunck(item);
                            });
                        }
                    } else if (!cell.isFlag && cell.isMine) {
                        this.stopGame();
                    } else {
                        this.openChunck(cell);
                    }
                    // if right click
                } else if (event.button === 2) {
                    if (!cell.isOpen) {
                        cell.toggleFlag();

                        if (cell.isFlag) {
                            this.setBombsCounter((item) => --item);
                            // this.bombsCounter.textContent =
                            //     Number(this.bombsCounter.textContent) - 1;
                        } else {
                            this.setBombsCounter((item) => ++item);
                            // this.bombsCounter.textContent =
                            // Number(this.bombsCounter.textContent) + 1;
                        }
                    }
                }
            };

            fieldElement.addEventListener('mousedown', clickHandler);
        }

        this._container.innerHTML = '';
        this._container.append(this.bombsLeftCounterElement);
        this._container.append(fieldElement);

        return fieldElement;
    }

    mineMatrix(cellToNotMine) {
        for (let i = 0; i < this._bombsCount; i++) {
            this.placeMineToRandomCell(cellToNotMine);
        }
    }

    placeMineToRandomCell(cellToNotMine) {
        let cell = this.getRandomFreeCell();
        while (cell === cellToNotMine) {
            cell = this.getRandomFreeCell();
        }
        cell.placeMine();

        const cellsAround = this.getCellsAround(cell);
        cellsAround.forEach((item) => item.incrementNumber());
    }

    createMatrix() {
        const matrix = [];

        let id = 1;

        for (let y = 0; y < this._rowsCount; y++) {
            const row = [];
            for (let x = 0; x < this._columnsCount; x++) {
                row.push(new Cell(y, x, id++));
            }
            matrix.push(row);
        }

        return matrix;
    }

    getRandomFreeCell() {
        const freeCells = [];

        this.forAllCells((cell) => {
            if (!cell.isMine) {
                freeCells.push(cell);
            }
        });

        const index = randomInteger(0, freeCells.length - 1);

        return freeCells[index];
    }

    getCellsAround(cell) {
        const { x, y } = cell.getCoords();

        const cellsAround = [];

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dy === 0 && dx === 0) continue;

                const cell = this._matrix?.[y + dy]?.[x + dx];

                if (cell) {
                    cellsAround.push(cell);
                }
            }
        }

        return cellsAround;
    }

    forAllCells(callback) {
        const { _matrix: matrix } = this;

        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                callback(matrix[y][x]);
            }
        }
    }

    openChunck(cell) {
        if (!cell.isMine && !cell.isFlag && !cell.isOpen) {
            cell.open();

            if (cell.number === 0) {
                const cellsAround = this.getCellsAround(cell);
                cellsAround.forEach((item) => {
                    this.openChunck(item);
                });
            }
        }
    }

    setBombsCounter(callback) {
        this.bombsLeftCounter = callback(this.bombsLeftCounter);
        this.bombsLeftCounterElement.textContent = this.bombsLeftCounter;
    }

    stopGame() {
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'reset';
        resetBtn.addEventListener('click', () => {
            this.bombsLeftCounterElement = document.createElement('div');
            this.bombsLeftCounterElement.textContent = this._bombsCount;
            this.bombsLeftCounter = this._bombsCount;

            this._matrix = this.createMatrix();
            this._init();
        });

        const loseText = document.createElement('div');
        loseText.textContent = 'YOU LOSE';

        this._container.innerHTML = '';
        this._container.append(loseText);
        this._container.append(resetBtn);
    }
}
