import { customEvents, randomInteger } from './utils';

export class MineSweeperModel {
    constructor(options) {
        this.options = options;

        this.matrix = this.#createMatrix();

        this.isFirstClick = true;
    }

    getMatrix() {
        return this.matrix;
    }

    getOptions() {
        return this.options;
    }

    getMinesNumber() {
        let flagsCount = 0;
        this.#forAllCells((cell) => {
            if (cell.isFlag) {
                flagsCount += 1;
            }
        });

        return this.options.minesCount - flagsCount;
    }

    // model handlers
    leftClickHandler(id) {
        // find current cell
        let currentCell = null;
        this.#forAllCells((cell) => {
            if (cell.id === id) {
                currentCell = cell;
            }
        });

        // handle first click
        if (this.isFirstClick) {
            const cellsToNotMine = [
                currentCell,
                ...this.#getCellsAround(currentCell.y, currentCell.x),
            ];
            this.#mineMatrix(cellsToNotMine);

            this.isFirstClick = false;
        }

        const { isOpen, isMine, isFlag, number } = currentCell;
        let isLose = false;

        if (!isOpen && !isFlag && !isMine) {
            this.#open(currentCell);

            customEvents.dispatchEvent('updatefield');
        } else if (isOpen && number > 0) {
            this.#openAround(currentCell);

            customEvents.dispatchEvent('updatefield');
        } else if (!isOpen && !isFlag && isMine) {
            this.#lose();
            isLose = true;

            customEvents.dispatchEvent('updatefield');
        }

        if (!isLose && this.#isWin()) {
            this.#win();
        }
    }

    rightClickHandler(id) {
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                const cell = this.matrix[i][j];
                if (cell.id === id) {
                    if (!cell.isOpen) {
                        cell.isFlag = !cell.isFlag;
                    }

                    customEvents.dispatchEvent('updatefield');

                    break;
                }
            }
        }
    }

    #createMatrix() {
        const { rowsCount, columnsCount } = this.options;
        const matrix = [];

        // generate matrix
        let id = 1;
        for (let y = 0; y < rowsCount; y++) {
            const row = [];
            for (let x = 0; x < columnsCount; x++) {
                const cell = {
                    y,
                    x,
                    id: id.toString(),
                    number: 0,
                    isOpen: false,
                    isMine: false,
                    isFlag: false,
                };

                row.push(cell);

                id++;
            }
            matrix.push(row);
        }

        return matrix;
    }

    #mineMatrix(cellsToNotMine) {
        const { rowsCount, columnsCount, minesCount } = this.options;

        const minedCells = [];
        for (let i = 0; i < minesCount; i++) {
            let randomY = randomInteger(0, rowsCount - 1);
            let randomX = randomInteger(0, columnsCount - 1);
            let randomCell = this.matrix[randomY][randomX];
            while (
                minedCells.includes(randomCell) ||
                cellsToNotMine.includes(randomCell)
            ) {
                randomY = randomInteger(0, rowsCount - 1);
                randomX = randomInteger(0, columnsCount - 1);
                randomCell = this.matrix[randomY][randomX];
            }

            minedCells.push(randomCell);

            randomCell.isMine = true;

            this.#getCellsAround(randomCell.y, randomCell.x).forEach((cell) => {
                cell.number += 1;
            });
        }
    }

    #forAllCells(callback) {
        const { matrix } = this;

        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                callback(matrix[y][x]);
            }
        }
    }

    #getCellsAround(y, x, matrix = this.matrix) {
        const cellsAround = [];

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dy === 0 && dx === 0) continue;

                const cell = matrix?.[y + dy]?.[x + dx];

                if (cell) {
                    cellsAround.push(cell);
                }
            }
        }

        return cellsAround;
    }

    #open(cell) {
        if (!cell.isMine && !cell.isFlag && !cell.isOpen) {
            cell.isOpen = true;

            if (cell.number === 0) {
                const cellsAround = this.#getCellsAround(cell.y, cell.x);
                cellsAround.forEach((item) => {
                    this.#open(item);
                });
            }
        } else if (cell.isMine) {
            this.#lose();
        }
    }

    #openAround(cell) {
        const cellsAround = this.#getCellsAround(cell.y, cell.x);
        let flagsAroundCount = cellsAround.reduce(
            (accum, { isFlag }) => (isFlag ? ++accum : accum),
            0
        );

        if (cell.number === flagsAroundCount) {
            cellsAround.forEach((cell) => {
                if (!cell.isFlag) {
                    this.#open(cell);
                }
            });
        }
    }

    #isWin() {
        let res = true;

        this.#forAllCells((cell) => {
            if (!cell.isOpen && !cell.isMine) {
                res = false;
            }
        });

        return res;
    }

    #lose() {
        this.#forAllCells((cell) => {
            cell.isOpen = true;
        });

        customEvents.dispatchEvent('lose');
    }

    #win() {
        customEvents.dispatchEvent('win');
    }
}
