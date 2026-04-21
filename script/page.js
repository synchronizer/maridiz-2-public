document.addEventListener('keypress', e => {
    if (e.code != 'Space' && e.code != 'Enter') return;
    document.activeElement.click();
})





document.addEventListener('click', (e) => {
  const clickTo = e.target.closest('[data-click-to]');
  if (clickTo) {
    const value = clickTo.dataset.clickTo;
    const targets = document.querySelectorAll(`[data-click-target="${value}"]`);

    if (targets.length) {
      targets.forEach(el => {
        el.click()
        el.focus()
      });
    }

  }

  const clickTarget = e.target.closest('[data-click-target]');
  if (clickTarget) {
    const value = clickTarget.dataset.clickTarget;
    const froms = document.querySelectorAll(`[data-click-from="${value}"]`);

    if (froms.length) {
      froms.forEach(el => {
        el.click()
        el.focus()
      });
    }

  }
});



