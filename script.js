let moving = false
let game = "running"

const gridContainer = document.getElementById("grid-container")

function createGridItem(id){
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");
    gridContainer.appendChild(gridItem);
    gridItem.setAttribute("id",id);
}

for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
        let id = "element"+i+j;
        createGridItem(id);
    }
}

class Board {
    constructor(){
        this.grid = [
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ]
    }

    reset(){
        this.grid = [
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ] 
        var paras = document.getElementsByClassName('tile');

        while(paras[0]) {
            paras[0].parentNode.removeChild(paras[0]);
        }
        moving = false
        game = "running"
        document.getElementById("fade-overlay").classList.toggle("game-running")
        document.getElementById("fade-overlay").classList.toggle("game-end")
        document.getElementById("game-over-sign").classList.toggle("game-over-emphasise")
        document.getElementById("play-again-button").classList.toggle("expand-in")
        document.getElementById("play-again-button").classList.toggle("not-visible")
        document.getElementById("play-again-button").classList.toggle("visible")
        document.getElementById("play-again-button").classList.toggle("play-again-button-hover")
        board.generateTile()
        board.generateTile()        
        detectingKeyPresses = true
    }
    
    moveTileAnimation(tile){
        let currentPosClass = this.findClass(tile.tileElement,"position-")
        tile.tileElement.classList.remove(currentPosClass)
        let currentPos = currentPosClass.slice(-2)
        let newPositionClass = "position-" + (Number(currentPos.slice(0,1))+tile.direct[0]) + (Number(currentPos.slice(-1))+tile.direct[1]) 
        tile.tileElement.classList.add(newPositionClass)
    }
    
    
    compressTileAnimation(tile){
        let currentPosClass = this.findClass(tile.tileElement,"position-")
        let currentPos = currentPosClass.slice(-2)
        let currentValueClass = this.findClass(tile.tileElement,"tile-")
        
        let newRow = Number(currentPos.slice(0,1))+tile.direct[0]
        let newColumn =  Number(currentPos.slice(-1))+tile.direct[1]
        let replacedTileElement = this.getTileElement(newRow,newColumn)
        replacedTileElement.remove()
        
        let newPositionClass = "position-" + newRow + newColumn
        tile.tileElement.classList.remove(currentPosClass)
        tile.tileElement.classList.add(newPositionClass)
        
        let newValueClass = "tile-" + (tile.value*2)
        tile.tileElement.classList.remove(currentValueClass)
        tile.tileElement.classList.add(newValueClass)
        
        tile.tileElement.textContent = tile.value*2
    }
    
    findClass(element,target){
        const classes = element.classList;
        for (const className of classes) {
            if (className.startsWith(target)) {
                return className
            }
        }
    }
    display(){
        for (let row = 0; row < 4; row++){
            for (let column = 0; column < 4; column++){
                let gridItem = document.getElementById("element"+row+column)
                let gridValue = this.grid[row][column]
                gridItem.className = 'grid-item tile-'+gridValue
                if (gridValue!==0){
                    gridItem.textContent = gridValue
                } else {
                    gridItem.textContent = ""
                }
                
            }
        }
    }
    
    moveCycle(direct){
        this.moved=false
        this.direct = direct
        this.move()
        this.compress()
        this.move()
        if (this.moved){
            setTimeout(()=>this.generateTile(),150)
        } else {moving=false}
        
    }
    
    
    
    move(){
        if (this.direct==="ArrowUp"){
            for (let i = 0; i < 4; i++){
                for (let column = 0; column < 4; column++){
                    for (let row = 1; row < 4; row++){
                        if (this.grid[row][column] !== 0 && this.grid[row-1][column]===0){
                            this.grid[row-1][column] = this.grid[row][column]
                            this.grid[row][column] = 0
                            let tileElement = this.getTileElement(row,column)
                            this.moveTileAnimation({type:"move",direct:[-1,0],tileElement})
                            this.moved = true
                        }
                    }
                }
            }
        } else if (this.direct==="ArrowDown"){
            for (let i = 0; i < 4; i++){
                for (let column = 0; column < 4; column++){
                    for (let row = 0; row < 3; row++){
                        if (this.grid[row][column] !== 0 && this.grid[row+1][column]===0){
                            this.grid[row+1][column] = this.grid[row][column]
                            this.grid[row][column] = 0
                            let tileElement = this.getTileElement(row,column)
                            this.moveTileAnimation({type:"move",direct:[1,0],tileElement})
                            this.moved = true
                        }
                    }
                }
            }
        } else if (this.direct==="ArrowLeft"){
            for (let i = 0; i < 4; i++){
                for (let column = 1; column < 4; column++){
                    for (let row = 0; row < 4; row++){
                        if (this.grid[row][column] !== 0 && this.grid[row][column-1]===0){
                            this.grid[row][column-1] = this.grid[row][column]
                            this.grid[row][column] = 0
                            let tileElement = this.getTileElement(row,column)
                            this.moveTileAnimation({type:"move",direct:[0,-1],tileElement})
                            this.moved = true
                        }
                    }
                }
            }
        } else if (this.direct==="ArrowRight"){
            for (let i = 0; i < 4; i++){
                for (let column = 0; column < 3; column++){
                    for (let row = 0; row < 4; row++){
                        if (this.grid[row][column] !== 0 && this.grid[row][column+1]===0){
                            this.grid[row][column+1] = this.grid[row][column]
                            this.grid[row][column] = 0
                            let tileElement = this.getTileElement(row,column)
                            this.moveTileAnimation({type:"move",direct:[0,1],tileElement})
                            this.moved = true
                        }
                    }
                }
            }
        }
    }
    
    compress(direct){
        if (this.direct==="ArrowUp"){
            for (let column = 0; column < 4; column++){
                for (let row = 1; row < 4; row++){
                    if (this.grid[row][column] === this.grid[row-1][column] && this.grid[row][column] !== 0){
                        this.grid[row-1][column] = this.grid[row][column]*2
                            let value = this.grid[row][column]+0
                            this.grid[row][column] = 0
                            let tileElement = this.getTileElement(row,column)
                            this.compressTileAnimation({type:"compress",direct:[-1,0],tileElement,value})
                            this.moved = true
                        }
                    }
                }
            } else if (this.direct==="ArrowDown"){
                for (let column = 0; column < 4; column++){
                    for (let row = 2; row >= 0; row--){
                        if (this.grid[row][column] === this.grid[row+1][column] && this.grid[row][column] !== 0){
                            this.grid[row+1][column] = this.grid[row][column]*2
                            let value = this.grid[row][column]+0
                            this.grid[row][column] = 0
                            let tileElement = this.getTileElement(row,column)
                            this.compressTileAnimation({type:"compress",direct:[1,0],tileElement,value})
                            this.moved = true
                        }
                    }
                }
            } else if (this.direct==="ArrowLeft"){
                for (let column = 1; column < 4; column++){
                    for (let row = 0; row < 4; row++){
                        if (this.grid[row][column] === this.grid[row][column-1] && this.grid[row][column] !== 0){
                            this.grid[row][column-1] = this.grid[row][column]*2
                            let value = this.grid[row][column]+0
                            this.grid[row][column] = 0
                            let tileElement = this.getTileElement(row,column)
                            this.compressTileAnimation({type:"compress",direct:[0,-1],tileElement,value})
                            this.moved = true
                        }
                    }
                }
            } else if (this.direct==="ArrowRight"){
                for (let column = 2; column >= 0; column--){
                    for (let row = 0; row < 4; row++){
                        if (this.grid[row][column] === this.grid[row][column+1] && this.grid[row][column] !== 0){
                            this.grid[row][column+1] = this.grid[row][column]*2
                        let value = this.grid[row][column]+0
                        this.grid[row][column] = 0
                        let tileElement = this.getTileElement(row,column)
                        this.compressTileAnimation({type:"compress",direct:[0,1],tileElement,value})
                        this.moved = true
                    }
                }
            }            
        }
    }

    getTileElement(row,column){
        let classNamePosition = "position-"+row+column
        let tileElement = document.getElementsByClassName(classNamePosition)[0]
        if (document.getElementsByClassName(classNamePosition).length > 1){
            console.log("tile overlap error")
            throw "error"
        } else if (tileElement === undefined){
            throw "undefined tile element"
        }
        return tileElement
    }
    
    generateTile(){
        let emptySquares = []
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j]===0){
                    emptySquares.push(""+i+j)
                }
            }
        }
        let randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)]
        let randomNumber = Math.floor(Math.random()*10)+1
        let randomTile = (randomNumber<9) ? 2:4
        this.grid[randomIndex[0]][randomIndex[1]] = randomTile
        console.log("generating...")
        this.createTileElement(randomIndex,randomTile)  
    }

    createTileElement(index,value){
        const animateContainer = document.getElementById("animate")
        const tileElement = document.createElement("div");
        tileElement.className = "tile tile-"+value+" position-"+index[0]+index[1]
        tileElement.style.transform = "scale(0)"
        tileElement.textContent = value
        animateContainer.appendChild(tileElement);
        setTimeout(() => {
            tileElement.style.transform = "scale(1)";
        }, 10);
        if (document.getElementsByClassName("tile").length>=16){
            this.checkForDraw()
        }
        moving=false

    }

    checkForDraw(){
        for (let column = 0; column < 4; column++){
            for (let row = 1; row < 4; row++){
                if (
                    (this.grid[row][column] !== 0 && this.grid[row-1][column]===0) ||
                    (this.grid[row][column] === this.grid[row-1][column] && this.grid[row][column] !== 0)
                    ){
                        return false
                }
            }
        }
        for (let column = 1; column < 4; column++){
            for (let row = 0; row < 4; row++){
                if (
                    (this.grid[row][column] !== 0 && this.grid[row][column-1]===0) ||
                    (this.grid[row][column] === this.grid[row][column-1] && this.grid[row][column] !== 0)
                    ){
                        return false
                }
            }
        }
        game = "lose"
        document.getElementById("fade-overlay").classList.toggle("game-running")
        document.getElementById("fade-overlay").classList.toggle("game-end")
        document.getElementById("game-over-sign").classList.toggle("game-over-emphasise")
        setTimeout(()=>{
            document.getElementById("play-again-button").classList.toggle("expand-in")
            document.getElementById("play-again-button").classList.toggle("not-visible")
            document.getElementById("play-again-button").classList.toggle("visible")
            document.getElementById("play-again-button").classList.toggle("play-again-button-hover")
        },3000)
        return true

    }
}

let board = new Board()
board.generateTile()
board.generateTile()
//board.display2()

let detectingKeyPresses = true
document.addEventListener("keydown",function onEvent(event){
    if (moving===false && detectingKeyPresses){
        moving=true
        board.moveCycle(event.key)
    }if (game==="lose"&&detectingKeyPresses){
        detectingKeyPresses = false
    }
})

setTimeout(()=>{
    console.log("active")
    document.getElementById("play-again-button").addEventListener("click",function(){
        board.reset()
    })
},5000)