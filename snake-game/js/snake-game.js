// 00. GAME ELEMENTS & USER VARIABLES //////////////////////////////////////
// Ciało snake'a będzie reprezentowane jako array obiektów zawierających pozycje x i y, które potem odniesiemy do grida
const snakeBody = [{x:10, y:11}]
let victim = { x:10, y:1}
const gameBoard = document.querySelector('.game-board');
// poniższe stałe można zmieniać celem zmiany poziomu trudności
const SNAKE_SPEED = 5;
const EXPANSION_RATE = 1;

// 01. GAME ENGINE //////////////////////////////////////////////////////////
// Funkcja poniżej warunkuje jak często następuje update i render całej gry, dwiema zasadniczymi zmiennymi są tu 'currentTime' i 'lastUpdateTime' i one są tu porównywane. currentTime jest zdefiniowany odgórnie, nastomiast lastUpdateTime zaczynamy od 0 a potem po każdym requestAnimationFrame przypisujemy mu wartość currentTime. Dzięki temu jesteśmy w stanie operować rożnicą czasu pomiędzy dwoma kolejnymi iteracjami i definiujemy to jako timeSinceLastUpdate=(currentTime-LastUpdateTime)/1000 żeby było w s, a nie w ms. Następnie możemy ustalić jak często nasze iteracje mają następować , czyli jak często będziemy updatować i renderować grę. Służy nam do tego stała SNAKE_SPEED [1/s], której wartość oznacza ilość iteracji na sekundę. Tworząc poniższy warunek if definiujemy co ile s gra ma być updatowana (np. SNAKE_SPEED = 0,2 [1/s]) => gra będzie updateowana tylko jeśli iteracje będą co najmniej co 5s, a jeśli = 5 => gra będzie updateowana 5 razy na sekundę. I tylko wtedy wywołujemy funkcje render i update. Niżej wywołuję requestAnimationFrame po raz pierwszy.

let lastUpdateTime = 0;
function gameEngine(currentTime){
    window.requestAnimationFrame(gameEngine);
    const timeSinceLastUpdate = (currentTime - lastUpdateTime)/1000;
    if (timeSinceLastUpdate < 1 / SNAKE_SPEED) return
    lastUpdateTime = currentTime;

    update();
    render();
}
window.requestAnimationFrame(gameEngine);

function render(){
    gameBoard.innerHTML = ``;
    renderSnake();
    renderVictim()
}

function update(){
    updateSnake();
}


// 02. RENDERING SNAKE /////////////////////////////////////////////////////
// Dla każdego obiektu z tablicy snakeBody (dzięki metodzie forEach) tworzymy 1 div, któremu nadajemy pozycje w gridzie pobrane z wartości x i y obiektu. Dzięki temu wstawiamy go w odpowiednie miejsce na gameBoard. Potem nadajemy mu klasę snake, dzięki czemu go renderujemy, a potem każdy z tych divów jest dodawany do htmla (gameBoard.appendChild). Zerujemy gameBoard.innerHTML żeby ogon węża znikał w każdej iteracji, czyli żeby ruszał się cały, a nie rozciągał.

function renderSnake(){
    snakeBody.forEach(snakeBodyObject => {
        const snakeCell = document.createElement('div');
        snakeCell.style.gridRowStart = snakeBodyObject.y;
        snakeCell.style.gridColumnStart = snakeBodyObject.x;
        snakeCell.classList.add('snake');
        gameBoard.appendChild(snakeCell)
    })  
}

// 03. UPDATING SNAKE /////////////////////////////////////////////////////
// Tworzę petlę for, w której snakeBody[i] oznacza przedostatni obiekt tablicy snakeBody, a snakeBody[i+1] - ostatni. Przypisując ostatniemu przedostatni przy każdej iteracji ostatni element "przesuwa się" o jedną pozycję do przodu. Przypisanie musi tworzyć duplikat obiektu ({...object}), a nie przypisywać dokładnie ten sam obiekt, żeby uniknąć problemu z referance. 

//?????Nie wiem czemu i-- oraz i>=0 ???????? 

function updateSnake(){
    const snakeMovement = getUserDirections();
    for(let i = snakeBody.length - 2; i>=0; i--){
        snakeBody[i+1] = {...snakeBody[i]}
    }
    // Zwiększamy głowie snake'a (snakeBody[0]) wartość x o wartość zmiennej snakeMovement, którą pobieram z obiektu userDirections. UserDirections zmienia się poprzez dodanie eventlistenera ze switchem dla eventu keydown obejmującego strzałki (04). Dzięki czemu wprawiamy snake'a w ruch.
    snakeBody[0].x += snakeMovement.x
    snakeBody[0].y += snakeMovement.y
}

// 04. USER DIRECTIONS ////////////////////////////////////////////////////////
// Tak jak wyjaśnione powyżej aktualizujemy obiekt userDirections po każdym wciśnięciu strzałki o zadaną wartość x/y, a następnie przekazujemy obiekt z nowymi wartościami do funkcji updateSnake. Poprzez obiekt lastUserDirections sprawdzamy czy zadany ruch jest dozwolony (np. jeśli ostatnim ruchem był ruch w kierunku y to nie możemy znów wykonać ruchu w kierunku y). Przy każdym wywołaniu getUserDirections() aktualizujemy obiekt lastUserDirections.

let userDirections = { x: 0, y: 0};
let lastUserDirections = { x: 0, y: 0};

window.addEventListener('keydown', event => {
    switch (event.key){
        case 'ArrowUp':
            if(lastUserDirections.y !== 0) break
            userDirections = { x: 0, y: -1}
            break
        case 'ArrowDown':
            if(lastUserDirections.y !== 0) break
            userDirections = { x: 0, y: 1}
            break
        case 'ArrowLeft':
            if(lastUserDirections.x !== 0) break
            userDirections = { x: -1, y: 0}
            break
        case 'ArrowRight':
            if(lastUserDirections.x !== 0) break
            userDirections = { x: 1, y: 0}
            break
    }
})

function getUserDirections(){
    lastUserDirections = userDirections;
    return userDirections
}

// 05. VICTIM RENDER & UPDATE ///////////////////////////////////////////////////

function renderVictim(){
    const victimCell = document.createElement('div');
    victimCell.style.gridRowStart = victim.y;
    victimCell.style.gridColumnStart = victim.x;
    victimCell.classList.add('victim');
    gameBoard.appendChild(victimCell)
}
