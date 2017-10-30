function Level(){
    this.rows = 10;
    this.columns = 10;
    this.playerPos = [0,5];
    this.shark1Pos = [9, Math.floor(Math.random() * (4 - 1) + 1)];
    this.shark2Pos = [9, Math.floor(Math.random() * (8 - 5) + 5)];
    this.gridLine = new Array(100);


    //labeling level's grid cells to identify elements location
    for (var y = 0; y < this.columns; y++) {
        var fieldType = null;
        for (var x = 0; x < this.rows; x++) {
            this.gridLine.push(fieldType);
            if(x === 0 && y === 5){
                this.gridLine.push("player");
            }
        }
    }
}

Level.prototype.addShark = function(shark) {
    this.gridLine[shark[0] * shark[1]] = "shark";
    return true;
};

var level = new Level();

//create DOM element and assign a class
function element(name, className) {
    var element = document.createElement(name);
    if (className){
        element.className = className;
    }
    return element;
}

//draw grid table element
var scale = 20;

Level.prototype.drawGrid = function() {
    var table = element("table", "background");
    table.style.width = 10 * scale + "px";
    level.gridLine.forEach(function(row) {
        var rowElt = table.appendChild(element("tr"));
        rowElt.style.height = scale + "px";
        row.forEach(function(type) {
            rowElt.appendChild(element("td", type));
        });
    });
    return table;
}

function domDisplay(parent, level) {
    var wrap = parent.appendChild(element("div", "game"));
    var level = level;
    wrap.appendChild(drawGrid());
}