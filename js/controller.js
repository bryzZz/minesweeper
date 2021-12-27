import { MineSweeperModel } from './model';
import { MineSweeperView } from './view';
import { customEvents } from './utils';

export class MineSweeperController {
    constructor(options) {
        this.options = options;

        this.model = null;
        this.view = null;

        this.loseCallback = null;
    }

    start() {
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
        customEvents.addEventListener('lose', () => {
            this.loseCallback();
        });
    }

    getView() {
        return this.view;
    }

    onLose(callback) {
        this.loseCallback = callback;
    }

    onMinesCounterChange(callback) {
        let minesNumber = this.model.getMinesNumber();
        callback(minesNumber);

        customEvents.addEventListener('updatefield', () => {
            minesNumber = this.model.getMinesNumber();
            callback(minesNumber);
        });
    }
}
