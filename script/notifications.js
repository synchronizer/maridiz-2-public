Array.from(document.querySelectorAll('.notifications')).forEach(notifications => {
    window.pushNotification = (options) => {

        const { text, type, autoclose, closeAction} = options;
        const notifications__item = notifications.querySelector('.notifications__prototype > .notifications__item').cloneNode(true);
        if (type) { notifications__item.classList.add(`notifications__item_${type}`) }
        notifications__item.querySelector('.notifications__item-text').innerText = text;
        notifications.appendChild(notifications__item);

        const notifications__itemClose = notifications__item.querySelector('.notifications__item-close');
        notifications__itemClose.addEventListener('click', () => {
            closeAction && closeAction()
            notifications__item.remove()
        })
        

        if (autoclose) {
            setTimeout(() => {
                notifications__item.classList.add('notifications__item_hide')
                setTimeout(() => {
                    notifications__item.remove()
                }, 600)
            }, 7000)
        }
    }
})

Array.from(document.querySelectorAll('.notifications__item')).forEach(notifications__item => {
    notifications__item.querySelector('.notifications__item-close').addEventListener('click', () => {
        notifications__item.classList.add('notifications__item_hide')
                setTimeout(() => {
                    notifications__item.remove()
                }, 600)
    })
})
