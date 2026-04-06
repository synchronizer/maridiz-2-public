Array.from(document.querySelectorAll(".range")).forEach((range) => {

    function updateProgress() {
        const value = range.value;
        const min = range.min ? range.min : 0;
        const max = range.max ? range.max : 100;
        const percent = ((value - min) / (max - min)) * 100 + '%';
        range.style.setProperty('--progress', percent);
    }

    // обновляем прогресс при движении
    range.addEventListener('input', updateProgress);

    // и сразу при загрузке страницы
    updateProgress();
}); 