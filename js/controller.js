import { MineSweeperModel } from './model';
import { MineSweeperView } from './view';
import { customEvents } from './utils';

export class MineSweeperController {
    constructor(options) {
        this.options = options;

        this.model = null;
        this.view = null;

        this.loseCallback = null;
        this.winCallback = null;
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

        // register lose and win events
        customEvents.registerEvent('lose');
        customEvents.registerEvent('win');
        customEvents.addEventListener('lose', () => this.loseCallback());
        customEvents.addEventListener('win', () => this.winCallback());
    }

    getView() {
        return this.view;
    }

    onLose(callback) {
        this.loseCallback = callback;
    }

    onWin(callback) {
        this.winCallback = callback;
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
