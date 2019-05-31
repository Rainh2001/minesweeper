var canvas;
var ctx;
var board = [];
var tile_radio;
var bomb_slider;

class Tile {
    constructor(x, y, width){
        this.x = x;
        this.y = y;
        this.width = width;
        this.value = 0;
        this.flagged = false;
        this.bomb = false;
        this.value = 0;
        this.clicked = false;
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle = "#bfbfbf";
        ctx.fillRect(this.x, this.y, this.width, this.width);
        ctx.fillStyle = "#e5e5e5";
        let difference = 0.1;
        ctx.fillRect(this.x + difference/2*this.width, this.y + difference/2*this.width, this.width*(1-difference), this.width*(1-difference));
        ctx.closePath();
    }
}

window.onload = function(){
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
    canvas.setAttribute("width", 600);
    canvas.setAttribute("height", 600);

    tile_radio = document.getElementsByName("tiles");
    tile_radio.forEach(x => x.addEventListener("click", updateBoard));

    bomb_slider = document.getElementById("bomb-range");
    bomb_slider.addEventListener("click", updateBoard);

    canvas.addEventListener("click", getCursor);
    bomb_slider.value = bomb_slider.getAttribute("min");
    bomb_slider.click();
}

function setupBoard(tiles, width){
    for(let i = 0; i < tiles; i++){
        board.push([]);
        for(let j = 0; j < tiles; j++){
            board[i].push(new Tile(j*width, i*width, width));
            board[i][j].draw();
        }
    }
}

function updateBoard(){
    board = [];
    for(let i = 0; i < tile_radio.length; i++){
        if(tile_radio[i].checked){
            var tiles = tile_radio[i].value;
        }
    }
    bomb_slider.setAttribute("min", Math.round(Math.pow(tiles, 2)*0.2));
    bomb_slider.setAttribute("max", Math.round(Math.pow(tiles, 2)*0.6));
    let bombs = bomb_slider.value;

    setupBoard(tiles, canvas.width/tiles);

    for(let i = 0; i < bombs; i++){
        let bombSet = false;
        while(!bombSet){
            let rand1 = Math.floor(Math.random()*tiles);
            let rand2 = Math.floor(Math.random()*tiles);
            if(!board[rand1][rand2].bomb){
                for(let j = 0; j < 3; j++){
                    for(let x = 0; x < 3; x++){
                        if(!(j === 1 && x === 1)){
                            if(!(rand1-1 + j*tiles >= tiles || rand1-1 + j*tiles < 0)){
                                if(!(rand2-1 + x >= tiles || rand2-1 + x < 0)){
                                    if(!(board[rand1-1 + j*tiles][rand2-1 + x].bomb)){
                                        board[rand1-1 + j*tiles][rand2-1 + x].value++;
                                    }
                                }
                            }  
                        }
                    }
                }
                board[rand1][rand2].bomb = true;
                board[rand1][rand2].value = 0;
                bombSet = true;
            }
        }
    }

    let valueArr = [];
    let bombArr = [];
    for(let i = 0; i < tiles; i++){
        valueArr.push([]);
        bombArr.push([]);
        for(let j = 0; j < tiles; j++){
            valueArr[i].push(board[i][j].value);
            bombArr[i].push(board[i][j].bomb);
        }
    }
    console.log(valueArr);
    console.log(bombArr);
}

function getCursor(event){
    let pos = {
        x: event.pageX - this.offsetLeft,
        y: event.pageY - this.offsetTop
    }
    console.log(pos);
}