import { MineSweeperModel } from './models';
import { MineSweeperView } from './views';

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
