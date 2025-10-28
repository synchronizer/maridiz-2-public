

Array.from(document.querySelectorAll('.fullscreen-gallery')).forEach(fullscreenGallery => {
    const left = fullscreenGallery.querySelector('.fullscreen-gallery__left'),
        right = fullscreenGallery.querySelector('.fullscreen-gallery__right');

    left.addEventListener('click', () => {
        fullscreenGallery.scrollTo({
            left: fullscreenGallery.scrollLeft - fullscreenGallery.offsetWidth,
            // behavior: "smooth",
        });
    })

    right.addEventListener('click', () => {
        fullscreenGallery.scrollTo({
            left: fullscreenGallery.scrollLeft + fullscreenGallery.offsetWidth,
            // behavior: "smooth",
        });
    })

    fullscreenGallery.addEventListener('keydown', e => {
        if (e.code === 'ArrowRight') right.click();
        if (e.code === 'ArrowLeft') left.click();
    })

    const checkLeftArrow = () => {

        if (fullscreenGallery.scrollLeft + fullscreenGallery.offsetLeft <= 1) {
            left.classList.add('fullscreen-gallery__left_hide');
            return
        }

        left.classList.remove('fullscreen-gallery__left_hide')
    }

    const checkRightArrow = () => {

        if (fullscreenGallery.scrollWidth - fullscreenGallery.scrollLeft - fullscreenGallery.offsetWidth + fullscreenGallery.offsetLeft <= 1) {
            right.classList.add('fullscreen-gallery__right_hide');
            return
        }

        right.classList.remove('fullscreen-gallery__right_hide')
    }

    const checkControls = () => {
        checkLeftArrow();
        checkRightArrow()
    }

    window.addEventListener('DOMContentLoaded', checkControls)
    fullscreenGallery.addEventListener('scroll', checkControls)


    const id = fullscreenGallery.getAttribute('id');
    const triggersList = document.querySelectorAll(`[data-fullscreen-gallery="${id}"]`);
    Array
        .from(triggersList)
        .forEach((trigger, key) => {
            trigger.addEventListener('click', () => {
                fullscreenGallery.showModal()
                fullscreenGallery.scrollTo({
                    left: fullscreenGallery.offsetWidth * key,
                });
                checkControls();
            })
        })

})