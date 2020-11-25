const apartmentsTab = document.querySelector('.apartmentsBtn');
const housesTab = document.querySelector('.housesBtn');
const otherTab = document.querySelector('.otherBtn');

const apartmentsGallery = document.querySelector('.apartments_gallery');
const housesGallery = document.querySelector('.houses_gallery');
const otherGallery = document.querySelector('.other_gallery');

apartmentsTab.addEventListener('click', ()=>{
    apartmentsTab.classList.add('active');
    housesTab.classList.remove('active');
    otherTab.classList.remove('active');

    apartmentsGallery.classList.add('current');
    housesGallery.classList.remove('current');
    otherGallery.classList.remove('current');
});

housesTab.addEventListener('click', ()=>{
    apartmentsTab.classList.remove('active');
    housesTab.classList.add('active');
    otherTab.classList.remove('active');

    apartmentsGallery.classList.remove('current');
    housesGallery.classList.add('current');
    otherGallery.classList.remove('current');
});

otherTab.addEventListener('click', ()=>{
    apartmentsTab.classList.remove('active');
    housesTab.classList.remove('active');
    otherTab.classList.add('active');

    apartmentsGallery.classList.remove('current');
    housesGallery.classList.remove('current');
    otherGallery.classList.add('current');
});