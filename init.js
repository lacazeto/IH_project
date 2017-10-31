var newLevel = null;

function init() {
    var grid = document.getElementById("game");
    newLevel = new Level(grid);
    console.log("doc loaded");
    newLevel.startGame();
}

document.addEventListener("DOMContentLoaded", init);
