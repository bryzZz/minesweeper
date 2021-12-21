import '../style.css';
// import MineSweeper from './MineSweeper';
import { MineSweeperController } from './controllers';

const mineSweeper = new MineSweeperController({
    rowsCount: 12,
    columnsCount: 12,
    bombsCount: 11,
});

const app = document.querySelector('#app');

const container = document.createElement('div');
container.classList.add('container');

container.append(mineSweeper.getView().getHtml());

app.append(container);

// const mineSweeper = new MineSweeper(containerElement, {
// rowsCount: 12,
// columnsCount: 12,
// bombsCount: 11,
// });
