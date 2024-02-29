const sketchpad = document.getElementById("container");
const userColour = document.getElementById("color");
const resize = document.getElementById("resizeBtn");
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
    let result = prompt("Please enter the size that you would like the grid");
    if (result === null){
        result = 30;
    } else {
            while (isNaN(result) || result <= 1 || result >=101){
                if (result === null){
                    return;
                }
            alert("Please enter a value between 2 and 100");
            result = prompt("Please enter the size that you would like the grid");
    }
    }
    rows = parseInt(result);
    cols = parseInt(result);
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
                div.style.backgroundColor = userColour.value;
            }
        })
        div.addEventListener("mousedown", () => {
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

resize.addEventListener("click", gridSize);

clear.addEventListener("click", () => {
    clearGrid();
    createGridCells();
    draw();
})

undoBtn.addEventListener("click", undo);
save.addEventListener('click', saveData);
load.addEventListener('click', loadData);

createGridCells()
draw()
gridSize()

