'use strict';

var newLevel = null;

function reset () {
    newLevel.clearIntervals();
    init();
}

function drawLandingPage() {
    document.body.innerHTML = 
    `<div class='wrapper-landing'>
        <header>
            <h1 class='title'>TREASURE HUNTER</h1>
        </header>
        <main class='central-container'>
            <div class='img-container'>
                <img class='img-splash' id='img-diver' src='images/owd-diver-min.png' alt='scuba-diver'>
            </div>
            <div class='img-container'>
                <img class='img-splash' src='images/great-white-shark-min.png' alt='shark'>
            </div>
        </main>
        <footer class='splash-footer'>
            <button class='btn btn-play'>
                <i class='fa fa-caret-square-o-right' aria-hidden='true'></i> Play
            </button>
        </footer>
    </div>`;
}

function drawGamingPage() {
    setTimeout(function () {
        document.body.innerHTML = 
        `<div class="wrapper-game">
            <header class="stats-btns">Lives: 
                <div id="lives">3</div>
                <div><button id="btn">Main Screen</button></div>
            </header>
            <main id="game">
                    <img id='win-game-over' src='images/Game_Over.png' alt='shark'>
            </main>
        </div>`;
        var grid = document.getElementById("game");
        newLevel = new Level(grid);
        newLevel.startGame();
        var resetBtn = document.getElementById("btn");
        resetBtn.addEventListener("click", reset);
    }, 1000);
}

function init() {
    drawLandingPage();
    var button = document.getElementsByClassName("btn-play");
    button[0].addEventListener("click", drawGamingPage);
}

document.addEventListener("DOMContentLoaded", init);