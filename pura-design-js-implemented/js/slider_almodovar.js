const slideContainer = document.querySelector('.gallery');
const slideImages = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prevBtn');
const nextBtn = document.querySelector('.nextBtn');

let counter = 1;
const imageSize = slideImages[0].clientWidth;

// slideContainer.style.transform = 'translateX(-${counter ? 100*counter: 100}%)';

slideContainer.style.transform = 'translateX(' + (-imageSize * counter) + 'px)';

nextBtn.addEventListener('click', ()=>{
    slideContainer.style.transition = 'transform 0.4s ease-in-out';
    counter++;
    slideContainer.style.transform = 'translateX(' + (-imageSize * counter) + 'px)';
    console.log(counter)
})

prevBtn.addEventListener('click', ()=>{
    slideContainer.style.transition = 'transform 0.4s ease-in-out';
    counter--;
    slideContainer.style.transform = 'translateX(' + (-imageSize * counter) + 'px)';
    console.log(counter)
    console.log(slideImages[counter].id)
})

// making slides go in a kind of loop from last to the first one

slideContainer.addEventListener('transitionend', () =>{
    if (slideImages[counter].id === 'lastClone'){
        slideContainer.style.transition = 'none';
        counter = slideImages.length -2;
        slideContainer.style.transform = 'translateX(' + (-imageSize * counter) + 'px)';
    }
    if (slideImages[counter].id === 'firstClone'){
        console.log('joł')
        slideContainer.style.transition = 'none';
        // counter = slideImages.length - counter;
        counter = 1;
        slideContainer.style.transform = 'translateX(' + (-imageSize * counter) + 'px)';
    }
})

