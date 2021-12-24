import '../style.css';
// import MineSweeper from './MineSweeper';
import { MineSweeperController } from './controllers';

const mineSweeper = new MineSweeperController({
    rowsCount: 10,
    columnsCount: 10,
    bombsCount: 10,
});

const app = document.querySelector('#app'),
    header = app.querySelector('.header'),
    container = app.querySelector('.container');

header.append(mineSweeper.getBombsNumberElement());
container.append(mineSweeper.getView().getHtml());
