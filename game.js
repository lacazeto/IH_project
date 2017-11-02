'use strict';

function Level(gridElement) {
    var self = this;
    self.rows = 10;
    self.parent = gridElement;
    self.columns = 10;
    self.playerPos = [0, self.columns / 2];
    self.treasurePos = [self.rows - 1, Math.floor(Math.random() * (9 - 1) + 1)];
    self.shark1 = {
        position: [Math.floor(Math.random() * (3 - 1) + 1), Math.floor(Math.random() * (9 - 1) + 1)],
        direction: -1
    }
    self.shark2 = {
        position: [Math.floor(Math.random() * (6 - 4) + 4), Math.floor(Math.random() * (9 - 1) + 1)],
        direction: -1
    }
    self.shark3 = {
        position: [Math.floor(Math.random() * (8 - 7) + 7), Math.floor(Math.random() * (9 - 1) + 1)],
        direction: -1
    }
    self.gridLine = [];
    self.intervalID = null;
    self.hasTreasure = false;
    self.scale = 55;
    self.gridContainer = null;
    self.playerLives = 3;
    self.isPaused = false;
    self.flash = null;

    //create a DOM element and assign its class
    self.domElement = function (name, className) {
        var element = document.createElement(name);
        if (className) {
            element.className = className;
        }
        return element;
    };

    //add empty elements to the grid
    self.createBlankGrid = function () {
        for (var gridCount = 0; gridCount < self.rows; gridCount++) {
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
        self.addShark(self.shark1.position);
        self.addShark(self.shark2.position);
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
                if (self.gridLine[x][y] !== null) {
                    var actor = element.appendChild(self.domElement("div", "actor " + self.gridLine[x][y]));
                    actor.style.width = self.scale + "px";
                    actor.style.height = self.scale + "px";
                    actor.style.left = self.scale + "px";
                    actor.style.top = self.scale + "px";
                    if (actor.className === "actor treasure") {
                        switch (self.hasTreasure) {
                            case true:
                                actor.style.backgroundImage = 'url("images/treasur_emp.png")';
                                break;
                            case false:
                                actor.style.backgroundImage = 'url("images/treasur_full.png")';
                                break;
                        }
                    }
                    if (actor.className === "actor shark") {
                        self.drawShark(actor);
                    }
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

    self.updateDomDisplay = function () {
        self.removeGrid();
        self.checkTreasure();
        self.checkForDeath(self.shark1.position, self.shark2.position);
        self.gameWon();
        self.createBlankGrid();
        self.labelGrid();
        self.moveSharks(self.shark1, self.shark2);
        self.gridContainer.appendChild(self.drawGrid());
    };

    self.checkTreasure = function () {
        if (self.playerPos[0] === self.treasurePos[0] && self.playerPos[1] === self.treasurePos[1]) {
            self.hasTreasure = true;
        }
    };

    self.moveSharks = function (shark1, shark2) {
        var arrSharks = [shark1, shark2];
        for (var i = 0; i < arrSharks.length; i++) {
            if (arrSharks[i].position[1] === 0) {
                arrSharks[i].direction = +1;
            }
            if (arrSharks[i].position[1] === (self.rows - 1)) {
                arrSharks[i].direction = -1;
            }
            arrSharks[i].position[1] = arrSharks[i].position[1] + arrSharks[i].direction;
        }
    };

    self.drawShark = function (actor) {
        var arrSharks = [self.shark1, self.shark2];
        for (var i = 0; i < arrSharks.length; i++) {
            switch (arrSharks[i].direction) {
                case -1:
                    actor.style.backgroundImage = 'url("images/back-animated-shark-1.png")';
                    break;
                case 1:
                    actor.style.backgroundImage = 'url("images/animated-shark-1.png")';
                    break;
            }
        }
    };

    self.resetDeadPlayer = function () {
        self.hasTreasure = false;
        self.playerPos = [0, self.columns / 2];
    };

    self.checkForDeath = function (element1, element2) {
        var arrElements = [element1, element2];
        for (var i = 0; i < arrElements.length; i++) {
            if (self.playerPos[0] === arrElements[i][0] && self.playerPos[1] === arrElements[i][1]) {
                self.playerLives--;
                self.isPaused = true;
                self.updateLifesCounter();
                self.gameOver();
                self.flashScreen();
                setTimeout(function () {
                    self.isPaused = false;
                    self.resetDeadPlayer();
                }, 1000);
            }
        }
    };

    self.updateLifesCounter = function () {
        var livesContainer = document.getElementById("lives");
        livesContainer.innerHTML = self.playerLives;
    };

    self.removeGrid = function () {
        var node = document.getElementsByClassName("game-grid");
        var nodeChild = document.getElementsByClassName("background");
        node[0].removeChild(nodeChild[0]);
    };

    self.movePlayer = function (event) {
        switch (event.keyCode) {
            case 37:
                if (self.playerPos[1] > 0) {
                    self.playerPos[1] -= 1;
                }
                break;
            case 38:
                if (self.playerPos[0] > 0) {
                    self.playerPos[0] -= 1;
                }
                break;
            case 39:
                if (self.playerPos[1] < self.rows - 1) {
                    self.playerPos[1] += 1;
                }
                break;
            case 40:
                if (self.playerPos[0] < self.columns - 1) {
                    self.playerPos[0] += 1;
                }
                break;
        }
    };

    self.flashScreen = function () {
        self.flash = document.getElementsByTagName("body");
        self.flash[0].firstChild.className = "wrapper-game, flash";
        setTimeout(function () {
            self.flash[0].firstChild.className = "wrapper-game";
        }, 50);
    };

    self.gameOver = function () {
        if (self.playerLives < 1) {
            clearInterval(self.intervalID);
            alert("GAME OVER");
        }
    };

    self.gameWon = function () {
        if (self.playerPos[0] === 0 && self.playerPos[1] <= 5 && self.hasTreasure === true) {
            clearInterval(self.intervalID);
            alert("YOU WON");
        }
    };

    self.rescale = function () {
        var table = document.getElementById("game");
        var tableHeight = table.offsetHeight;
        var width = window.innerWidth;
        var height = window.innerHeight;
        if (tableHeight <= 0.8 * height) {
            self.scale = width / 12.78;
        } else {
            self.scale -= 3;
        }
    };

    self.startGame = function () {
        self.domDisplay();
        self.intervalID = setInterval(function () {
            if (!self.isPaused) {
                self.updateDomDisplay();
            }
        }, 100);
        document.addEventListener("keydown", self.movePlayer);
        window.onresize = self.rescale;
    };

}