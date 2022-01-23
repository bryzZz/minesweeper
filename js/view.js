import { customEvents, createElement } from "./utils";

export class MineSweeperView {
	constructor(model) {
		this.model = model;
		this.html = null;

		this.drawOptions = null;

		this.#init();
	}

	getHtml() {
		return this.html;
	}

	bindLeftClick(handler) {
		this.html.addEventListener("mousedown", (event) => {
			if (event.button === 0) {
				const y = event.offsetY;
				const x = event.offsetX;

				const id = this.findCellByCoords(y, x).id;
				if (id) {
					handler(id);
				}
			}
		});
	}

	bindRightClick(handler) {
		this.html.addEventListener("mousedown", (event) => {
			if (event.button === 2) {
				const y = event.offsetY;
				const x = event.offsetX;

				const id = this.findCellByCoords(y, x).id;
				if (id) {
					handler(id);
				}
			}
		});
	}

	#init() {
		// create view html element(canvas)
		this.html = createElement({
			tagName: "canvas",
			className: "minesweeper-field",
		});
		// remove context menu
		this.html.oncontextmenu = () => false;

		// init sizes
		const { rowsCount, columnsCount } = this.model.getOptions(),
			dpi = 2,
			cellSize = 50,
			width = cellSize * columnsCount,
			height = cellSize * rowsCount,
			dpiWidth = width * dpi,
			dpiHeight = height * dpi,
			dpiCellSize = cellSize * dpi,
			shownCellSize = dpiCellSize * 0.8,
			linesLength = dpiCellSize * 0.6;

		this.drawOptions = Object.freeze({
			colors: {
				main: "#e77d26",
				flag: "#646464",
				mine: "tomato",
				text: "#e5e5e5",
				stroke: "rgb(156, 156, 156)",
			},
			font: {
				size: 48,
				family: "Roboto",
			},
			rowsCount,
			columnsCount,
			width,
			height,
			cellSize,
			dpi,
			dpiWidth,
			dpiHeight,
			dpiCellSize,
			shownCellSize,
			linesLength,
		});

		this.setSizes(); // set html element and inner canvas sizes
		this.updateView(); // first draw view
		this.addCursorMoveEvents(); // add events to html element

		// event to update
		customEvents.registerEvent("updatefield");
		customEvents.addEventListener("updatefield", this.updateView.bind(this));
	}

	setSizes() {
		const { width, height, dpiWidth, dpiHeight } = this.drawOptions;

		// set Element size
		this.html.style.width = width + "px";
		this.html.style.height = height + "px";
		// set Canvas inner size
		this.html.width = dpiWidth;
		this.html.height = dpiHeight;
	}

	updateView() {
		const { dpiWidth, dpiHeight } = this.drawOptions;
		const matrix = this.model.getMatrix();
		const ctx = this.html.getContext("2d");

		// clear canvas
		ctx.clearRect(0, 0, dpiWidth, dpiHeight);

		// draw
		ctx.beginPath();

		this.drawLines(ctx);
		this.drawCells(ctx, matrix);

		ctx.closePath();
	}

	drawLines(ctx) {
		const {
			rowsCount,
			columnsCount,
			dpiWidth,
			dpiCellSize: cellSize,
			linesLength,
			dpi,
		} = this.drawOptions;
		const spaceBetweenLines = (dpiWidth - linesLength * columnsCount) / columnsCount;

		ctx.strokeStyle = this.drawOptions.colors.stroke;
		ctx.lineWidth = dpi / 2;

		// horizontal
		for (let i = 1; i < rowsCount; i++) {
			const y = cellSize * i;

			for (let j = 0; j < columnsCount; j++) {
				let x = spaceBetweenLines / 2 + j * cellSize;
				ctx.moveTo(x, y);
				ctx.lineTo(x + linesLength, y);
			}
		}

		// vertical
		for (let i = 1; i < columnsCount; i++) {
			const x = cellSize * i;

			for (let j = 0; j < rowsCount; j++) {
				const y = spaceBetweenLines / 2 + j * cellSize;
				ctx.moveTo(x, y);
				ctx.lineTo(x, y + linesLength);
			}
		}

		ctx.stroke();
	}

	drawCells(ctx, matrix) {
		const { dpiCellSize: cellSize, shownCellSize } = this.drawOptions;
		const { main, flag, mine } = this.drawOptions.colors;

		for (let i = 0; i < matrix.length; i++) {
			for (let j = 0; j < matrix[i].length; j++) {
				const { isOpen, isFlag, isMine, number } = matrix[i][j];

				let color = "transparent",
					img = null;
				if (!isOpen) {
					color = main;
					if (isFlag) {
						color = flag;
					}
				} else if (isMine) {
					color = mine;

					img = "../Group 4.svg";
				}

				const y = (cellSize - shownCellSize) / 2 + i * cellSize;
				const x = (cellSize - shownCellSize) / 2 + j * cellSize;
				const radius = (shownCellSize / 100) * 8;
				const isTextVisible = number > 0 && isOpen && !isMine;
				let textContent = isTextVisible ? number : "";

				ctx.beginPath();
				this.drawCell(ctx, x, y, shownCellSize, radius, color, textContent, img);
				ctx.closePath();
			}
		}
	}

	drawCell(ctx, x, y, size, radius = 5, color, text, img) {
		if (typeof radius === "number") {
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
		ctx.quadraticCurveTo(x + size, y + size, x + size - radius.br, y + size);
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
			} = this.drawOptions;

			ctx.fillStyle = textColor;
			ctx.font = `${fontSize}px ${family}`;

			ctx.fillText(text, x + size / 2.9, y + size / 1.5);
		}
	}

	findCellByCoords(y, x) {
		const { cellSize } = this.drawOptions;
		const matrix = this.model.getMatrix();

		y = Math.floor(y / cellSize);
		x = Math.floor(x / cellSize);

		return matrix[y][x];
	}

	addCursorMoveEvents() {
		this.html.addEventListener("mousemove", (event) => {
			const y = event.offsetY;
			const x = event.offsetX;

			const cell = this.findCellByCoords(y, x);

			if (!cell) return;

			if (!cell.isOpen) {
				this.html.style.cursor = "pointer";
			} else {
				this.html.style.cursor = "default";
			}
		});
	}
}
