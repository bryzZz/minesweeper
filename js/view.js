import { customEvents, createElement } from './utils';

export class MineSweeperView {
    constructor(model) {
        this.model = model;
        this.html = null;

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

    getHtml() {
        return this.html;
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

    #init() {
        this.html = createElement({ tagName: 'canvas' });
        // remove context menu
        this.html.oncontextmenu = () => false;

        this.#updateHtml();

        customEvents.registerEvent('updatefield');
        customEvents.addEventListener(
            'updatefield',
            this.#updateHtml.bind(this)
        );
    }

    #updateHtml() {
        const matrix = this.model.getMatrix();
        const { rowsCount, columnsCount } = this.model.getOptions();

        const CELL_SIZE = 50;
        const WIDTH = CELL_SIZE * columnsCount;
        const HEIGHT = CELL_SIZE * rowsCount;
        const DPI = 2;
        const DPI_CELL_SIZE = CELL_SIZE * DPI;
        const OFFSET = DPI_CELL_SIZE / 10;

        const ctx = this.html.getContext('2d');

        this.#setSizes(WIDTH, HEIGHT, DPI);
        ctx.clearRect(0, 0, WIDTH, HEIGHT); // clear canvas
        this.#addCursorEvents();

        ctx.beginPath();

        this.#drawLines(
            ctx,
            rowsCount,
            columnsCount,
            DPI_CELL_SIZE,
            OFFSET * 2
        );
        this.#drawCells(ctx, matrix, DPI_CELL_SIZE, OFFSET);

        ctx.closePath();
    }

    #setSizes(width, height, dpi) {
        // set Element size
        this.html.style.width = width + 'px';
        this.html.style.height = height + 'px';
        // set Canvas inner size
        this.html.width = width * dpi;
        this.html.height = height * dpi;
    }

    #drawLines(ctx, rowsCount, columnsCount, cellSize, offset) {
        ctx.strokeStyle = this.styles.colors.stroke;

        const lineLength = cellSize - offset * 2;

        // horizontal
        for (let i = 1; i < rowsCount; i++) {
            const y = cellSize * i;

            for (let j = 0; j < columnsCount; j++) {
                const x = offset + j * cellSize;
                ctx.moveTo(x, y);
                ctx.lineTo(x + lineLength, y);
            }
        }

        // vertical
        for (let i = 1; i < columnsCount; i++) {
            const x = cellSize * i;

            for (let j = 0; j < rowsCount; j++) {
                const y = offset + j * cellSize;
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + lineLength);
            }
        }

        ctx.stroke();
    }

    #drawCells(ctx, matrix, cellSize, offset) {
        const { main, flag, mine } = this.styles.colors;

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                const { isOpen, isFlag, isMine, number } = matrix[i][j];

                let color = 'transparent';
                let img = null;
                if (!isOpen) {
                    color = main;
                    if (isFlag) {
                        color = flag;
                    }
                } else if (isMine) {
                    color = mine;

                    img = '../Group 4.svg';
                }

                const y = offset + i * cellSize;
                const x = offset + j * cellSize;
                const size = cellSize - offset * 2;
                const isTextVisible = number > 0 && isOpen && !isMine;
                let textContent = isTextVisible ? number : '';

                ctx.beginPath();
                this.#drawCell(ctx, x, y, size, 5, color, textContent, img);
                ctx.closePath();
            }
        }
    }

    #drawCell(ctx, x, y, size, radius = 5, color, text, img) {
        if (typeof radius === 'number') {
            radius = { tl: radius, tr: radius, br: radius, bl: radius };
        } else {
            const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
            for (const side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }

        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + size - radius.tr, y);
        ctx.quadraticCurveTo(x + size, y, x + size, y + radius.tr);
        ctx.lineTo(x + size, y + size - radius.br);
        ctx.quadraticCurveTo(
            x + size,
            y + size,
            x + size - radius.br,
            y + size
        );
        ctx.lineTo(x + radius.bl, y + size);
        ctx.quadraticCurveTo(x, y + size, x, y + size - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);

        ctx.fillStyle = color;
        ctx.fill();

        if (text) {
            const {
                colors: { text: textColor },
                font: { size: fontSize, family },
            } = this.styles;

            ctx.fillStyle = textColor;
            ctx.font = `${fontSize}px ${family}`;

            ctx.fillText(text, x + size / 2.9, y + size / 1.5);
        }
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

            if (cell) {
                if (!cell.isOpen) {
                    this.html.style.cursor = 'pointer';
                } else {
                    this.html.style.cursor = 'default';
                }
            }
        });
    }
}
