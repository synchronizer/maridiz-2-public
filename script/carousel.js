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

    if (carousel.classList.contains('carousel_scroll-snap')) {
        return
    }



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