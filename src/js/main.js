import Swiper, {
    Navigation,
    Pagination
} from 'swiper';
Swiper.use([Navigation, Pagination]);
new Swiper('.supply-slider', {

    breakpoints: {
        425: {
            slidesPerView: 1,
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        },
        1000: {
            slidesPerView: 4,
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        }
    }
})

let textitem     = document.querySelectorAll('.modal-menu__item-list'),
    sublist      = document.querySelectorAll('.modal-menu-sublist'),
    sublistClose = document.querySelectorAll('.modal-menu-sublist__close');


textitem.forEach(item => {
    item.addEventListener('click', () => {
        textitem.forEach(i => i.classList.remove('modal-menu__item-list_active'))
        item.classList.add("modal-menu__item-list_active")
        sublist.forEach(i => i.classList.remove('modal-menu-sublist_active'))
        item.nextSibling.classList.add('modal-menu-sublist_active')
    })
});

sublistClose.forEach(item => {
    item.addEventListener('click', e => {
        textitem.forEach(i => i.classList.remove('modal-menu__item-list_active'))
        item.parentElement.classList.remove('modal-menu-sublist_active')
    })
})

function showMenu() {
    const button = document.querySelector('.button-menu'),
          menu   = document.querySelector('.modal-menu');

    function hideModal() {
        document.body.style.overflowY = '';
        menu.classList.remove('modal-menu_active');
    }

    function showModal() {
        document.body.style.overflowY = 'hidden';
        menu.classList.add('modal-menu_active');
    }

    button.addEventListener('click', e => {
        e.preventDefault();
        if(menu.classList.contains('modal-menu_active')){
            hideModal()
        }else {
            showModal();
        }
    })

    menu.addEventListener('click', e => {
        e.preventDefault();
        
        if(e.target === document.querySelector('.modal-menu .container') || e.target === menu){
            hideModal()
        }
    })
}
showMenu();