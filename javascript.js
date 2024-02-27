const sketchpad = document.getElementById("container");
const userColour = document.getElementById("color");
const resize = document.getElementById("resizeBtn");
const clear = document.getElementById("clear");
let divElements = [];
let GridSize = 500;
let rows = 16;
let cols = 16;

sketchpad.style.width = `${GridSize}px`;
sketchpad.style.height = `${GridSize}px`;

function gridSize(){
    let result = prompt("Please enter the size that you would like the grid");
    while (result <= 1 || result >=101){
        alert("Please enter a value between 2 and 100");
        result = prompt("Please enter the size that you would like the grid");
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

function selectColour(){
    divElements.forEach(div => {
        div.addEventListener("mouseover", () => {
            // only draw, if we've previously clicked, and we haven't 'unclicked'
            if (mouseIsDown) {
                div.style.backgroundColor = userColour.value;
            }
        })

        div.addEventListener("mousedown", () => {
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