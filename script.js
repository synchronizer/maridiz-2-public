
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


Array.from(document.querySelectorAll('.about-preview')).forEach(block => {
    block.classList.add('about-preview_hide')

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                entry.target.classList.toggle('about-preview_hide', !entry.isIntersecting)
                if (entry.isIntersecting) observer.unobserve(entry.target);
            })
        }, {
        threshold: .3
    }
    )

    observer.observe(block)
})

Array.from(document.querySelectorAll('.call-request')).forEach(item => {
    const title = item.querySelector('.call-request__title'),
        name = item.querySelector('[name="name"]'),
        phone = item.querySelector('[name="phone"]'),
        send = item.querySelector('[name="send"]'),
        email = item.querySelector('[name="email"]'),
        comment = item.querySelector('[name="comment"]');
    // utm_source = item.getAttribute('utm_source'),
    // utm_medium = item.getAttribute('utm_medium'),
    // utm_campaign = item.getAttribute('utm_campaign'),
    // utm_term = item.getAttribute('utm_term'),
    // utm_content = item.getAttribute('utm_content');

    function checkFields() {
        if (
            (name && !name.value)
            || (phone && phone.value.length) < 3
            // || (email && !email.b.valid)
        ) { send.setAttribute('disabled', '') } else { send.removeAttribute('disabled') }
    };
    checkFields();
    if (name) name.addEventListener('input', checkFields);
    if (phone) phone.addEventListener('input', checkFields);
    if (email) email.addEventListener('input', checkFields);

    send.onclick = () => {
        const form = new FormData();
        form.append('TYPE', 'feedback');
        if (title) form.append('TITLE', title.textContent);
        if (name) form.append('NAME', name.value);
        if (phone) form.append('PHONE', phone.value);
        if (email) form.append('EMAIL', email.value);
        if (comment) form.append('COMMENT', comment.value);
        form.append('PAGE', location.pathname);

        // if (utm_source) form.append('UTM_SOURCE', utm_source);
        // if (utm_medium) form.append('UTM_MEDIUM', utm_medium);
        // if (utm_campaign) form.append('UTM_CAMPAIGN', utm_campaign);
        // if (utm_term) form.append('UTM_TERM', utm_term);
        // if (utm_content) form.append('UTM_CONTENT', utm_content);

        // send.b.loadStart();
        // if (name) name.b.disable();
        // if (phone) phone.b.disable();
        // if (email) email.b.disable();
        // if (comment) comment.b.disable();


        fetch('https://evev.tupo.best/action-1.php', {
            method: 'POST',
            body: form,
        }).then(response => {

            if (response.status == 200) {
                window.pushNotification({
                    text: `Заявка на звонок по номеру ${phone.value} отправлена`,
                    type: 'success',
                    autoclose: true,
                })
            }
            else {
                window.pushNotification({
                    text: `Заявку на звонок по не удалось отправить`,
                    type: 'error',
                    autoclose: false,
                })
            }
        }).catch(() => {
            window.pushNotification({
                text: `Заявку на звонок возможно не удалось отправить`,
                type: 'attention',
                autoclose: true,
            })
        })

    }
})
Array.from(document.querySelectorAll('.carousel')).forEach(carousel => {
    const left = carousel.querySelector('.carousel__left'),
        right = carousel.querySelector('.carousel__right'),
        content = carousel.querySelector('.carousel__content');

    const checkControls = () => {
        if (content.scrollLeft <= 2) {
            left.classList.add('carousel__left_hide')
        } else {
            left.classList.remove('carousel__left_hide')
        }

        if (content.offsetWidth + content.scrollLeft >= content.scrollWidth - 2) {
            right.classList.add('carousel__right_hide')
        } else {
            right.classList.remove('carousel__right_hide')
        }

    }

    window.addEventListener('load', checkControls)

    content.addEventListener('scroll', checkControls)

    left.addEventListener('click', () => {
        content.scrollTo({
            top: 0,
            left: content.scrollLeft - content.offsetWidth * .99,
            behavior: "smooth",
        });
    })

    right.addEventListener('click', () => {
        content.scrollTo({
            top: 0,
            left: content.scrollLeft + content.offsetWidth * .99,
            behavior: "smooth",
        });
    })




    const carosel__items = Array.from(carousel.querySelectorAll('.carousel__content > *'));

    carosel__items.forEach((item, key) => {
        item.classList.add('carousel__item', 'carousel__item_hide')
        item.style.transitionDelay = `${key * 100}ms`
    })

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                carosel__items.forEach(item => {
                    item.classList.toggle('carousel__item_hide', !entry.isIntersecting)
                })
                if (entry.isIntersecting) observer.unobserve(entry.target);
            })
        }, {
        threshold: .3
    }
    )

    observer.observe(carousel)


})
if (!window.localStorage.getItem('acceptCookies')) {
    pushNotification({
        text: 'Сайт использует cookies',
        closeAction: () => {
            window.localStorage.setItem('acceptCookies', true)
        },
    })
}

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



Array.from(document.querySelectorAll('.grid')).forEach(grid => {
    const grid__items = Array.from(grid.querySelectorAll(':scope > *'));

    grid__items.forEach((item, key) => {
        item.classList.add('grid__item', 'grid__item_hide')
        item.style.transitionDelay = `${key * 100}ms`
    })

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                grid__items.forEach(item => {
                    item.classList.toggle('grid__item_hide', !entry.isIntersecting)
                })
                if (entry.isIntersecting) observer.unobserve(entry.target);
            })
        }, {
        threshold: .3
    }
    )

    observer.observe(grid)
})
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
document.addEventListener('keypress', e => {
    if (e.code != 'Space' && e.code != 'Enter') return;
    document.activeElement.click();
})


Array.from(document.querySelectorAll('.slider')).forEach(slider => {
    const time = parseFloat(slider.getAttribute('data-time')),
            pause = parseFloat(slider.getAttribute('data-pause'));
    
    const items = Array.from(slider.querySelectorAll('.slider__content > *')),
            teasers = Array.from(slider.querySelectorAll('.slider__teaser'));
    

    let activeNumber = 0, timerPlay, timerPause;

    const sliderPlay = () => {
        items.forEach(item => item.classList.remove('slider__item_active'));
        teasers.forEach(teaser => teaser.classList.remove('slider__teaser_active'));
        // teasers.forEach(teaser => teaser.querySelector('.slider__teaser-bg').classList.remove('rounded-s'));

        items[activeNumber].classList.add('slider__item_active');
        teasers[activeNumber] && teasers[activeNumber].classList.add('slider__teaser_active');
        // teasers[activeNumber] && teasers[activeNumber].querySelector('.slider__teaser-bg').classList.add('rounded-s');

        timerPlay = setTimeout(() => {
            activeNumber = (activeNumber + 1) % items.length;
            sliderPlay();
        }, time * 1000)
    };

    const sliderPause = () => {
        slider.classList.add('slider_pause');
        clearTimeout(timerPlay);
        clearTimeout(timerPause);
        timerPause = setTimeout(() => {
            slider.classList.remove('slider_pause');
            sliderPlay();   
        }, pause * 1000);
    }

    slider.addEventListener('click', sliderPause);

    teasers.forEach((teaser, key) => teaser.addEventListener('click', () => {
        activeNumber = key;

        items.forEach(item => item.classList.remove('slider__item_active'));
        teasers.forEach(teaser => teaser.classList.remove('slider__teaser_active'));

        items[activeNumber].classList.add('slider__item_active');
        teasers[activeNumber] && teasers[activeNumber].classList.add('slider__teaser_active');

        sliderPause();
    }))

    sliderPlay();

})




// document.addEventListener('keydown', e => {
//     if (e.code != 'Space' && e.code != 'Enter') return;
//     if (!Array.from(document.activeElement.classList).includes('button_abstract')) return;
//     document.activeElement.click()
// })
Array.from(document.querySelectorAll('.input')).forEach(item => {
    const input = item.querySelector('.input__input');
    const clear = item.querySelector('.input__clear');
    
    input.b = {};
    
    input.b.enable = () => {
      item.classList.remove('input_disabled');
      input.disabled = false;
    }
    
    input.b.disable = () => {
      item.classList.add('input_disabled');
      input.disabled = true;
    }
    
  //  clear.onclick = () => {input.value = ''};
    
    const validateTel = () => {
      
      
      input.value = '+7' + input.value
        .replace('+7', '')
        .replace(/\D/g, '')
        .substring(0,10);
      
      input.value =(
        input.value.slice(0, 8) + ' ' +
        input.value.slice(8, 10) + ' ' +
        input.value.slice(10))
      .trim()
      .replaceAll(' ', '-')
      
      input.value =(
        input.value.slice(0, 2) + ' ' +
        input.value.slice(2, 5) + ' ' +
        input.value.slice(5))
      .trim()
      
    }
    if (input.getAttribute('type') == "tel") {
      validateTel()
      input.addEventListener('input', () => validateTel())
    }
    
    const validateEmail = () => {
      input.b.valid = input.value
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      
    };
    
    if (input.getAttribute('type') == "email") {
      validateEmail()
      input.addEventListener('input', () => validateEmail())
    }
  })