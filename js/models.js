import { customEvents } from './utils';

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
        const { rowsCount, columnsCount } = this.options;
        const matrix = [];

        let id = 1;

        for (let y = 0; y < rowsCount; y++) {
            const row = [];
            for (let x = 0; x < columnsCount; x++) {
                row.push({ y, x, id: id++, number: 1, isOpen: false });
            }
            matrix.push(row);
        }

        return matrix;
    }

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

    // get() {
    //     return this.data;
    // }
    // add(name) {
    //     this.data[new Date().getTime()] = name;
    //     customEvents.dispatchEvent('TimeToUpdateList');
    // }
    // delete(id) {
    //     delete this.data[id];
    //     customEvents.dispatchEvent('TimeToUpdateList');
    // }
}
