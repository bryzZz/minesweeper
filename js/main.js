import '../style.css';
import { MineSweeperController } from './controller';
import { createElement } from './utils';

const mineSweeper = new MineSweeperController({
    rowsCount: 10,
    columnsCount: 10,
    minesCount: 9,
});

const app = document.querySelector('#app'),
    header = app.querySelector('.header'),
    container = app.querySelector('.container'),
    view = mineSweeper.getView().getHtml();

container.append(view);

// Drag To Scroll
const removeDragToScroll = addDragToScroll(container);

function addDragToScroll(element) {
    let pos = { top: 0, left: 0, x: 0, y: 0 },
        mousePressed = false,
        spacePressed = false;

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    element.addEventListener('mousedown', mouseDownHandler);

    function keyDownHandler(e) {
        if (e.code !== 'Space') return;

        e.preventDefault();

        spacePressed = true;

        if (!mousePressed) {
            element.style.cursor = 'grab';
        }

        view.classList.add('no-pointer-events');
    }

    function keyUpHandler(e) {
        if (e.code !== 'Space') return;

        spacePressed = false;

        if (!mousePressed) {
            element.style.cursor = 'default';
            view.classList.remove('no-pointer-events');
        }
    }

    function mouseDownHandler(e) {
        if (spacePressed) {
            mousePressed = true;

            element.style.cursor = 'grabbing';

            pos = {
                // The current scroll
                left: element.scrollLeft,
                top: element.scrollTop,
                // Get the current mouse position
                x: e.clientX,
                y: e.clientY,
            };

            element.addEventListener('mousemove', mouseMoveHandler);
            element.addEventListener('mouseup', mouseUpHandler);
        }
    }

    function mouseMoveHandler(e) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        // Scroll the element
        element.scrollTop = pos.top - dy;
        element.scrollLeft = pos.left - dx;
    }

    function mouseUpHandler() {
        element.removeEventListener('mousemove', mouseMoveHandler);
        element.removeEventListener('mouseup', mouseUpHandler);

        mousePressed = false;

        if (!spacePressed) {
            element.style.cursor = 'default';
            view.classList.remove('no-pointer-events');
        }
    }

    function removeEventsHandler() {
        document.removeEventListener('keydown', keyDownHandler);
        document.removeEventListener('keyup', keyUpHandler);
        element.removeEventListener('mousedown', mouseDownHandler);
    }

    return removeEventsHandler;
}

// Handle mines counter
const minesCounterElement = createElement({
    tagName: 'div',
    className: 'mines-counter',
});

mineSweeper.onMinesCounterChange((minesCount) => {
    minesCounterElement.innerHTML = `Mines left: <span>${minesCount}</span>`;
});

header.append(minesCounterElement);

// Handle lose
mineSweeper.onLose(loseHandler);

function loseHandler() {
    removeDragToScroll();
}
