import { customEvents, createElement } from './utils';

function draw(canvas, options) {
    const { rowsCount, columnsCount } = options;

    const DPI = 2;
    const CELL_SIZE = 50;
    const WIDTH = CELL_SIZE * columnsCount;
    const HEIGHT = CELL_SIZE * rowsCount;
    const DPI_CELL_SIZE = CELL_SIZE * DPI;
    const DPI_WIDTH = WIDTH * DPI;
    const DPI_HEIGHT = HEIGHT * DPI;

    const ctx = canvas.getContext('2d');
    // set Element sizes
    canvas.style.width = WIDTH + 'px';
    canvas.style.height = HEIGHT + 'px';

    // set Canvas sizes
    canvas.width = DPI_WIDTH;
    canvas.height = DPI_HEIGHT;

    ctx.beginPath();
    ctx.strokeStyle = '#fff';

    // horizontal lines
    for (let i = 1; i < rowsCount; i++) {
        const y = DPI_CELL_SIZE * i,
            x = DPI_WIDTH;
        ctx.moveTo(0, y);
        ctx.lineTo(x, y);
    }

    // vertical lines
    for (let i = 1; i < columnsCount; i++) {
        const y = DPI_HEIGHT,
            x = DPI_CELL_SIZE * i;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, y);
    }

    ctx.stroke();
    ctx.closePath();
}

export class MineSweeperView {
    constructor(model) {
        this.model = model;
        this.html = null;

        this.canvasOptions = null;

        this.styles = {
            colors: {
                main: '#e77d26',
                flag: '#646464',
                mine: 'tomato',
                text: '#e5e5e5',
                stroke: 'rgb(156, 156, 156)',
            },
            font: {
                size: 48,
                family: 'Roboto',
            },
        };

        this.#init();
    }

    bindLeftClick(handler) {
        this.html.addEventListener('mousedown', (event) => {
            if (event.button === 0) {
                const y = event.offsetY;
                const x = event.offsetX;

                const id = this.#findCellByCoords(y, x).id;
                if (id) {
                    handler(id);
                }
            }
        });
    }

    bindRightClick(handler) {
        this.html.addEventListener('mousedown', (event) => {
            if (event.button === 2) {
                const y = event.offsetY;
                const x = event.offsetX;

                const id = this.#findCellByCoords(y, x).id;
                if (id) {
                    handler(id);
                }
            }
        });
    }

    getHtml() {
        return this.html;
    }

    updateHtml() {
        console.log('update');

        const matrix = this.model.getMatrix();
        const { rowsCount, columnsCount } = this.model.getOptions();

        const CELL_SIZE = 50;
        const WIDTH = CELL_SIZE * columnsCount;
        const HEIGHT = CELL_SIZE * rowsCount;
        const DPI = 2;
        const DPI_CELL_SIZE = CELL_SIZE * DPI;
        const DPI_WIDTH = WIDTH * DPI;
        const DPI_HEIGHT = HEIGHT * DPI;

        const ctx = this.html.getContext('2d');

        this.#setSizes(WIDTH, HEIGHT, DPI);

        // clear canvas
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        this.#drawLines(
            ctx,
            rowsCount,
            columnsCount,
            DPI_CELL_SIZE,
            DPI_WIDTH,
            DPI_HEIGHT
        );

        this.#drawCells(ctx, matrix);

        this.#addCursorEvents();
    }

    #init() {
        this.html = createElement({ tagName: 'canvas' });
        // remove context menu
        this.html.oncontextmenu = () => false;

        this.updateHtml();

        customEvents.registerEvent('updatefield');
        customEvents.addEventListener(
            'updatefield',
            this.updateHtml.bind(this)
        );
    }

    #setSizes(width, height, dpi) {
        // set Element size
        this.html.style.width = width + 'px';
        this.html.style.height = height + 'px';
        // set Canvas inner size
        this.html.width = width * dpi;
        this.html.height = height * dpi;
    }

    #drawLines(ctx, rowsCount, columnsCount, cellSize, width, height) {
        ctx.beginPath();
        ctx.strokeStyle = this.styles.colors.stroke;

        // horizontal
        for (let i = 1; i < rowsCount; i++) {
            const y = cellSize * i;
            // x = width;

            const offset = 20;
            for (let j = 0; j < columnsCount; j++) {
                const x = offset + j * cellSize;
                ctx.moveTo(x, y);
                ctx.lineTo(x + (cellSize - offset * 2), y);
            }
            // ctx.moveTo(0, y);
            // ctx.lineTo(x, y);
        }

        // vertical
        for (let i = 1; i < columnsCount; i++) {
            // const y = height,
            const x = cellSize * i;

            const offset = 20;
            for (let j = 0; j < rowsCount; j++) {
                const y = offset + j * cellSize;
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + (cellSize - offset * 2));
            }
            // ctx.moveTo(x, 0);
            // ctx.lineTo(x, y);
        }

        ctx.stroke();
        ctx.closePath();
    }

    #drawCells(ctx, matrix) {
        ctx.beginPath();

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                const { isOpen, isFlag, isMine, number } = matrix[i][j];

                let textContent = '';
                ctx.fillStyle = 'transparent';

                if (number > 0 && isOpen && !isMine) {
                    textContent = number;
                }

                if (!isOpen) {
                    ctx.fillStyle = '#e77d26';
                    if (isFlag) {
                        ctx.fillStyle = '#646464';
                    }
                } else if (isMine) {
                    ctx.fillStyle = 'tomato';
                }

                const offset = 10;
                const cellSize = 100;

                const y = offset + i * cellSize;
                const x = offset + j * cellSize;
                const size = cellSize - offset * 2;

                ctx.fillRect(x, y, size, size);

                ctx.fillStyle = this.styles.colors.text;
                ctx.font = `${this.styles.font.size}px ${this.styles.font.family}`;

                ctx.fillText(
                    textContent,
                    x + cellSize / 2 - offset * 2.3,
                    y + cellSize / 2 + offset * 0.7
                );
            }
        }

        ctx.stroke();
        ctx.closePath();
    }

    #findCellByCoords(y, x) {
        const matrix = this.model.getMatrix();

        y = Math.floor(y / 50);
        x = Math.floor(x / 50);

        return matrix[y][x];
    }

    #addCursorEvents() {
        this.html.addEventListener('mousemove', (event) => {
            const y = event.offsetY;
            const x = event.offsetX;

            const cell = this.#findCellByCoords(y, x);

            if (!cell.isOpen) {
                this.html.style.cursor = 'pointer';
            } else {
                this.html.style.cursor = 'default';
            }
        });
    }
}
