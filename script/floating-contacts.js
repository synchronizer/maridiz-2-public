Array.from(document.querySelectorAll('.floating-contacts')).forEach(widget => {
    const openButton = widget.querySelector('.floating-contacts__open');
    const content = widget.querySelector('.floating-contacts__content');

    if (!openButton || !content) return

    openButton.addEventListener('click', () => {
        widget.classList.toggle('floating-contacts_is-open');
    });

    document.addEventListener('click', (event) => {
        if (!widget.contains(event.target)) {
            widget.classList.remove('floating-contacts_is-open');
        }
    });




    const setChangeDuration = () => {
        widget.classList.remove('widget_initial')
    }
    document.addEventListener('DOMContentLoaded', setChangeDuration)

    const triggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {

            console.log(entry);
            const colorScheme = entry.target.getAttribute('data-trigger-header-color-scheme').split('/');
            if (entry.boundingClientRect.top < window.innerHeight / 2 || entry.boundingClientRect.top > window.innerHeight *  1.5) return;

            if (entry.isIntersecting) {
                widget.setAttribute('data-color-scheme', colorScheme[1]);
            } else {
                widget.setAttribute('data-color-scheme', colorScheme[0]);
            }


        });
    }, {
        root: null,
        threshold: 0,
        rootMargin: ` 0px 0px -${widget.offsetHeight}px 0px`,
    });

    Array.from(document.querySelectorAll('[data-trigger-header-color-scheme]')).forEach(item => {
        triggerObserver.observe(item);
    })

})







Array.from(document.querySelectorAll('.header')).forEach(header => {

})