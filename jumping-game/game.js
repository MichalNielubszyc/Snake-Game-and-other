const hero = document.querySelector('.hero');
const obstacle = document.querySelector('.obstacle');
const game = document.querySelector('.game')

function jump(){
    if(!hero.classList.contains('animate'))
    hero.classList.add('animate');
    setTimeout(function(){
        hero.classList.remove('animate');
    }, 500);
}

game.addEventListener('click', jump);

setInterval(() => {
    let heroTop = parseInt(window.getComputedStyle(hero).getPropertyValue("top"));
    let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));
    // console.log(heroTop)
    // console.log(obstacleLeft)
    if(obstacleLeft<(window.innerHeight*0.525) && obstacleLeft>(window.innerHeight*0.475) && heroTop>=(window.innerHeight*0.33)){
        obstacle.style.animation = "none";
        obstacle.style.display = "none";
        alert('GAME OVER')
    }
    
}, 10);


//hero.getBoundingClientRect().x -> zrób to z width i z tego ustal granice