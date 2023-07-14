const canvasSize = 15; // Adjust the pixels shape of the displayed whiteboard
const scalingFactor = 200; // Adjust the scaling factor (bigger for smaller pixels)

// Display canvasSize value
const outputText = document.createTextNode('Canvas size is: ' + canvasSize + 'x' + canvasSize + ' pixels.');
document.querySelector("#output-area").appendChild(outputText);

const cellSize = Math.floor(scalingFactor / canvasSize);
const container = document.createElement('div');
container.style.display = 'flex';
container.style.alignItems = 'center';
container.style.flexDirection = 'row';
container.style.marginLeft = '-5px'; // Ignore display frame

const table = document.createElement('table');
table.style.borderCollapse = 'collapse';
table.style.backgroundColor = 'white';
table.style.cursor = 'crosshair';
table.style.border = `5px solid lightgray`;

let isDrawing = false;
let selectedPixel = null;

function handleMouseClick(event) {
	const cell = event.target;
	if (cell.tagName === 'TD' && event.button === 0) {
		cell.style.backgroundColor = 'black';
	} else if (cell.tagName === 'TD' && event.button === 2) {
		const currentColor = cell.style.backgroundColor.toLowerCase();
		if (currentColor === 'black') {
			cell.style.backgroundColor = 'white';
		}
	}
}

function handleMouseMove(event) {
	const cell = event.target;
	if (cell.tagName === 'TD') {
		if (selectedPixel) {
			selectedPixel.style.outline = '';
		}
		selectedPixel = cell;
		selectedPixel.style.outline = '1px solid gray';

		if (isDrawing && (event.buttons === 1 || event.buttons === 2)) {
			const color = event.buttons === 1 ? 'black' : 'white';
			cell.style.backgroundColor = color;
		}
	}
}

function handleMouseDown(event) {
	event.preventDefault(); // Prevent content selection
	if (event.button === 0 || event.button === 2) {
		isDrawing = true;
	}
}

function handleMouseUp() {
	isDrawing = false;
}

function saveDrawing() {
	const canvas = document.createElement('canvas');
	canvas.width = canvasSize;
	canvas.height = canvasSize;

	const ctx = canvas.getContext('2d');
	const cells = document.querySelectorAll('td');
	cells.forEach((cell, index) => {
		const row = Math.floor(index / canvasSize);
		const col = index % canvasSize;
		const color = cell.style.backgroundColor.toLowerCase();

		// Convert white to black and black to white
		const newColor = color === 'black' ? 'white' : 'black';

		ctx.fillStyle = newColor;
		ctx.fillRect(col, row, 1, 1);
	});

	const downloadLink = document.createElement('a');
	downloadLink.href = canvas.toDataURL('image/png');
	downloadLink.download = 'drawing.png';
	downloadLink.click();
}

function deleteDrawing() {
	const cells = document.querySelectorAll('td');
	cells.forEach(cell => {
		cell.style.backgroundColor = 'white';
	});
}

function handleContextMenu(event) {
	event.preventDefault();
}

for (let row = 0; row < canvasSize; row++) {
	const tr = document.createElement('tr');
	for (let col = 0; col < canvasSize; col++) {
		const td = document.createElement('td');
		td.style.width = cellSize + 'px';
		td.style.height = cellSize + 'px';
		td.style.backgroundColor = 'white';

		td.addEventListener('mousedown', handleMouseClick);
		td.addEventListener('mouseenter', handleMouseMove);
		td.addEventListener('mouseleave', () => {
			td.style.outline = '';
		});

		tr.appendChild(td);
	}
	table.appendChild(tr);
}

container.appendChild(table);

const buttonsContainer = document.createElement('div');
buttonsContainer.style.display = 'flex';
buttonsContainer.style.flexDirection = 'column';
buttonsContainer.style.marginLeft = '20px';

const saveButton = document.createElement('button');
saveButton.textContent = 'Save Drawing';
saveButton.style.marginBottom = '10px';
saveButton.style.padding = '8px 16px';
saveButton.addEventListener('click', saveDrawing);
buttonsContainer.appendChild(saveButton);

const deleteButton = document.createElement('button');
deleteButton.textContent = 'Delete Drawing';
deleteButton.style.padding = '8px 16px';
deleteButton.addEventListener('click', deleteDrawing);
buttonsContainer.appendChild(deleteButton);

container.appendChild(buttonsContainer);
document.body.appendChild(container);

const style = document.createElement('style');
style.textContent = `
  td {
    border: none;
    outline: none;
  }
`;
document.head.appendChild(style);

table.addEventListener('mousemove', handleMouseMove);
table.addEventListener('mousedown', handleMouseDown);
table.addEventListener('mouseup', handleMouseUp);
table.addEventListener('contextmenu', handleContextMenu);