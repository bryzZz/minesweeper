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

        this.view.addClickHandler((id) => {
            this.model.clickHandler(id);
        });

        // this.view.addCreateTaskHandler((taskTitle) => {
        //     this.model.add(taskTitle);
        // });
        // this.view.addCheckedHandler((id) => {
        //     this.model.delete(id);
        // });
    }
}
