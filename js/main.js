import '../style.css';
import MineSweeper from './MineSweeper';

// const matrix = getMatrix(10, 10);
// console.log(matrix);

// for (let i = 0; i < 20; i++) {
//     setRandomMine(matrix);
// }

// -----------------------------------------------------------------------------------

// const mineSweeper = new MineSweeper(10, 10);
// // console.log(mineSweeper.matrix);

// for (let i = 0; i < 20; i++) {
//     mineSweeper.setRandomMine();
// }

// const appElement = document.querySelector('#app');
// const containerElement = document.createElement('div');
// containerElement.classList.add('container');
// appElement.append(containerElement);

// mineSweeper.toHtml(containerElement);

// -----------------------------------------------------------------------------------

const appElement = document.querySelector('#app');
const containerElement = document.createElement('div');
containerElement.classList.add('container');
appElement.append(containerElement);

const mineSweeper = new MineSweeper(containerElement, {
    rowsCount: 12,
    columnsCount: 12,
    bombsCount: 11,
});

// console.log(mineSweeper._matrix);
