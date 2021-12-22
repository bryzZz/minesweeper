import { customEvents, randomInteger } from './utils';

export class MineSweeperModel {
    constructor(options) {
        this.options = options;

        this.matrix = this.#createMatrix();
    }

    getMatrix() {
        return this.matrix;
    }

    getOptions() {
        return this.options;
    }

    #createMatrix() {
        const { rowsCount, columnsCount, bombsCount } = this.options;
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
                };

                row.push(cell);

                id++;
            }
            matrix.push(row);
        }

        // mine matrix
        const numbersOfCellsWithMine = [];
        for (let i = 0; i < bombsCount; i++) {
            let randomInt = randomInteger(0, rowsCount * columnsCount - 1);
            while (numbersOfCellsWithMine.includes(randomInt)) {
                randomInt = randomInteger(0, rowsCount * columnsCount - 1);
            }
            numbersOfCellsWithMine.push(randomInt);
        }

        let numberOfCell = 0;
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                if (numbersOfCellsWithMine.includes(numberOfCell)) {
                    const cellsAround = this.#getCellsAround(y, x, matrix);

                    cellsAround.forEach((cell) => (cell.number += 1));

                    matrix[y][x].isMine = true;
                }
                numberOfCell++;
            }
        }

        return matrix;
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

    // model handlers
    clickHandler(id) {
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                const cell = this.matrix[i][j];
                if (cell.id === id) {
                    cell.isOpen = true;

                    customEvents.dispatchEvent('updatefield');

                    break;
                }
            }
        }
    }
}
