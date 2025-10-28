if (!window.localStorage.getItem('acceptCookies')) {
    pushNotification({
        text: 'Сайт использует cookies',
        closeAction: () => {
            window.localStorage.setItem('acceptCookies', true)
        },
    })
}