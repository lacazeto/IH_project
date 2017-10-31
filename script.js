'use strict';

function drawLandingPage(){
    document.body.innerHTML = "<header><h1 class='title'>TREASURE HUNTER</h1></header><main><div class='central-container'><div class='img-container'><img class='img-splash' id='img-diver' src='images/owd-diver-min.png' alt='scuba-diver'></div><div class='img-container'><img class='img-splash' src='images/great-white-shark-min.png' alt='shark'></div></div></main><footer class='splash-footer'><button class='btn-play'><i class='fa fa-caret-square-o-right' aria-hidden='true'></i> Play</button></footer>";    
}

function drawGamingPage(){
    setTimeout(function(){
        document.body.innerHTML = "";
        document.body.innerHTML = "<header><div class='score'></div><div class='lives'></div></header><main class='game'></main><footer><div class='btn-reset'></div></footer>"
        var grid = document.getElementsByClassName("game");
        newLevel.domDisplay(grid[0], newLevel);
    }, 1000);
}

function init(){
    drawLandingPage();
    var button = document.getElementsByClassName("btn-play");
    button[0].addEventListener("click", drawGamingPage);
}

window.onload = function () {
    init();
};