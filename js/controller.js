import { MineSweeperModel } from './model';
import { MineSweeperView } from './view';
import { customEvents } from './utils';

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

    onLose(callback) {
        customEvents.addEventListener('lose', callback);
    }

    onMinesCounterChange(callback) {
        let minesNumber = this.model.getMinesNumber();
        callback(minesNumber);

        customEvents.addEventListener('updatefield', () => {
            minesNumber = this.model.getMinesNumber();
            callback(minesNumber);
        });
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

        // register lose event
        customEvents.registerEvent('lose');
    }
}
