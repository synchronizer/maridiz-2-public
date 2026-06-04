
// document.addEventListener('click', (e) => {
//     document._clickedButton = e.target.closest('[popovertarget]');
//     if (!document._clickedButton) return;

// });

// Array.from(document.querySelectorAll('.tooltip')).forEach(tooltip => {

//     const tooltipPosition = (source, target) => {
//         console.log('tooltipPosition');
//         source = source || document._clickedButton;
//         if (!source || !target) return;

//         const margin = parseFloat(getComputedStyle(target).marginLeft);
//         const sourceBoundingRect = source.getBoundingClientRect();


//         console.log(sourceBoundingRect);

//         if (sourceBoundingRect.left > window.innerWidth / 2) {
//             target.style.left = 'auto';
//             target.style.right = `${window.innerWidth - sourceBoundingRect.left - sourceBoundingRect.width - margin}px`;
//         } else {
//             target.style.right = 'auto';
//             target.style.left = `${sourceBoundingRect.left - margin}px`;
//         }

//         if (sourceBoundingRect.top > window.innerHeight / 2) {
//             target.style.top = 'auto';
//             target.style.bottom = `${window.innerHeight - sourceBoundingRect.top}px`;
//         } else {
//             target.style.bottom = 'auto';
//             target.style.top = `${sourceBoundingRect.top + sourceBoundingRect.height}px`;
//         }





//     }
//     let updatePosition;

//     tooltip.addEventListener('beforetoggle', e => {
//         const { source, target } = e;

//         if (e.newState === 'open') {
//             updatePosition = () => tooltipPosition(source, target);

//             window.addEventListener('resize', updatePosition);
//             window.addEventListener('scroll', updatePosition);

//             updatePosition();
//         } else {
//             window.removeEventListener('resize', updatePosition);
//             window.removeEventListener('scroll', updatePosition);
//         }
//     });
// })               




// ==========================
// SOURCE STORAGE
// ==========================
const tooltipSources = new WeakMap();

document.addEventListener('click', (e) => {
    const button = e.target.closest('[popovertarget]');
    if (!button) return;

    const id = button.getAttribute('popovertarget');
    const tooltip = document.getElementById(id);

    if (!tooltip) return;

    // сохраняем источник для конкретного тултипа
    tooltipSources.set(tooltip, button);
});


// ==========================
// POSITIONING
// ==========================
function positionTooltip(source, tooltip) {
    if (!source || !tooltip) return;

    const rect = source.getBoundingClientRect();
    const margin = parseFloat(getComputedStyle(tooltip).marginLeft) || 0;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // горизонталь
    if (rect.left > vw / 2) {
        tooltip.style.left = 'auto';
        tooltip.style.right = `${vw - rect.right - margin}px`;
    } else {
        tooltip.style.right = 'auto';
        tooltip.style.left = `${rect.left - margin}px`;
    }

    // вертикаль
    if (rect.top > vh / 2) {
        tooltip.style.top = 'auto';
        tooltip.style.bottom = `${vh - rect.top}px`;
    } else {
        tooltip.style.bottom = 'auto';
        tooltip.style.top = `${rect.bottom}px`;
    }
}


// ==========================
// RAF UPDATER (NO EVENTS)
// ==========================
function createUpdater(getSource, tooltip) {
    let rafId;

    function loop() {
        const source = getSource();
        positionTooltip(source, tooltip);
        rafId = requestAnimationFrame(loop);
    }

    return {
        start() {
            rafId = requestAnimationFrame(loop);
        },
        stop() {
            cancelAnimationFrame(rafId);
        }
    };
}


// ==========================
// INIT
// ==========================
document.querySelectorAll('.tooltip').forEach((tooltip) => {

    let updater;

    tooltip.addEventListener('beforetoggle', (e) => {

        if (e.newState === 'open') {
            const sourceGetter = () => tooltipSources.get(tooltip);

            updater = createUpdater(sourceGetter, tooltip);
            updater.start();

        } else {
            updater?.stop();
        }
    });

});