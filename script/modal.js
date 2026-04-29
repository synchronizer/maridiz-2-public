const showModal = modalId => {
    const modal = document.querySelector(`#${modalId}`);
    if (!modal) return; 
    modal.close();
    modal.showModal();
}

const closeModal = modalId => {
    const modal = document.querySelector(`#${modalId}`);
    if (!modal) return;
    modal.close();
}

Array.from(document.querySelectorAll('[data-modal]')).forEach(modalTrigger => {
    modalTrigger.addEventListener('click', () => { showModal(modalTrigger.getAttribute('data-modal')) })
})

Array.from(document.querySelectorAll('[data-modal-close]')).forEach(modalTriggerClose => {
    modalTriggerClose.addEventListener('click', () => { closeModal(modalTriggerClose.getAttribute('data-modal-close')) })
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