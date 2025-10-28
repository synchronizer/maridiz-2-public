

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