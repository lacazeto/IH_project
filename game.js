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
    self.intervalID = [null, null, null]; 
    self.hasTreasure = false;
    self.scale = 55;
    self.gridContainer = null;
    self.playerLives = 3;
    self.isPaused = false;
    self.flash = null;
    self.isCoinSound = false;
    self.backSound = null;
    self.isBackSound = true;
    self.victorySound = null;

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
        self.addTreasure(self.treasurePos);
        self.addPlayer(self.playerPos);
        self.addShark(self.shark1.position, self.shark2.position, self.shark3.position);
    };
    self.addPlayer = function (player) {
        self.gridLine[player[0]][player[1]] = "player";
    };
    self.addShark = function (shark1, shark2, shark3) {
        var arrSharks = [shark1, shark2, shark3];
        for (var i = 0; i < arrSharks.length; i++){
            self.gridLine[arrSharks[i][0]][arrSharks[i][1]] = "shark";
        }
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
        var sharkCounter = 0;
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
                        self.drawShark(actor, sharkCounter);
                        sharkCounter++;
                    }
                }
            }
        }
        return table;
    };

    //add grid to the DOM
    self.domDisplay = function () {
        self.gridContainer = self.parent.appendChild(self.domElement("div", "game-grid"));
        self.createBlankGrid();
        self.labelGrid();
        self.gridContainer.appendChild(self.drawGrid());
    };

    //updates elements positions and status on the DOM
    self.updateDomDisplay = function () {
        self.removeGrid();
        self.checkTreasure();
        self.checkForDeath(self.shark1.position, self.shark2.position, self.shark3.position);
        self.gameWon();
        self.createBlankGrid();
        self.labelGrid();
        self.moveSharks(self.shark1, self.shark2, self.shark3);
        self.gridContainer.appendChild(self.drawGrid());
    };

    //check if player is in possession of the treasure
    self.checkTreasure = function () {
        if (self.playerPos[0] === self.treasurePos[0] && self.playerPos[1] === self.treasurePos[1]) {
            self.hasTreasure = true;
            if(self.isCoinSound === false){
                var audio = new Audio("sounds/coin-sound.wav");
                audio.loop = false;
                audio.play();
                self.isCoinSound = true;
            }
        }
    };

    //set sharks new position, based on their direction
    self.moveSharks = function (shark1, shark2, shark3) {
        var arrSharks = [shark1, shark2, shark3];
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

    //add images to shark elements based on their direction
    self.drawShark = function (actor, counter) {
        var arrSharks = [self.shark1, self.shark2, self.shark3];
        switch (arrSharks[counter].direction) {
                case -1:
                    actor.style.backgroundImage = 'url("images/back-animated-shark-1.png")';
                    break;
                case 1:
                    actor.style.backgroundImage = 'url("images/animated-shark-1.png")';
                    break;
        }
    };

    //reset player to initial position
    self.resetDeadPlayer = function () {
        self.hasTreasure = false;
        self.isCoinSound = false;
        self.playerPos = [0, self.columns / 2];
    };

    //updates DOM elements when player looses life
    self.checkForDeath = function (shark1, shark2, shark3) {
        var arrSharks = [shark1, shark2, shark3];
        for (var i = 0; i < arrSharks.length; i++) {
            if (self.playerPos[0] === arrSharks[i][0] && self.playerPos[1] === arrSharks[i][1]) {
                self.playerLives--;
                self.isPaused = true;
                self.updateLifesCounter();
                self.gameOver();
                self.flashScreen();
                if(self.playerLives > 0){
                    new Audio("sounds/drowning-choking.wav").play();
                }
                setTimeout(function () {
                    self.isPaused = false;
                    self.resetDeadPlayer();
                }, 2500);
            }
        }
    };

    //update lives counter
    self.updateLifesCounter = function () {
        var livesContainer = document.getElementById("lives");
        livesContainer.innerHTML = self.playerLives;
    };

    //delete grid from the DOM
    self.removeGrid = function () {
        var node = document.getElementsByClassName("game-grid");
        var nodeChild = document.getElementsByClassName("background");
        node[0].removeChild(nodeChild[0]);
    };

    //updates player position based on user input
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

    //flashes screen
    self.flashScreen = function () {
        self.flash = document.getElementsByTagName("body");
        self.flash[0].firstChild.className = "wrapper-game, flash";
        setTimeout(function () {
            self.flash[0].firstChild.className = "wrapper-game";
        }, 50);
    };

    //verify if game is over
    self.gameOver = function () {
        if (self.playerLives < 1) {
            clearInterval(self.intervalID);
            self.backSound.pause();
            var gameOverImage = document.getElementById("win-game-over");
            self.intervalID[1] =  setInterval(function () {
                gameOverImage.src ="images/Game_Over.png";
                gameOverImage.style.visibility = "inherit";
                setTimeout(function () {
                    gameOverImage.style.visibility = "hidden";
                },500);
            },1000);
            new Audio("sounds/game-over.wav").play();
            clearInterval(newLevel.intervalID[0]);
            document.removeEventListener("keydown", self.movePlayer);
        }
    };

    //verify if game is won
    self.gameWon = function () {
        if (self.playerPos[0] === 0 && self.playerPos[1] <= 5 && self.hasTreasure === true) {
            var gameWon = document.getElementById("win-game-over");
            self.backSound.pause();
            gameWon.src = "images/victory.gif";
            gameWon.style.width = "auto";
            gameWon.style.visibility = "inherit";
            self.victorySound = new Audio("sounds/Victory.wav");
            self.victorySound.play();
            clearInterval(self.intervalID[0]);
            document.removeEventListener("keydown", self.movePlayer);
        }
    };

    //scale the DOM's gaming grid based on the window height
    self.rescale = function () {
        var table = document.getElementById("game");
        var width = window.innerWidth;
        var height = window.innerHeight;
        if (width > height){
            self.scale = (0.8/10) *  height;

        }
        else {
            self.scale = (0.8/10) *  width;
        }      
    };

    self.clearIntervals = function (){
        for(var interval = 0; interval < self.intervalID.length; interval++) {
            clearInterval(self.intervalID[interval]);
        }
    };

    self.startGame = function () {
        self.domDisplay();
        self.backSound = new Audio ("sounds/underwater-bubbles.mp3");
        self.backSound.loop = "true";
        self.backSound.play();
        self.intervalID[0] = setInterval(function () {
            if (!self.isPaused) {
                self.updateDomDisplay();
            }
        }, 100);
        document.addEventListener("keydown", self.movePlayer);
        window.onresize = self.rescale;
    };

}