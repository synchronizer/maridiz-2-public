
Array.from(document.querySelectorAll('.call-request')).forEach(item => {
    const title = item.querySelector('.call-request__title'),
        name = item.querySelector('[name="name"]'),
        phone = item.querySelector('[name="phone"]'),
        send = item.querySelector('[name="send"]'),
        email = item.querySelector('[name="email"]'),
        comment = item.querySelector('[name="comment"]');
    // utm_source = item.getAttribute('utm_source'),
    // utm_medium = item.getAttribute('utm_medium'),
    // utm_campaign = item.getAttribute('utm_campaign'),
    // utm_term = item.getAttribute('utm_term'),
    // utm_content = item.getAttribute('utm_content');

    function checkFields() {
        if (
            (name && !name.value)
            || (phone && phone.value.length) < 3
            // || (email && !email.b.valid)
        ) { send.setAttribute('disabled', '') } else { send.removeAttribute('disabled') }
    };
    checkFields();
    if (name) name.addEventListener('input', checkFields);
    if (phone) phone.addEventListener('input', checkFields);
    if (email) email.addEventListener('input', checkFields);

    send.onclick = () => {
        const form = new FormData();
        form.append('TYPE', 'feedback');
        if (title) form.append('TITLE', title.textContent);
        if (name) form.append('NAME', name.value);
        if (phone) form.append('PHONE', phone.value);
        if (email) form.append('EMAIL', email.value);
        if (comment) form.append('COMMENT', comment.value);
        form.append('PAGE', location.pathname);

        // if (utm_source) form.append('UTM_SOURCE', utm_source);
        // if (utm_medium) form.append('UTM_MEDIUM', utm_medium);
        // if (utm_campaign) form.append('UTM_CAMPAIGN', utm_campaign);
        // if (utm_term) form.append('UTM_TERM', utm_term);
        // if (utm_content) form.append('UTM_CONTENT', utm_content);

        // send.b.loadStart();
        // if (name) name.b.disable();
        // if (phone) phone.b.disable();
        // if (email) email.b.disable();
        // if (comment) comment.b.disable();


        fetch('https://evev.tupo.best/action-1.php', {
            method: 'POST',
            body: form,
        }).then(response => {

            if (response.status == 200) {
                window.pushNotification({
                    text: `Заявка на звонок по номеру ${phone.value} отправлена`,
                    type: 'success',
                    autoclose: true,
                })
            }
            else {
                window.pushNotification({
                    text: `Заявку на звонок по не удалось отправить`,
                    type: 'error',
                    autoclose: false,
                })
            }
        }).catch(() => {
            window.pushNotification({
                text: `Заявку на звонок возможно не удалось отправить`,
                type: 'attention',
                autoclose: true,
            })
        })

    }
})