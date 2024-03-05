const sketchpad = document.getElementById("container");
const userColour = document.getElementById("color");
const resize = document.getElementById("resize");
const clear = document.getElementById("clear");
const undoBtn = document.getElementById("undo");
const save = document.getElementById("save");
const load = document.getElementById("load");
const text = document.getElementById("text");

let divElements = [];
let gridStates = []; 
let GridSize = 500;
let rows = 16;
let cols = 16;
let mouseIsDown = false;

sketchpad.style.width = `${GridSize}px`;
sketchpad.style.height = `${GridSize}px`;

function gridSize(){
    rows = resize.value;
    cols = resize.value;
    clearGrid(); 
    createGridCells();
    draw();
    gridStates = [];
}
 
function clearGrid() {
    divElements.forEach(div => {
        sketchpad.removeChild(div);
    });
    divElements = [];
    gridStates = [];
    text.innerText = "";
}

function createGridCells(){
    for (i = 0; i < (rows * cols); i++){
        const div = document.createElement("div");
        div.style.width = `${(GridSize / rows) - 2}px`;
        div.style.height = `${(GridSize / cols) - 2}px`;
        div.classList.add("cell");
        sketchpad.appendChild(div);
        divElements.push(div);   
    }
}

function undo() {
    if (gridStates.length > 1) { 
        gridStates.pop(); 
        const previousState = gridStates[gridStates.length - 1]; 
        divElements.forEach((div, index) => {
            div.style.backgroundColor = previousState[index]; 
        });
    }
}

function saveData(){
    if (typeof(Storage) !== "undefined"){
        const markedCells = divElements.map(div => div.style.backgroundColor !== "" ? true : false);
        localStorage.setItem('markedCells', JSON.stringify(markedCells));
        localStorage.setItem('savedCols', JSON.stringify(cols));
        localStorage.setItem('savedRows', JSON.stringify(rows));
        text.innerText = 'Data saved successfully';
    } else {
        text.innerText = 'Local storage is not supported in this browser.';
    }
}

function loadData(){
    console.log("Loading data...");
    if (localStorage.getItem('markedCells') !== null){
        const markedCells = JSON.parse(localStorage.getItem('markedCells'));
        const savedCols = JSON.parse(localStorage.getItem('savedCols'));
        const savedRows = JSON.parse(localStorage.getItem('savedRows'));
        clearGrid();
        cols = savedCols;
        rows = savedRows;
        createGridCells();
        draw();
        markedCells.forEach((marked, index) => {
            if (marked) {
                divElements[index].style.backgroundColor = userColour.value;
            }
        });
        
    }

}

function draw(){
    divElements.forEach(div => {
        div.addEventListener("mouseover", () => {
            if (mouseIsDown) {
                const currentState = divElements.map(div => div.style.backgroundColor);
                gridStates.push(currentState); 
                div.style.backgroundColor = userColour.value;
            }
        })
        div.addEventListener("mousedown", () => {
            const currentState = divElements.map(div => div.style.backgroundColor);
            gridStates.push(currentState); 
            div.style.backgroundColor = userColour.value;
        })
    })
}

sketchpad.addEventListener('mousedown', () => {
    mouseIsDown = true;
});

sketchpad.addEventListener('mouseup', () => {
    mouseIsDown = false;
});

clear.addEventListener("click", () => {
    clearGrid();
    createGridCells();
    draw();
})

undoBtn.addEventListener("click", undo);
save.addEventListener('click', saveData);
load.addEventListener('click', loadData);

resize.addEventListener('input', gridSize);

createGridCells()
draw()
gridSize()

