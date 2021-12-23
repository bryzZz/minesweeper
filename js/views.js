import { customEvents, createElement } from './utils';

export class MineSweeperView {
    constructor(model) {
        this.model = model;
        this.html = null;

        this.clickHandler = null;

        this.#init();
    }

    #init() {
        this.html = createElement({
            tagName: 'div',
            className: 'field-wrapper',
        });
        this.html.innerHTML = '<div class="field"></div>';
        this.updateHtml();

        customEvents.registerEvent('updatefield');
        customEvents.addEventListener(
            'updatefield',
            this.updateHtml.bind(this)
        );
    }

    getCellElement(cell) {
        const { id, number, isOpen, isMine, isFlag } = cell;

        let classNames = ['cell'],
            textContent;

        if (number > 0 && isOpen && !isMine) {
            textContent = number;
        }

        if (!isOpen) {
            classNames.push('hidden');
            if (isFlag) {
                classNames.push('flag');
            }
        } else if (isMine) {
            classNames.push('mine');
        }

        const cellElement = createElement({
            tagName: 'div',
            className: classNames,
            attributes: { 'data-id': id },
            textContent,
        });

        // remove context menu
        cellElement.oncontextmenu = () => false;

        return cellElement;
    }

    getHtml() {
        return this.html;
    }

    updateHtml() {
        console.log('update');

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

    bindLeftClick(handler) {
        this.html
            .querySelector('.field')
            .addEventListener('mousedown', (event) => {
                if (event.button === 0) {
                    const id = event.target.dataset.id;
                    if (id) {
                        handler(id);
                    }
                }
            });
    }

    bindRightClick(handler) {
        this.html
            .querySelector('.field')
            .addEventListener('mousedown', (event) => {
                if (event.button === 2) {
                    const id = event.target.dataset.id;
                    if (id) {
                        handler(id);
                    }
                }
            });
    }
}
