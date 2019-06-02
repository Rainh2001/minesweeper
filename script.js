var canvas;
var ctx;
var board = [];
var tile_radio;
var bomb_slider;
const hue = [
    "#00d4ff", "#10ff00", "#ff0000", "#1000ff",
    "#ff00ee", "#ff7b00", "#f6ff00", "#8c00ff"
];
var game = false;

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
        ctx.fillRect(
            this.x + difference/2*this.width, // x position
            this.y + difference/2*this.width, // y position
            this.width*(1-difference), // width
            this.width*(1-difference) // height
        );
        ctx.closePath();
    }
    reveal(){
        this.clicked = true;
        if(!this.flagged){
            let difference = 0.1;
                ctx.beginPath();
                ctx.fillStyle = "white";
                ctx.fillRect(
                    this.x + difference/2*this.width, // x position
                    this.y + difference/2*this.width, // y position
                    this.width*(1-difference), // width
                    this.width*(1-difference) // height
                );
            if(!this.bomb){
                ctx.fillStyle = this.value === 0 ? "white" : hue[this.value-1];
                ctx.font = `${this.width*0.7}px Arial`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(
                    this.value,
                    this.x + this.width/2, 
                    this.y + this.width/2, 
                );
            } else {
                let bombIcon = new Image();
                bombIcon.src = "assets/bomb.png";
                let width = this.width;
                let pos = {x:this.x, y:this.y};
                bombIcon.onload = function(){
                    ctx.drawImage(
                        bombIcon, 
                        pos.x + difference/2*width, 
                        pos.y + difference/2*width, 
                        width*(1-difference), 
                        width*(1-difference) 
                    );
                }
                ctx.closePath();
                return true;                                                                                                                                                                                  
            }
            ctx.closePath();
            return false;
        }
    }
    flag(){
        this.flagged = !this.flagged;
        if(this.flagged){
            let flagIcon = new Image();
            let width = this.width;
            let pos = {x:this.x, y:this.y};
            flagIcon.src = "assets/flag.png";
            flagIcon.onload = function(){
                let difference = 0.2;
                ctx.beginPath();
                ctx.drawImage(
                    flagIcon, 
                    pos.x + difference/2*width, 
                    pos.y + difference/2*width, 
                    width*(1-difference), 
                    width*(1-difference) 
                );
                ctx.closePath();
            }
        } else {
            this.draw();
        }
    }
}

window.onload = function(){
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
    canvas.setAttribute("width", 600);
    canvas.setAttribute("height", 600);
    canvas.addEventListener("click", getCursor);
    canvas.addEventListener("contextmenu", getCursor);
    canvas.oncontextmenu = function(){
        return false;
    } 
    tile_radio = document.getElementsByName("tiles");
    bomb_slider = document.getElementById("bomb-range");
}

function setupBoard(tiles, width){
    board = [];
    for(let i = 0; i < tiles; i++){
        board.push([]);
        for(let j = 0; j < tiles; j++){
            board[i].push(new Tile(j*width, i*width, width));
            board[i][j].draw();
        }
    }
}

function getTiles(){
    for(let i = 0; i < tile_radio.length; i++){
        if(tile_radio[i].checked){
            return tile_radio[i].value;
        }
    }
}

function getTileWidth(){
    return canvas.height/getTiles();
}

function updateBoard(){
    game = true;
    let tiles = getTiles();
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
                        let posY = rand1-1 + j;
                        let posX = rand2-1 + x;
                        if(!(j === 1 && x === 1)){                 
                            if(!(posY >= tiles || posY < 0)){
                                if(!(posX >= tiles || posX < 0)){
                                    if(!(board[posY][posX].bomb)){
                                        board[posY][posX].value++;
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
}

function getCursor(event){
    if(game){
        let width = getTileWidth();
        let pos = {
            x: Math.floor((event.pageX - this.offsetLeft)/width),
            y: Math.floor((event.pageY - this.offsetTop)/width)
        }
        if(event.which){
            if(event.which === 1){
                revealTile(pos);
            }else{
                if(!board[pos.y][pos.x].clicked){
                    board[pos.y][pos.x].flag();
                }
            }
        }else {
            if(event.button === 0){
                revealTile(pos);
            }else{
                if(!board[pos.y][pos.x].clicked){
                    board[pos.y][pos.x].flag();
                }
            }
        }
    }
}

function revealTile(pos){
    let tile = board[pos.y][pos.x];
    if(!(tile.clicked)){
        if(tile.reveal()){
            game = false;
            for(let i = 0; i < board.length; i++){
                for(let j = 0; j < board.length; j++){
                    if(board[i][j].bomb){
                        board[i][j].reveal();
                    }
                }
            }
        }
    }
}
