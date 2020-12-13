// 00. GAME ELEMENTS & USER VARIABLES //////////////////////////////////////
// Ciało snake'a będzie reprezentowane jako array obiektów zawierających pozycje x i y, które potem odniesiemy do grida
const snakeBody = [
    {x:10, y:11},
    {x:11, y:11},
    {x:12, y:11}
]
const gameBoard = document.querySelector('.game-board');
const SNAKE_SPEED = 1;

// 01. GAME ENGINE //////////////////////////////////////////////////////////
// Funkcja poniżej warunkuje jak często następuje update i render całej gry, dwiema zasadniczymi zmiennymi są tu 'currentTime' i 'lastUpdateTime' i one są tu porównywane. currentTime jest zdefiniowany odgórnie, nastomiast lastUpdateTime zaczynamy od 0 a potem po każdym requestAnimationFrame przypisujemy mu wartość currentTime. Dzięki temu jesteśmy w stanie operować rożnicą czasu pomiędzy dwoma kolejnymi iteracjami i definiujemy to jako timeSinceLastUpdate=(currentTime-LastUpdateTime)/1000 żeby było w s, a nie w ms. Następnie możemy ustalić jak często nasze iteracje mają następować , czyli jak często będziemy updatować i renderować grę. Służy nam do tego stała SNAKE_SPEED [1/s], której wartość oznacza ilość iteracji na sekundę. Tworząc poniższy warunek if definiujemy co ile s gra ma być updatowana (np. SNAKE_SPEED = 0,2 [1/s]) => gra będzie updateowana tylko jeśli iteracje będą co najmniej co 5s, a jeśli = 5 => gra będzie updateowana 5 razy na sekundę. I tylko wtedy wywołujemy funkcje render i update. Niżej wywołuję requestAnimationFrame po raz pierwszy.

let lastUpdateTime = 0;
function gameEngine(currentTime){
    window.requestAnimationFrame(gameEngine);
    const timeSinceLastUpdate = (currentTime - lastUpdateTime)/1000;
    if (timeSinceLastUpdate < 1 / SNAKE_SPEED) return
    lastUpdateTime = currentTime;
    console.log(currentTime);

    updateSnake();
    renderSnake();
}
window.requestAnimationFrame(gameEngine);


// 02. RENDERING SNAKE /////////////////////////////////////////////////////
// Dla każdego obiektu z tablicy snakeBody (dzięki metodzie forEach) tworzymy 1 div, któremu nadajemy pozycje w gridzie pobrane z wartości x i y obiektu. Dzięki temu wstawiamy go w odpowiednie miejsce na gameBoard. Potem nadajemy mu klasę snake, dzięki czemu go renderujemy, a potem każdy z tych divów jest dodawany do htmla (gameBoard.appendChild).

function renderSnake(){
    gameBoard.innerHTML = ``;
    snakeBody.forEach(snakeBodyObject => {
        const snakeCell = document.createElement('div');
        snakeCell.style.gridRowStart = snakeBodyObject.y;
        snakeCell.style.gridColumnStart = snakeBodyObject.x;
        snakeCell.classList.add('snake');
        gameBoard.appendChild(snakeCell)
    })  
}

// 03. UPDATING SNAKE /////////////////////////////////////////////////////
// Tworzę petlę for, w której snakeBody[i] oznacza przedostatni obiekt tablicy snakeBody, a snakeBody[i+1] - ostatni. Przypisując ostatniemu przedostatni przy każdej iteracji ostatni element "przesuwa się" o jedną pozycję do przodu. Przypisanie musi tworzyć duplikat obiektu ({...object}), a nie przypisywać dokładnie ten sam obiekt, żeby uniknąć problemu z referance. Nie wiem czemu i-- oraz i>=0 ???????? Potem zwiększamy głowie snake'a (snakeBody[0]) wartość x o 1, dzięki czemu wprawiamy go w ruch.

function updateSnake(){
    for(let i = snakeBody.length - 2; i>=0; i--){
        snakeBody[i+1] = {...snakeBody[i]}
    }
    snakeBody[0].x += 1
    snakeBody[0].y += 0
}
