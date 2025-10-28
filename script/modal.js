const showModal = modalId => {
    const modal = document.querySelector(`#${modalId}`);
    modal.showModal();
}

Array.from(document.querySelectorAll('[data-modal]')).forEach(modalTrigger => {
    modalTrigger.addEventListener('click', () => { showModal(modalTrigger.getAttribute('data-modal')) })
})

Array.from(document.querySelectorAll('.modal')).forEach(modal => {
    const modal__close = modal.querySelector('.modal__close'),
        modal__scroller = modal.querySelector('.modal__scroller'),
        modal__content = modal.querySelector('.modal__content');


    modal__close.addEventListener('click', () => { modal.close() })
    modal__scroller.addEventListener('click', () => { modal.close() })

    modal__content.addEventListener('click', e => {
        e.stopPropagation();
    })

})