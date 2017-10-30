function Level() {
    this.rows = 10;
    this.columns = 10;
    this.playerPos = [0, 5];
    this.shark1Pos = [9, Math.floor(Math.random() * (4 - 1) + 1)];
    this.shark2Pos = [9, Math.floor(Math.random() * (8 - 5) + 5)];
    this.gridLine = [];
    this.scale = 20;

    //create DOM element and assign a class
    this.domElement = function (name, className) {
        var element = document.createElement(name);
        if (className) {
            element.className = className;
        }
        return element;
    };
     //labeling level's grid cells to display actors locations
     this.labelGrid = function () {
        for (var y = 0; y < this.columns; y++) {
            var fieldType = null;
            for (var x = 0; x < this.rows; x++) {
                this.gridLine.push(fieldType);
                if (x === 0 && y === 5) {
                    this.gridLine.push("player");
                }
            }
        }
        this.addShark(this.shark1Pos);
        this.addShark(this.shark2Pos);

    };
    this.addShark = function (shark) {
        this.gridLine[shark[0] * shark[1]] = "shark";
        return true;
    };
    //draw game's table (grid)
    this.drawGrid = function () {
        var table = this.domElement("table", "background");
        table.style.width = 10 * this.scale + "px";
        var row;
        for(gridCount = 0; gridCount < this.gridLine.length; gridCount++){
            if(gridCount % 10 === 0){
                row = table.appendChild(this.domElement("tr"));
                row.style.height = this.scale + "px";
            }
            row.appendChild(this.domElement("td"));

            if(this.gridLine[gridCount] !== null){
                this. 
            }
        }
        return table;
    };
    this.domDisplay = function (parent, level) {
        var gridContainer = parent.appendChild(this.domElement("div", "game-grid"));
        this.labelGrid();
        gridContainer.appendChild(level.drawGrid());
        var actor = this.domElement("div");
        for (item = 0; item < level.gridLine.length; item++) {
            if (item !== null) {
                var rect = gridContainer.appendChild(this.domElement("div", "actor " + level.gridLine[item]));
                rect.style.width = this.scale + "px";
                rect.style.height = this.scale + "px";
                rect.style.left = this.scale + "px";
                rect.style.top = this.scale + "px";
            }
        }
    }
}

var newLevel = new Level();

window.onload = function () {
    var grid = document.getElementsByClassName("game");
    newLevel.domDisplay(grid[0], newLevel);
};