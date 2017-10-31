'use strict';

function Level(gridElement) {
    var self = this;
    self.rows = 10;
    self.parent = gridElement;
    self.columns = 10;
    self.playerPos = [0, 5];
    self.treasurePos = [9, Math.floor(Math.random() * (9 - 1) + 1)];
    self.shark1Pos = [Math.floor(Math.random() * (4 - 1) + 1), 9];
    self.shark2Pos = [Math.floor(Math.random() * (8 - 5) + 5), 9];
    self.gridLine = [];
    self.intervalID = null;
    self.scale = 50;
    self.gridContainer = null;

    //create a DOM element and assign its class
    self.domElement = function (name, className) {
        var element = document.createElement(name);
        if (className) {
            element.className = className;
        }
        return element;
    };

    //add empty elements to the grid
    self.createBlankGrid = function (){
        for(var gridCount = 0; gridCount < self.columns; gridCount++){
            self.gridLine[gridCount] = [];
        }
    };

     //labeling level's grid cells to display actors locations
     self.labelGrid = function () {
        for (var x = 0; x < self.columns; x++) {
            var fieldType = null;
            for (var y = 0; y < self.rows; y++) {
                if (x === 0 && y === 5) {
                    self.gridLine[x].push("player");
                }
                else{
                    self.gridLine[x].push(fieldType);
                }
            }
        }
        self.addShark(self.shark1Pos);
        self.addShark(self.shark2Pos);
        self.addTreasure(self.treasurePos);

    };
    self.addShark = function (shark) {
        self.gridLine[shark[0]][shark[1]] = "shark";
    };
    self.addTreasure = function (treasure) {
        self.gridLine[treasure[0]][treasure[1]] = "treasure";
    };

    //draw game's table (grid)
    self.drawGrid = function () {
        var table = self.domElement("table", "background");
        table.style.width = 10 * self.scale + "px";
        var row;
        var element;

        for (var x = 0; x < self.columns; x++) {
            row = table.appendChild(self.domElement("tr"));
            row.style.height = self.scale + "px";
            for (var y = 0; y < self.rows; y++) {
                element = row.appendChild(self.domElement("td"));
                if(self.gridLine[x][y] !== null){
                    var actor = element.appendChild(self.domElement("div", "actor " + self.gridLine[x][y]));
                    actor.style.width = self.scale + "px";
                    actor.style.height = self.scale + "px";
                    actor.style.left = self.scale + "px";
                    actor.style.top = self.scale + "px"; 
                }
            }
        }

        return table;
    };

    self.domDisplay = function () {
        self.gridContainer = self.parent.appendChild(self.domElement("div", "game-grid"));
        self.createBlankGrid();
        self.labelGrid();
        self.gridContainer.appendChild(self.drawGrid());
    };

    self.moveSharks = function(){
        var add = -1;
        if(self.shark1Pos[0] === 0){
            add = +1;
        }
        if(self.shark1Pos[0] === 9){
            add = -1;
        }
        self.shark1Pos[0] += add;
        self.shark2Pos[0] += add;
    };

   /*  self.updateDomDisplay = function(){
        
        self.moveSharks();
        self.gridContainer.appendChild(self.drawGrid());
    }; */

    self.startGame = function(){
        self.domDisplay();
        self.intervalID = setInterval(self.updateDomDisplay, 500);
    };

}