
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