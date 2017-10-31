var newLevel = null;

function init() {
    var grid = document.getElementById("game");
    newLevel = new Level(grid);
    newLevel.startGame();
}

document.addEventListener("DOMContentLoaded", init);