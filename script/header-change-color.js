const header = document.querySelector('.header');

const header__bottomTriggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {


        if (entry.isIntersecting && entry.boundingClientRect.top <= 100) {
            // console.log('Элемент полностью появился вверху страницы');
            header.setAttribute('data-color-scheme', '');
        }
        if (!entry.isIntersecting && entry.boundingClientRect.top <= 0) {
            // console.log('Элемент коснулся верхней границы');
            header.setAttribute('data-color-scheme', entry.target.getAttribute('data-trigger-header-color-scheme'))
        }


    });
}, {
    root: null,
    threshold: 1,
});


const header__topTriggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.boundingClientRect.top <= 0) {
            // console.log('Элемент начал появляться вверху страницы');
            header.setAttribute('data-color-scheme', entry.target.getAttribute('data-trigger-header-color-scheme'))

        }
        if (!entry.isIntersecting && entry.boundingClientRect.top <= 0) {
            console.log('Элемент ушёл наверх');
            header.setAttribute('data-color-scheme', '');
        }

    });
}, {
    root: null,
    threshold: 0,
});







Array.from(document.querySelectorAll('[data-trigger-header-color-scheme]')).forEach(item => {
    header__topTriggerObserver.observe(item);
    header__bottomTriggerObserver.observe(item);
})