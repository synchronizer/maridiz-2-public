Array.from(document.querySelectorAll('.header')).forEach(header => {
    const header__burger = header.querySelector('.header__burger'),
        header__navTouchWrapper = header.querySelector('.header__nav-touch-wrapper'),
        header__navTouchClose = header.querySelector('.header__nav-touch-close');

    header__navTouchWrapper.addEventListener('click', e => {
        if (header__navTouchWrapper != e.target) return;
        header__navTouchWrapper.close();
    })

    header__navTouchClose.addEventListener('click', e => {
        header__navTouchWrapper.close();
    })
    
    header__burger.addEventListener('click', () => {
        header__navTouchWrapper.showModal();
    })
})