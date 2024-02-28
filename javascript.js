const sketchpad = document.getElementById("container");
const userColour = document.getElementById("color");
const resize = document.getElementById("resizeBtn");
const clear = document.getElementById("clear");
const undoBtn = document.getElementById("undo");
const save = document.getElementById("save");
const load = document.getElementById("load");

let divElements = [];
let gridStates = []; 
let GridSize = 500;
let rows = 16;
let cols = 16;

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
    selectColour();
}
 
function clearGrid() {
    divElements.forEach(div => {
        sketchpad.removeChild(div);
    });
    divElements = [];
}

function createGridCells(){
    for (i = 0; i < (rows * cols); i++){
        const div = document.createElement("div");
        div.style.width = `${(GridSize / rows) - 2}px`;
        div.style.height = `${(GridSize / cols) - 2}px`;
        div.classList.add("cell")
        sketchpad.appendChild(div);
        divElements.push(div);   
    }
}

let mouseIsDown = false;
sketchpad.addEventListener('mousedown', () => {
    mouseIsDown = true;
});

sketchpad.addEventListener('mouseup', () => {
    mouseIsDown = false;
});

function captureGridState() {
    const currentState = [];
    divElements.forEach(div => {
        currentState.push(div.style.backgroundColor);
    });
    gridStates.push(currentState);
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

undoBtn.addEventListener("click", undo);

function selectColour(){
    divElements.forEach(div => {
        div.addEventListener("mouseover", () => {
            if (mouseIsDown) {
                captureGridState();
                div.style.backgroundColor = userColour.value;
            }
        })

        div.addEventListener("mousedown", () => {
            captureGridState();
            div.style.backgroundColor = userColour.value;
        })
    })
}

resize.addEventListener("click", gridSize)
clear.addEventListener("click", () => {
    clearGrid();
    createGridCells();
    selectColour();
})

createGridCells()
selectColour()
gridSize()


function saveData(){
    if (typeof(Storage) !== "undefined"){
        localStorage.setItem('savedDrawing', JSON.stringify(divElements));
        localStorage.setItem('savedCols', JSON.stringify(cols));
        localStorage.setItem('savedRows', JSON.stringify(rows));
        alert('Data saved successfully');
    } else {
        alert('Local storage is not supported in this browser.')
    }
}

function loadData(){
    let divElements = JSON.parse(localStorage.getItem('savedDrawing'));
    let cols = JSON.parse(localStorage.getItem('savedCols'));
    let rows = JSON.parse(localStorage.getItem('savedRows'));
    
}

save.addEventListener('click', saveData);
load.addEventListener('click', loadData);