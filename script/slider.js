
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