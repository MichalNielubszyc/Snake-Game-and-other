// Modal & form and getting previous settings from localStorage

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
const closeModal = (item) => item.classList.add('modal--hidden');
const showModal = (item) => item.classList.remove('modal--hidden');

const getFormData = (e) => {
	e.preventDefault();

    USER_NAME = form.username.value;
    SNAKE_SPEED = form.snakespeed.value;
    EXPANSION_RATE = form.expansionrate.value;
    WALLS_ON_OFF = form.walls.value;
    closeModal(formModal);
    showModal(startModal); // czemu nie odpala przy resecie?
    renderSettings();
    saveInLocalStorage();
};

form.addEventListener('submit', getFormData);

// Initialize Firebase & save score in Firestore

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyD_cQ0AFuKqdh1hrUWHD1snUJmTp2J_KC4",
    authDomain: "frickinawesomesnakegame.firebaseapp.com",
    projectId: "frickinawesomesnakegame",
    storageBucket: "frickinawesomesnakegame.appspot.com",
    messagingSenderId: "198386238996",
    appId: "1:198386238996:web:c658d4154c4206c88e4901"
  };

firebase.initializeApp(firebaseConfig);

function saveinFirestore(){
    const scoreObject = {
        username: USER_NAME,
        score
    }
    console.log(scoreObject)
    // firebase.firestore().collection('snakeScores').add(scoreObject)
    firebase.firestore().collection('snakeScores').doc().set(scoreObject)
    .then(console.log('success'))
    .catch(console.log('ooops, not working'))
}

// Save user data in localStorage 

function saveInLocalStorage(){
    const settingsArray = {USER_NAME, SNAKE_SPEED, EXPANSION_RATE};
    localStorage.setItem('SNAKE_DATA', JSON.stringify(settingsArray))
}

// Render settings

const userInfo = document.querySelector('.user-info');
const gameTimeInfo = document.querySelector('.game-time-info');
const scoreInfo = document.querySelector('.score-info');
const snakeSpeedInfo = document.querySelector('.snake-speed-info');
const snakeExpansionInfo = document.querySelector('.snake-expansion-info');
const wallsInfo = document.querySelector('.walls-info');

const renderSettings = () => {
    userInfo.innerHTML = `User: ${USER_NAME}`;
    snakeSpeedInfo.innerHTML = `Snake Speed: ${SNAKE_SPEED}` 
    snakeExpansionInfo.innerHTML = `Snake Expansion Rate: ${EXPANSION_RATE}` 
    wallsInfo.innerHTML = `Walls: ${WALLS_ON_OFF}`  
}

const renderScoreTime = () => {
    printTime()
    score = ((lastUpdateTime/1000)*SNAKE_SPEED*EXPANSION_RATE).toFixed(0);
    scoreInfo.innerHTML = `Your score: ${score}`;
}

function printTime(){
    let displayTime = lastUpdateTime.toFixed(0);
    let displayTimeMinutes = Math.floor(displayTime/60000) // in min
    let displayTimeSeconds = Math.floor((displayTime % 60000)/1000) // in s
    if (displayTimeSeconds< 10){
        gameTimeInfo.innerHTML = `Game time: ${displayTimeMinutes}:0${displayTimeSeconds}`
    } else {
        gameTimeInfo.innerHTML = `Game time: ${displayTimeMinutes}:${displayTimeSeconds}`
    }
}

// 00. GAME ELEMENTS & USER VARIABLES //////////////////////////////////////
// Ciało snake'a będzie reprezentowane jako array obiektów zawierających pozycje x i y, które potem odniesiemy do grida
const snakeBody = [{x:10, y:11}]
let victim = { x:10, y:1}
const gameBoard = document.querySelector('.game-board');
let gameOver = false;

// 01. GAME ENGINE //////////////////////////////////////////////////////////
// Funkcja poniżej warunkuje jak często następuje update i render całej gry, dwiema zasadniczymi zmiennymi są tu 'currentTime' i 'lastUpdateTime' i one są tu porównywane. currentTime jest zdefiniowany odgórnie, nastomiast lastUpdateTime zaczynamy od 0 a potem po każdym requestAnimationFrame przypisujemy mu wartość currentTime. Dzięki temu jesteśmy w stanie operować rożnicą czasu pomiędzy dwoma kolejnymi iteracjami i definiujemy to jako timeSinceLastUpdate=(currentTime-LastUpdateTime)/1000 żeby było w s, a nie w ms. Następnie możemy ustalić jak często nasze iteracje mają następować , czyli jak często będziemy updatować i renderować grę. Służy nam do tego stała SNAKE_SPEED [1/s], której wartość oznacza ilość iteracji na sekundę. Tworząc poniższy warunek if definiujemy co ile s gra ma być updatowana (np. SNAKE_SPEED = 0,2 [1/s]) => gra będzie updateowana tylko jeśli iteracje będą co najmniej co 5s, a jeśli = 5 => gra będzie updateowana 5 razy na sekundę. I tylko wtedy wywołujemy funkcje render i update. Niżej wywołuję requestAnimationFrame po raz pierwszy.

let state = 'notStarted'
const startModal = document.querySelector('.start-modal')

window.addEventListener('keydown', event => {
    if (state === 'notStarted'){
    switch (event.key){
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
            closeModal(startModal)
            window.requestAnimationFrame(gameEngine);
            state = 'started'
    }
    } else {
        return
    }
})

let lastUpdateTime = 0;
function gameEngine(currentTime){
    if(gameOver){
        if(confirm('GAME OVER press ok to save your score and restart')){
            reset()
            saveinFirestore();
            state = 'notStarted'
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

function reset(){
    window.cancelAnimationFrame(gameEngine);
    console.log('woah')
    score = 0;
    lastUpdateTime = 0
    renderScoreTime();
    showModal(formModal);
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
    addCells();
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

// 06. EATING VICTIM /////////////////////////////////////////////////////////
// Funkcja eatVictim() zarządza całym zdarzeniem, gdy którakolwiek komórka snake'a pokrywa się z komórką victima. W tym celu sprawdza warunek z funkcją onSnake(). Jeśli jest ona prawdziwa, wywołuje dwa wyrażenia - funkcję expandSnake, która wydłuża snake'a o zadany EXPANSION_RATE oraz przypisanie obiektowi victim nowych współrzędnych. Funkcja onSnake() sprawdza czy którakolwiek komórka snake'a pokrywa się z victimem. Posługuje się przy tym metodą .some wywołaną na arrayu snakeBody. Funkcja wywołuje kolejną funkcję equalPositions, która ma za argumenty komórkę snake'a i argument przywołany w onSnake (czyli w naszym przypadku będzie tam victim) i wówczas porównuje współrzędne x i y obu tych argumentów. Funkcje onSnake i equalPositions zwracają boolean, także funkcja główna będzie wywołana tylko jeśli oba będą spełnione. Główna funkcja eatVictim jest przekazana do funkcji update(), która jest iterowana co określony przez SNAKE_SPEED czas.

function eatVictim(){
    if (onSnake(victim)){
        expandSnake()
        victim = randomVictimPosition() // victim = { x: 20, y: 10 }
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

// 07. ADDING NEW SNAKE CELLS ////////////////////////////////////////////////////
// Przy dodawaniu nowych komórek snake'a kluczową zmienną będzie newCells, do której przy każdym wywołaniu expandSnake będzie dodawana ilość komórek równa zadanej EXPANSION_RATE. Funkcją przekazaną do jednej z głównych funkcji - updateSnake() jest addCells, która pushuje nowy obiekt do  arraya snakeBody tyle razy ile wynosi wartość newCells, czyli tyle ile EXPANSION_RATE. Po każdym dodaniu nowych komórek, po loop break zmienna newCells jest zerowana, inaczej snake wydłużałby się w nieskończoność.

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

// 08. RANDOMIZE VICTIM POSITION /////////////////////////////////////////////////
// Funkcja Math.random() zwraca wartość od 0 do 0,99999 dlatego mnożę ją przez 21
function randomVictimPosition(){
    return {
        x: Math.floor(Math.random() * 21) + 1,
        y: Math.floor(Math.random() * 21) + 1
    }
}

// 09. VERYFYING IF GAME IS OVER ////////////////////////////////////////////////

function checkGameOver() {
    gameOver = outsideGrid(snakeBody[0]) || snakeIntersection()
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

// Co chcę dodać sam później: 0.uprość kod podobnie jak zrobiłeś z randomVictimPosition 1.wyświetlacz wyników i zapisywanie wyników, możliwość resetowania gry itd 2.przy włączaniu gry wpisywanie nazwy użytkownika i potem zapisywanie wyników poszczególnych użytkowników 3.możliwość ustawiania SNAKE_SPEED i EXPANSION_RATE na stronie 4.włączanie i wyłączanie ścian 5.teleport 





