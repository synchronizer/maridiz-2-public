
window.startCookies = () => {

    // =============== МОЙ КОД МЕТРИКИ ==================
    if (window.__ymLoaded) return;
    window.__ymLoaded = true;

    (function (m, e, t, r, i, k, a) {
        m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
        m[i].l = 1 * new Date();

        // твоя проверка на повторное подключение
        for (var j = 0; j < document.scripts.length; j++) {
            if (document.scripts[j].src === r) return;
        }

        k = e.createElement(t);
        a = e.getElementsByTagName(t)[0];
        k.async = 1;
        k.src = r;
        a.parentNode.insertBefore(k, a);

    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

    ym(87322816, 'init', {
        webvisor: true,
        clickmap: true,
        referrer: document.referrer,
        url: location.href,
        accurateTrackBounce: true,
        trackLinks: true
    });

    // =============== ТВОЙ КОД МЕТРИКИ ==================
    // (function (m, e, t, r, i, k, a) { m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) }; m[i].l = 1 * new Date(); for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } } k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a) })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym'); ym(87322816, 'init', { webvisor: true, clickmap: true, referrer: document.referrer, url: location.href, accurateTrackBounce: true, trackLinks: true });
};


if (!window.localStorage.getItem('acceptCookies')) {
    pushNotification({
        type: 'no-icon',
        text: `
        <div style="display: flex; flex-direction: column; gap: var(--gap-xs);">
            <div style="max-width: 45ch; font-size: var(--typo-text-s-font-size); line-height: var(--typo-text-s-line-height);">
            Мы используем cookies, а также сервис веб-аналитики Яндекс Метрика, для анализа поведения пользователей и улучшения работы сайта. Нажимая «Принять», вы соглашаетесь на обработку ваших данных в соответствии с <a href="/privacy-policy" target="_blank" class="link link_style_default">Политикой обработки персональных данных</a>
            </div>
            <div style="display: flex; gap: var(--gap-xxs); flex-wrap: wrap;">
                <button class="button button_style_grey button_size_s rounded-s button_shape_default" onclick="window.localStorage.setItem('acceptCookies', 'y'); this.closest('.notifications__item').remove(); window.startCookies();">Принять</button>
                <button class="button button_style_grey button_size_s rounded-s button_shape_default" onclick="window.localStorage.setItem('acceptCookies', 'n'); this.closest('.notifications__item').remove();">Отклонить</button>
            </div>
        </div>
        `,
        closeAction: () => {

        },
    })
} else if (window.localStorage.getItem('acceptCookies') === 'y') {
    window.startCookies();
}