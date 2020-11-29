const gameBoard = document.querySelector('.game-board');
console.log(gameBoard)


// Creating game engine, which defines how often game is updated

let lastUpdateTime = 0;
const SNAKE_SPEED = 1;

function gameEngine(currentTime){
    window.requestAnimationFrame(gameEngine);
    const timeSinceLastUpdate = (currentTime - lastUpdateTime)/1000;
    if (timeSinceLastUpdate < 1 / SNAKE_SPEED){
        return
    }
    lastUpdateTime = currentTime;
    console.log(currentTime);

    // updateSnake();

    renderSnake(gameBoard);
}

window.requestAnimationFrame(gameEngine);


// RENDERING AND UPDATING SNAKE

const snakeBody = [
    {x:11, y:10},
    {x:11, y:11},
    {x:11, y:12}
]

function renderSnake(){
    snakeBody.forEach(function(bodySegment){
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = bodySegment.x;
        snakeElement.style.gridColumnStart = bodySegment.y;
        snakeElement.style.backgroundColor = 'green'
        snakeElement.style.border = 'solid black 0.3vmin'
        // snakeElement.classList.add('.snake') - czemu nie działa?
        gameBoard.appendChild(snakeElement);
        console.log(snakeElement)
    })

}