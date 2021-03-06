// 01. Modal & form and saving & getting previous settings from localStorage

const currentSettings = (JSON.parse(localStorage.getItem('SNAKE_DATA'))) || {} 

const form = document.querySelector('form')
form.username.value = currentSettings.USER_NAME || '';
form.snakespeed.value = currentSettings.SNAKE_SPEED;
form.expansionrate.value = currentSettings.EXPANSION_RATE;

const formModal = document.querySelector('.modal')
let USER_NAME = '';
let SNAKE_SPEED = 0;
let EXPANSION_RATE = 0;
let WALLS_ON_OFF = 0;
let score = 0;
let state;
const closeModal = (item) => item.classList.add('modal--hidden');
const showModal = (item) => item.classList.remove('modal--hidden');

const getFormData = (e) => {
    e.preventDefault();
    state = 'notStarted'
    USER_NAME = form.username.value;
    SNAKE_SPEED = form.snakespeed.value;
    EXPANSION_RATE = form.expansionrate.value;
    closeModal(formModal);
    showModal(startModal);
    renderSettings();
    saveInLocalStorage();
    startGame()
};

form.addEventListener('submit', getFormData);

function saveInLocalStorage(){
    const settingsArray = {USER_NAME, SNAKE_SPEED, EXPANSION_RATE};
    localStorage.setItem('SNAKE_DATA', JSON.stringify(settingsArray))
}

// 02. Initialize Firebase, render best scores & save score in Firestore

firebase.initializeApp(firebaseConfig);

firebase.firestore().collection('snakeScores').onSnapshot((scoresDocuments) => renderPreviousScores(scoresDocuments));

function saveinFirestore(){
    const scoreObject = {
        username: USER_NAME,
        score
    }
    firebase.firestore().collection('snakeScores').doc().set(scoreObject)
}

const scoresContainer = document.querySelector('.scores-section')
let listExists = false
let scoresArray;

function renderPreviousScores(documents) {
    scoresArray = [];
    documents.forEach((document) => {
        const data = document.data();
        scoresArray.push(data)
    })
    const topScores = scoresArray.sort((a,b) => {
        return b.score - a.score;
    })
    const topTenScores = topScores.slice(0,10) 
    if (listExists){
            const previousList = document.querySelector('ol')
            previousList.remove()
        }
    const list = document.createElement('ol');
    let html = '';
    topTenScores.forEach((document) => {
        html += `<li class="single-score">${document.username} : ${document.score}</li>`
    });
    list.innerHTML = html;
    scoresContainer.appendChild(list)
    listExists = true;
}

// 03. Render settings and score

const userInfo = document.querySelector('.user-info');
const scoreInfo = document.querySelector('.score-info');
const snakeSpeedInfo = document.querySelector('.snake-speed-info');
const snakeExpansionInfo = document.querySelector('.snake-expansion-info');
const wallsInfo = document.querySelector('.walls-info');

const renderSettings = () => {
    userInfo.innerHTML = `User: ${USER_NAME}`;
    snakeSpeedInfo.innerHTML = `Snake Speed: ${SNAKE_SPEED}` ;
    snakeExpansionInfo.innerHTML = `Snake Expansion Rate: ${EXPANSION_RATE}`;
    if (form.wallsoff.checked === true){
        wallsInfo.innerHTML = `Walls: OFF`  
    } else {
        wallsInfo.innerHTML = `Walls: ON` 
    }
}

const renderScoreTime = () => {
    score = ((SNAKE_SPEED/2)*(EXPANSION_RATE/2)*victimScore).toFixed(0); 
    if (form.wallsoff.checked === true){
        score = (0.7*score);
    }
    scoreInfo.innerHTML = `Your score: ${score}`;
}

// 04. GAME ELEMENTS & USER VARIABLES //////////////////////////////////////
// Cia??o snake'a b??dzie reprezentowane jako array obiekt??w zawieraj??cych pozycje x i y, kt??re potem odniesiemy do grida

let snakeBody = [];
let victim = {};
const gameBoard = document.querySelector('.game-board');
let gameOver = false;

// 05. GAME ENGINE //////////////////////////////////////////////////////////
// Funkcja poni??ej warunkuje jak cz??sto nast??puje update i render ca??ej gry, dwiema zasadniczymi zmiennymi s?? tu 'currentTime' i 'lastUpdateTime' i one s?? tu por??wnywane. currentTime jest zdefiniowany odg??rnie, nastomiast lastUpdateTime zaczynamy od 0 a potem po ka??dym requestAnimationFrame przypisujemy mu warto???? currentTime. Dzi??ki temu jeste??my w stanie operowa?? ro??nic?? czasu pomi??dzy dwoma kolejnymi iteracjami i definiujemy to jako timeSinceLastUpdate=(currentTime-LastUpdateTime)/1000 ??eby by??o w s, a nie w ms. Nast??pnie mo??emy ustali?? jak cz??sto nasze iteracje maj?? nast??powa?? , czyli jak cz??sto b??dziemy updatowa?? i renderowa?? gr??. S??u??y nam do tego sta??a SNAKE_SPEED [1/s], kt??rej warto???? oznacza ilo???? iteracji na sekund??. Tworz??c poni??szy warunek if definiujemy co ile s gra ma by?? updatowana (np. SNAKE_SPEED = 0,2 [1/s]) => gra b??dzie updateowana tylko je??li iteracje b??d?? co najmniej co 5s, a je??li = 5 => gra b??dzie updateowana 5 razy na sekund??. I tylko wtedy wywo??ujemy funkcje render i update. Ni??ej wywo??uj?? requestAnimationFrame po raz pierwszy.

const startModal = document.querySelector('.start-modal')

function startGame(){
    snakeBody = [{x:10, y:11}] 
    victim = { x:10, y:3}
    render()
    window.addEventListener('keydown', event => {
    if (state === 'started'){
        return
    } else if (state === 'notStarted'){
    switch (event.key){
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
            closeModal(startModal)
            window.requestAnimationFrame(gameEngine);
            state = 'started'
    }
}
})}

let lastUpdateTime = 0;
function gameEngine(currentTime){
    if(gameOver){
        if(confirm('GAME OVER press ok to save your score and restart')){
            saveinFirestore();
            reset()
            // window.location.reload()
        }
        return
    }
    window.requestAnimationFrame(gameEngine);
    const timeSinceLastUpdate = (currentTime - lastUpdateTime)/1000;
    if (timeSinceLastUpdate < 1 / SNAKE_SPEED) return
    lastUpdateTime = currentTime;

    update();
    render();
}

function render(){
    gameBoard.innerHTML = ``;
    renderSnake();
    renderVictim();
    renderScoreTime();
}

function update(){
    updateSnake();
    eatVictim();
    checkGameOver();
}

const resetBtn = document.querySelector('.reset-game-btn');

function reset(){
    state = 'reset';
    window.cancelAnimationFrame(gameEngine);
    score = 0;
    lastUpdateTime = 0
    renderScoreTime();
    closeModal(startModal);
    showModal(formModal);
    gameOver = false;
    victimScore = 0;
}

resetBtn.addEventListener('click', reset)

// 06. RENDERING SNAKE /////////////////////////////////////////////////////
// Dla ka??dego obiektu z tablicy snakeBody (dzi??ki metodzie forEach) tworzymy 1 div, kt??remu nadajemy pozycje w gridzie pobrane z warto??ci x i y obiektu. Dzi??ki temu wstawiamy go w odpowiednie miejsce na gameBoard. Potem nadajemy mu klas?? snake, dzi??ki czemu go renderujemy, a potem ka??dy z tych div??w jest dodawany do htmla (gameBoard.appendChild). Zerujemy gameBoard.innerHTML ??eby ogon w????a znika?? w ka??dej iteracji, czyli ??eby rusza?? si?? ca??y, a nie rozci??ga??.

function renderSnake(){
    snakeBody.forEach(snakeBodyObject => {
        const snakeCell = document.createElement('div');
        snakeCell.style.gridRowStart = snakeBodyObject.y;
        snakeCell.style.gridColumnStart = snakeBodyObject.x;
        snakeCell.classList.add('snake');
        gameBoard.appendChild(snakeCell)
    })  
}

// 07. UPDATING SNAKE /////////////////////////////////////////////////////
// Tworz?? petl?? for, w kt??rej snakeBody[i] oznacza przedostatni obiekt tablicy snakeBody, a snakeBody[i+1] - ostatni. Przypisuj??c ostatniemu przedostatni przy ka??dej iteracji ostatni element "przesuwa si??" o jedn?? pozycj?? do przodu. Przypisanie musi tworzy?? duplikat obiektu ({...object}), a nie przypisywa?? dok??adnie ten sam obiekt, ??eby unikn???? problemu z referance. 

function updateSnake(){
    // Walls
    if (form.wallsoff.checked === true){
        if (snakeBody[0].x === 0){
            snakeBody[0].x = 22;
        } else if (snakeBody[0].x === 22){
            snakeBody[0].x = 0
        } else if (snakeBody[0].y === 0){
            snakeBody[0].y = 22
        } else if (snakeBody[0].y === 22){
            snakeBody[0].y = 0
        }  
    }

    const snakeMovement = getUserDirections();
    addCells();
    for(let i = snakeBody.length - 2; i>=0; i--){
        snakeBody[i+1] = {...snakeBody[i]}
    }
    // Zwi??kszamy g??owie snake'a (snakeBody[0]) warto???? x o warto???? zmiennej snakeMovement, kt??r?? pobieram z obiektu userDirections. UserDirections zmienia si?? poprzez dodanie eventlistenera ze switchem dla eventu keydown obejmuj??cego strza??ki (04). Dzi??ki czemu wprawiamy snake'a w ruch.
    snakeBody[0].x += snakeMovement.x
    snakeBody[0].y += snakeMovement.y


}

// 08. USER DIRECTIONS ////////////////////////////////////////////////////////
// Tak jak wyja??nione powy??ej aktualizujemy obiekt userDirections po ka??dym wci??ni??ciu strza??ki o zadan?? warto???? x/y, a nast??pnie przekazujemy obiekt z nowymi warto??ciami do funkcji updateSnake. Poprzez obiekt lastUserDirections sprawdzamy czy zadany ruch jest dozwolony (np. je??li ostatnim ruchem by?? ruch w kierunku y to nie mo??emy zn??w wykona?? ruchu w kierunku y). Przy ka??dym wywo??aniu getUserDirections() aktualizujemy obiekt lastUserDirections.

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

// 09. VICTIM RENDER & UPDATE ///////////////////////////////////////////////////

function renderVictim(){
    const victimCell = document.createElement('div');
    victimCell.style.gridRowStart = victim.y;
    victimCell.style.gridColumnStart = victim.x;
    victimCell.classList.add('victim');
    gameBoard.appendChild(victimCell)
}

// 10. EATING VICTIM /////////////////////////////////////////////////////////
// Funkcja eatVictim() zarz??dza ca??ym zdarzeniem, gdy kt??rakolwiek kom??rka snake'a pokrywa si?? z kom??rk?? victima. W tym celu sprawdza warunek z funkcj?? onSnake(). Je??li jest ona prawdziwa, wywo??uje dwa wyra??enia - funkcj?? expandSnake, kt??ra wyd??u??a snake'a o zadany EXPANSION_RATE oraz przypisanie obiektowi victim nowych wsp????rz??dnych. Funkcja onSnake() sprawdza czy kt??rakolwiek kom??rka snake'a pokrywa si?? z victimem. Pos??uguje si?? przy tym metod?? .some wywo??an?? na arrayu snakeBody. Funkcja wywo??uje kolejn?? funkcj?? equalPositions, kt??ra ma za argumenty kom??rk?? snake'a i argument przywo??any w onSnake (czyli w naszym przypadku b??dzie tam victim) i w??wczas por??wnuje wsp????rz??dne x i y obu tych argument??w. Funkcje onSnake i equalPositions zwracaj?? boolean, tak??e funkcja g????wna b??dzie wywo??ana tylko je??li oba b??d?? spe??nione. G????wna funkcja eatVictim jest przekazana do funkcji update(), kt??ra jest iterowana co okre??lony przez SNAKE_SPEED czas.

let victimScore = 0;

function eatVictim(){
    if (onSnake(victim)){
        expandSnake()
        victim = randomVictimPosition() // victim = { x: 20, y: 10 }
        victimScore = victimScore + 1;
    }
}

function onSnake(position, { ignoreHead = false } = {}){
    return snakeBody.some((snakeCell, index) => {
        if (ignoreHead && index === 0) return false
        return equalPositions(snakeCell, position)
    })
}

function equalPositions(pos1, pos2){
    return pos1.x === pos2.x && pos1.y === pos2.y;
}

// 11. ADDING NEW SNAKE CELLS ////////////////////////////////////////////////////
// Przy dodawaniu nowych kom??rek snake'a kluczow?? zmienn?? b??dzie newCells, do kt??rej przy ka??dym wywo??aniu expandSnake b??dzie dodawana ilo???? kom??rek r??wna zadanej EXPANSION_RATE. Funkcj?? przekazan?? do jednej z g????wnych funkcji - updateSnake() jest addCells, kt??ra pushuje nowy obiekt do  arraya snakeBody tyle razy ile wynosi warto???? newCells, czyli tyle ile EXPANSION_RATE. Po ka??dym dodaniu nowych kom??rek, po loop break zmienna newCells jest zerowana, inaczej snake wyd??u??a??by si?? w niesko??czono????.

let newCells = 0;

function expandSnake(){
    newCells += EXPANSION_RATE;
}

function addCells(){
    for (let i=0; i < newCells; i++){
        snakeBody.push({...snakeBody[snakeBody.length - 1]})
    }
    newCells = 0;
}

// 12. RANDOMIZE VICTIM POSITION /////////////////////////////////////////////////
// Funkcja Math.random() zwraca warto???? od 0 do 0,99999 dlatego mno???? j?? przez 21
function randomVictimPosition(){
    return {
        x: Math.floor(Math.random() * 21) + 1,
        y: Math.floor(Math.random() * 21) + 1
    }
}

// 13. VERYFYING IF GAME IS OVER ////////////////////////////////////////////////

function checkGameOver() {
    if (form.wallsoff.checked === true){
        gameOver = snakeIntersection()
    } else {
        gameOver = outsideGrid(snakeBody[0]) || snakeIntersection()
    }
}

function outsideGrid(position){
    return(
        position.x < 1 || position.x > 21 ||
        position.y < 1 || position.y > 21
    )
}

function snakeIntersection(){
    return onSnake(snakeBody[0], { ignoreHead: true })
}