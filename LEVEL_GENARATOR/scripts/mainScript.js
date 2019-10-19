//GLOBAL VARIABLES
let CURRENT_SELECTED_COMPONENT = {
    image: undefined,
    ID: undefined,
    previousSelectedLi: undefined,
};
let GRID_SIZE = {
    colls: 60,
    rows: 30,
}
let MAP_ARRAY = new Array(GRID_SIZE.rows);
for (let i = 0; i < MAP_ARRAY.length; i++) {
    let arr = new Array(GRID_SIZE.colls)
    arr.fill("XX");
    MAP_ARRAY[i] = arr;
}

//ONLOAD
window.onload = function () {
    main();
}

//MAIN
function main() {
    generateMapGrid();
    selectComponent();
    document.getElementById("loadJSON").onclick = function () {
        loadJSON();
    }
}

//SELECTING COMPONENTS
function selectComponent() {
    var g = document.getElementById("componentsList");
    for (var i = 0, len = g.children.length; i < len; i++) {
        (function (index) {
            g.children[i].onclick = function () {
                CURRENT_SELECTED_COMPONENT.ID = this.getAttribute("componentID");
                CURRENT_SELECTED_COMPONENT.image = this.children[0].src;
                if (CURRENT_SELECTED_COMPONENT.previousSelectedLi) {
                    CURRENT_SELECTED_COMPONENT.previousSelectedLi.style.opacity = "0.5";
                }
                this.style.opacity = "1";
                CURRENT_SELECTED_COMPONENT.previousSelectedLi = this;
            }
        })(i);
    }
}

//CELL ON CLICK
function cellClick(cell) {
    if (CURRENT_SELECTED_COMPONENT.ID && CURRENT_SELECTED_COMPONENT.image) {
        let cellRow = parseInt(cell.getAttribute("row"));
        let cellColl = parseInt(cell.getAttribute("coll"));
        MAP_ARRAY[cellRow][cellColl] = CURRENT_SELECTED_COMPONENT.ID;
        cell.style.backgroundImage = "url(" + CURRENT_SELECTED_COMPONENT.image + ")";
        generateJSON();
    } else {
        alert("YOU MUST SELECT A COMPOMENT");
    }
}

//GENERATING MAP GRID
function generateMapGrid() {
    //CELL SIZE
    let cellWidth = Math.floor(document.getElementById("map").clientWidth) / GRID_SIZE.colls;
    let cellHeight = Math.floor(document.getElementById("map").clientHeight) / GRID_SIZE.rows;

    //BACKGROUND SIZE
    document.getElementById("mapBackground").style.width = cellWidth * GRID_SIZE.colls + "px";
    document.getElementById("mapBackground").style.height = cellHeight * GRID_SIZE.rows + "px";

    //CREATING CELLS
    for (let row = 0; row < GRID_SIZE.rows; row++) {
        for (let coll = 0; coll < GRID_SIZE.colls; coll++) {
            let cell = document.createElement("div");
            cell.style.width = cellWidth + "px";
            cell.style.height = cellHeight + "px";
            cell.style.left = (coll * cellWidth) + "px";
            cell.style.top = (row * cellHeight) + "px";
            cell.onclick = function () {
                cellClick(this)
            };
            cell.setAttribute("row", row);
            cell.setAttribute("coll", coll);
            cell.id = "cell" + row + ";" + coll;
            document.getElementById("map").appendChild(cell);
        }
    }
}

//GENERATE JSON
function generateJSON() {
    let converted = JSON.stringify(MAP_ARRAY, undefined, 3);
    document.getElementById("JSONTextarea").value = converted;
}

//LOAD JSON
function loadJSON() {
    let value = document.getElementById("JSONTextarea").value;
    try {
        let givenData = JSON.parse(value);
        MAP_ARRAY = givenData;
        for (let row = 0; row < MAP_ARRAY.length; row++) {
            for (let coll = 0; coll < MAP_ARRAY[row].length; coll++) {
                if (MAP_ARRAY[row][coll] != "XX") {
                    let cellDiv = document.getElementById("cell" + row + ";" + coll);
                    cellDiv.style.backgroundImage = "url(components/img" + MAP_ARRAY[row][coll] + ".png)";
                }
            }
        }
    } catch (e) {
        alert("WRONG JSON FORMAT")
    }
}
