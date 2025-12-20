
Array.from(document.querySelectorAll('.header')).forEach(header => {
    const triggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {

            const colorScheme = entry.target.getAttribute('data-trigger-header-color-scheme').split('/');

            if (entry.boundingClientRect.top <= header.offsetHeight) {
                    header.setAttribute('data-color-scheme', colorScheme[1])
            } else {
                header.setAttribute('data-color-scheme', colorScheme[0]);
            }

        });
    }, {
        root: null,
        threshold: 0,
        rootMargin: `-${header.offsetHeight}px 0px 0px 0px`,
    });

    Array.from(document.querySelectorAll('[data-trigger-header-color-scheme]')).forEach(item => {
        triggerObserver.observe(item);
    })
})