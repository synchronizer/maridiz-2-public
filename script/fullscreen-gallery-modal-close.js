
Array.from(document.querySelectorAll('.fullscreen-gallery')).forEach(fullscreenGallery => {
    const fullscreenGallery__close = fullscreenGallery.querySelector('.fullscreen-gallery__close'),
        fullscreenGallery__items = fullscreenGallery.querySelectorAll('.fullscreen-gallery__item');

    const showPreviev = () => {
        const previewElement = document
            .querySelectorAll(`
            [data-fullscreen-gallery="${fullscreenGallery
                    .getAttribute('id')
                }"]
            `)[Math.round(fullscreenGallery.scrollLeft / fullscreenGallery.offsetWidth)];
        if (!previewElement) return;



        setTimeout(() => {
            previewElement.focus({ focusVisible: true })
        }, 1)


    }

    fullscreenGallery.addEventListener('cancel', showPreviev)
    
    fullscreenGallery__close.addEventListener('click', () => {
        showPreviev()
        fullscreenGallery.close()
    })

    Array
        .from(fullscreenGallery__items)
        .forEach(fullscreenGallery__item => {
            fullscreenGallery__item.addEventListener('click', () => {
                showPreviev()
                fullscreenGallery.close()
            })

            fullscreenGallery__item.querySelector('.fullscreen-gallery__item > *').addEventListener('click', e => {
                e.stopPropagation();
            })
        })



})