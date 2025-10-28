document.addEventListener('keypress', e => {
    if (e.code != 'Space' && e.code != 'Enter') return;
    document.activeElement.click();
})
