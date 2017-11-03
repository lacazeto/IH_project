'use strict';

var newLevel = null;

function reset () {
    newLevel.clearIntervals();
    newLevel.backSound.pause();
    if(newLevel.victorySound !== null){
        newLevel.victorySound.pause();
    }
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

function mute(){
    var muteBtn = document.getElementById("btn-mute");
    if(newLevel.isBackSound){
        newLevel.backSound.pause();
        newLevel.isBackSound = false;
        muteBtn.innerHTML = "Unmute";
    }
    else{
        newLevel.backSound.play();
        newLevel.isBackSound = true;
        muteBtn.innerHTML = "Mute";
    }
}

function drawGamingPage() {
    setTimeout(function () {
        document.body.innerHTML = 
        `<div class="wrapper-game">
            <header class="stats-btns">
                <div class="stats-btns">
                <button id="btn-mute">Mute</button>
                Lives:
                    <div id="lives">3</div>
                    <div><button id="btn-reset">Main Screen</button></div>
                </div>        
            </header>
            <main id="game">
                    <img id='win-game-over' src='images/Game_Over.png' alt='shark'>
            </main>
        </div>`;
        var grid = document.getElementById("game");
        newLevel = new Level(grid);
        newLevel.startGame();
        var resetBtn = document.getElementById("btn-reset");
        var muteBtn = document.getElementById("btn-mute");
        resetBtn.addEventListener("click", reset);
        muteBtn.addEventListener("click", mute);
    }, 1000);
}

function init() {
    drawLandingPage();
    var button = document.getElementsByClassName("btn-play");
    button[0].addEventListener("click", drawGamingPage);
}

document.addEventListener("DOMContentLoaded", init);