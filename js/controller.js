import { MineSweeperModel } from './model';
import { MineSweeperView } from './view';
import { createElement, customEvents } from './utils';

export class MineSweeperController {
    constructor(options) {
        this.options = options;

        this.model = null;
        this.view = null;

        this.#init();
    }

    getView() {
        return this.view;
    }

    getBombsNumberElement() {
        const bombsNumber = this.model.getBombsNumber();
        const bombsNumberElement = createElement({
            tagName: 'span',
            textContent: bombsNumber,
        });
        customEvents.addEventListener('updatefield', () => {
            bombsNumberElement.textContent = this.model.getBombsNumber();
        });
        return bombsNumberElement;
    }

    #init() {
        this.model = new MineSweeperModel(this.options);
        this.view = new MineSweeperView(this.model);

        // bind handlers
        this.view.bindLeftClick((id) => {
            this.model.leftClickHandler(id);
        });
        this.view.bindRightClick((id) => {
            this.model.rightClickHandler(id);
        });
    }
}
