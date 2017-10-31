'use strict';

function Level(gridElement) {
    var self = this;
    self.rows = 10;
    self.parent = gridElement;
    self.columns = 10;
    self.playerPos = [0, self.columns/2];
    self.treasurePos = [self.rows-1, Math.floor(Math.random() * (9 - 1) + 1)];
    self.shark1Pos = [Math.floor(Math.random() * (4 - 1) + 1), (self.rows-1)];
    self.shark2Pos = [Math.floor(Math.random() * (8 - 5) + 5), (self.rows-1)];
    self.gridLine = [];
    self.intervalID = null;
    self.hasTreasure = false;
    self.scale = 60;
    self.gridContainer = null;
    self.direction = -1;

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
        for(var gridCount = 0; gridCount < self.rows; gridCount++){
            self.gridLine[gridCount] = [];
        }
    };

     //labeling level's grid cells to display actors locations
     self.labelGrid = function () {
        for (var x = 0; x < self.columns; x++) {
            var fieldType = null;
            self.gridLine[x].push(fieldType);
        }
        self.addPlayer(self.playerPos);
        self.addShark(self.shark1Pos);
        self.addShark(self.shark2Pos);
        self.addTreasure(self.treasurePos);

    };
    self.addPlayer = function (player) {
        self.gridLine[player[0]][player[1]] = "player";
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

    self.updateDomDisplay = function(){
        self.removeGrid();
        self.moveSharks();
        self.createBlankGrid();
        self.labelGrid();
        self.gridContainer.appendChild(self.drawGrid());
    };

    self.checkTreasure = function(){

    };

    self.moveSharks = function(){
        if(self.shark1Pos[1] === 0){
            self.direction = +1;
        }
        if(self.shark1Pos[1] === (self.rows-1)){
            self.direction = -1;
        }
        self.shark1Pos[1] += self.direction;
        self.shark2Pos[1] += self.direction*1,2;
    };

    self.removeGrid = function(){
        var node = document.getElementsByClassName("game-grid");
        var nodeChild = document.getElementsByClassName("background");
        node[0].removeChild(nodeChild[0]);
    }

    self.movePlayer = function(event){
        switch (event.keyCode){
            case 37:
                if (self.playerPos[1] > 0){
                    self.playerPos[1] -= 1;
                }
            break;
            case 38:
                if (self.playerPos[0] > 0){
                    self.playerPos[0] -= 1;
                }
            break;
            case 39:
                if (self.playerPos[1] < self.rows-1){
                    self.playerPos[1] += 1;
                }
            break;
            case 40:
            if (self.playerPos[0] < self.columns-1){
                self.playerPos[0] += 1;
            }
            break;
        }
    };

    self.check 

    self.startGame = function(){
        self.domDisplay();
        self.intervalID = setInterval(self.updateDomDisplay, 100);
        document.addEventListener("keydown", self.movePlayer);
    };

}