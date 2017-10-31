'use strict';

function Level() {
    this.rows = 10;
    this.columns = 10;
    this.playerPos = [0, 5];
    this.treasurePos = [9, Math.floor(Math.random() * (9 - 1) + 1)];
    this.shark1Pos = [Math.floor(Math.random() * (4 - 1) + 1), 9];
    this.shark2Pos = [Math.floor(Math.random() * (8 - 5) + 5), 9];
    this.gridLine = [];
    this.scale = 50;

    //create a DOM element and assign its class
    this.domElement = function (name, className) {
        var element = document.createElement(name);
        if (className) {
            element.className = className;
        }
        return element;
    };

    //add empty elements to the grid
    this.createBlankGrid = function (){
        for(var gridCount = 0; gridCount < this.columns; gridCount++){
            this.gridLine[gridCount] = [];
        }
    };

     //labeling level's grid cells to display actors locations
     this.labelGrid = function () {
        for (var x = 0; x < this.columns; x++) {
            var fieldType = null;
            for (var y = 0; y < this.rows; y++) {
                if (x === 0 && y === 5) {
                    this.gridLine[x].push("player");
                }
                else{
                    this.gridLine[x].push(fieldType);
                }
            }
        }
        this.addShark(this.shark1Pos);
        this.addShark(this.shark2Pos);
        this.addTreasure(this.treasurePos);

    };
    this.addShark = function (shark) {
        this.gridLine[shark[0]][shark[1]] = "shark";
    };
    this.addTreasure = function (treasure) {
        this.gridLine[treasure[0]][treasure[1]] = "treasure";
    };

    //draw game's table (grid)
    this.drawGrid = function () {
        var table = this.domElement("table", "background");
        table.style.width = 10 * this.scale + "px";
        var row;
        var element;

        for (var x = 0; x < this.columns; x++) {
            row = table.appendChild(this.domElement("tr"));
            row.style.height = this.scale + "px";
            for (var y = 0; y < this.rows; y++) {
                element = row.appendChild(this.domElement("td"));
                if(this.gridLine[x][y] !== null){
                    var actor = element.appendChild(this.domElement("div", "actor " + this.gridLine[x][y]));
                    actor.style.width = this.scale + "px";
                    actor.style.height = this.scale + "px";
                    actor.style.left = this.scale + "px";
                    actor.style.top = this.scale + "px"; 
                }
            }
        }

        return table;
    };

    this.domDisplay = function (parent, level) {
        var gridContainer = parent.appendChild(this.domElement("div", "game-grid"));
        this.createBlankGrid();
        this.labelGrid();
        gridContainer.appendChild(level.drawGrid());
    };

    this.animateSharks = function(){


    };

}

var newLevel = new Level();

window.onload = function () {
    var grid = document.getElementsByClassName("game");
    newLevel.domDisplay(grid[0], newLevel);
};