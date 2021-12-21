import { customEvents } from './utils';

export class MineSweeperView {
    constructor(model) {
        this.model = model;
        this.html = null;

        this.clickHandler = null;

        this.#init();
    }

    #init() {
        this.html = document.createElement('div');
        this.html.innerHTML = '<div class="field"></div>';
        this.updateHtml();

        customEvents.registerEvent('updatefield');
        customEvents.addEventListener(
            'updatefield',
            this.updateHtml.bind(this)
        );
    }

    getCellElement(cell) {
        const { id, number, isOpen } = cell;

        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');

        if (number > 0 && isOpen) {
            cellElement.textContent = number;
        }

        if (this.clickHandler !== null) {
            cellElement.addEventListener('click', () => this.clickHandler(id));
        }

        return cellElement;
    }

    getHtml() {
        return this.html;
    }

    updateHtml() {
        const field = this.html.querySelector('.field');
        const matrix = this.model.getMatrix();

        field.innerHTML = '';

        for (const row of matrix) {
            const rowElement = document.createElement('div');
            rowElement.classList.add('row');

            for (const cell of row) {
                rowElement.append(this.getCellElement(cell));
            }

            field.append(rowElement);
        }
    }

    addClickHandler(handler) {
        this.clickHandler = handler;
        this.updateHtml();
    }

    // updateHtmlForList() {
    //     const tasklist = this.html.querySelector('#tasklist');
    //     tasklist.innerHTML = '';

    //     const data = this.model.get();
    //     for (const key in data) {
    //         tasklist.append(this.getHtmlForTask(key, data[key]));
    //     }
    // }

    // getHtmlForTask(id, name) {
    //     const liElement = document.createElement('li');
    //     liElement.innerHTML = `
    //         <input id='${id}' type='checkbox' />
    //         <label for='${id}'>${name}</label>
    //     `;

    //     if (this.deleteHandler !== null) {
    //         liElement.querySelector('input').addEventListener('click', () => {
    //             this.deleteHandler(id);
    //         });
    //     }

    //     return liElement;
    // }

    // addCreateTaskHandler(handler) {
    //     this.html.querySelector('#submittask').addEventListener('click', () => {
    //         const taskInput = this.html.querySelector('#taskinput');
    //         const newTaskTitle = taskInput.value;
    //         taskInput.value = '';
    //         handler(newTaskTitle);
    //     });
    // }

    // addCheckedHandler(handler) {
    //     this.deleteHandler = handler;
    // }
}
