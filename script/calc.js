// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // КАЛЬКУЛЯТОР УСЛУГ ЛЕТНИХ КАФЕ
    // Разработчик: Evgenii Andreev | Маридиз
    // Сайт: https://maridiz.ru
    // Telegram: @Zloi_Barmaleika
    // Дата создания: 2026
    // ============================================

    console.log("%cКалькулятор услуг для летних кафе | Разработчик: Evgenii Andreev - Маридиз | https://maridiz.ru", "color: #f5a623; font-size: 16px; font-weight: bold;");

    // --- ПОЛУЧАЕМ ЦЕНЫ ИЗ ГЛОБАЛЬНОЙ ПЕРЕМЕННОЙ ---
    const prices = window.servicePrices || {};

    // Функция для безопасного получения цены
    function getPrice(key, defaultValue) {
        return (typeof prices[key] !== 'undefined' && !isNaN(prices[key]) && prices[key] > 0) ? prices[key] : defaultValue;
    }

    // ---- ПОЛУЧАЕМ ЭЛЕМЕНТЫ ----
    const sketch = document.getElementById('serviceSketch');
    const typovoy = document.getElementById('serviceConstruct');
    const individual = document.getElementById('serviceEng');

    const doc = document.getElementById('serviceDoc');
    const uvedom = document.getElementById('serviceArch');
    const soglas = document.getElementById('servicePermit');
    const pereof = document.getElementById('serviceReissue');

    const egrn = document.getElementById('serviceSupervision');
    const siopr = document.getElementById('service3d');
    const booklet = document.getElementById('serviceBooklet');
    const bti = document.getElementById('serviceBTI');

    // const radioStandard = document.querySelector('input[value="standard"]');
    const buttonDesign = document.getElementById('serviceDesign');
    const radioLabels = document.querySelectorAll('.radio-label');

    const areaSlider = document.getElementById('areaSlider');
    const areaValueDisplay = document.getElementById('areaValueDisplay');

    const totalSpan = document.getElementById('totalAmount');
    const baseSpan = document.getElementById('baseSum');
    const extraSpan = document.getElementById('extraSum');
    const typeSpan = document.getElementById('typeCoeffSpan');
    const areaSpan = document.getElementById('areaImpactSpan');
    const badge = document.getElementById('recommendBadge');
    const resetBtn = document.getElementById('resetBtn');

    // Проверка домена
    const allowedDomains = ['maridiz.ru', 'localhost', '127.0.0.1'];
    const currentDomain = window.location.hostname;
    let isDomainAllowed = true;

    // for (let i = 0; i < allowedDomains.length; i++) {
    //     if (currentDomain === allowedDomains[i] || currentDomain.includes('maridiz')) {
    //         isDomainAllowed = true;
    //         break;
    //     }
    // }

    if (!isDomainAllowed) {
        console.warn('ВНИМАНИЕ! Данный калькулятор разработан Маридиз. Использование без разрешения запрещено.');
        if (badge) {
            badge.innerHTML = '⚠️ Данный калькулятор является авторской разработкой <a href="https://maridiz.ru">Маридиз</a>. Использование без разрешения запрещено.';
            badge.style.background = "#ffebee";
            badge.style.border = "2px solid #f44336";
            badge.style.color = "#c62828";
        }
    }

    // ---- КОНСТАНТЫ ----
    const DESIGN_PRICE_PER_SQM = 500;
    const DISCOUNT_PERCENT = 10;



    // ---- ГЛАВНАЯ ФУНКЦИЯ ОБНОВЛЕНИЯ ----
    function updateAll() {
        let area = parseInt(areaSlider.value);
        if (isNaN(area)) area = 50;
        if (areaValueDisplay) areaValueDisplay.innerText = area + " м²";

        // 1. Сумма проектных работ
        let projectSum = 0;
        if (sketch && sketch.checked) projectSum = getPrice('serviceSketch', 30000);
        if (typovoy && typovoy.checked) projectSum = getPrice('serviceConstruct', 57000);
        if (individual && individual.checked) projectSum = getPrice('serviceEng', 80000);

        // 2. Наценка за площадь
        let areaCoeff = 1.0;
        let areaSurcharge = 0;
        if (area >= 151 && area <= 300) {
            areaCoeff = 1.25;
            areaSurcharge = projectSum * 0.25;
        }
        let finalProjectSum = projectSum * areaCoeff;

        // 3. Сумма согласования
        let soglasSum = 0;
        if (uvedom && uvedom.checked) soglasSum += getPrice('serviceArch', 25000);
        if (soglas && soglas.checked) soglasSum += getPrice('servicePermit', 51000);

        // 4. Сумма дополнительных опций
        let dopSum = 0;
        let egrnPrice = 0;
        let sioprPrice = 0;

        if (doc && doc.checked) dopSum += getPrice('serviceDoc', 14000);
        if (pereof && pereof.checked) dopSum += getPrice('serviceReissue', 27000);
        if (egrn && egrn.checked) {
            egrnPrice = getPrice('serviceSupervision', 4000);
            dopSum += egrnPrice;
        }
        if (siopr && siopr.checked) {
            sioprPrice = getPrice('service3d', 5500);
            dopSum += sioprPrice;
        }
        if (booklet && booklet.checked) dopSum += getPrice('serviceBooklet', 4500);
        if (bti && bti.checked) dopSum += getPrice('serviceBTI', 6000);

        // 5. Скидка
        const hasProject = (sketch && sketch.checked) || (typovoy && typovoy.checked) || (individual && individual.checked);
        const hasSoglasService = (uvedom && uvedom.checked) || (soglas && soglas.checked);
        const hasEgrn = egrn && egrn.checked;
        const hasSiopr = siopr && siopr.checked;
        const hasBothDop = hasEgrn && hasSiopr;

        let discountAmount = 0;
        if (hasProject && hasSoglasService && hasBothDop) {
            discountAmount = Math.round((egrnPrice + sioprPrice) * DISCOUNT_PERCENT / 100);
            dopSum = dopSum - discountAmount;
        }

        // 6. Базовая сумма
        let baseSum = projectSum + soglasSum;
        let subtotal = finalProjectSum + soglasSum + dopSum;

        // 7. Дизайн
        let designPrice = 0;
        if (buttonDesign && buttonDesign.checked) {
            designPrice = area * DESIGN_PRICE_PER_SQM;
        }

        // 8. Итог
        let total = subtotal + designPrice;

        // 9. Обновляем отображение
        if (baseSpan) baseSpan.innerText = baseSum.toLocaleString('ru-RU') + " ₽";
        if (extraSpan) extraSpan.innerText = dopSum.toLocaleString('ru-RU') + " ₽";

        // if (totalSpan) totalSpan.innerText = total.toLocaleString('ru-RU') + " ₽";
        if (totalSpan) {
            const currentValue = parseInt(totalSpan.innerText.replace(/\D/g, '')) || 0;

            if (total !== currentValue) {
                totalSpan.innerText = total.toLocaleString('ru-RU') + " ₽";

                totalSpan.classList.add('calc__total-price_updated');
                setTimeout(() => {totalSpan.classList.remove('calc__total-price_updated');}, 50);
            }
        }

        // Дизайн
        if (typeSpan) {
            typeSpan.innerText = (buttonDesign && buttonDesign.checked) ? designPrice.toLocaleString('ru-RU') + " ₽" : "0 ₽";
        }

        // Наценка за площадь
        // if (areaSpan) {
        //     if (area >= 151 && area <= 300) {
        //         areaSpan.innerText = areaSurcharge > 0 ? "+" + Math.round(areaSurcharge).toLocaleString('ru-RU') + " ₽" : "0 ₽ (выберите проект)";
        //     } else {
        //         areaSpan.innerText = "0 ₽ (до 150 м²)";
        //     }
        // }
        if (areaSpan) {
            if (area >= 151 && area <= 300) {
                areaSpan.innerText = areaSurcharge > 0 ? "+" + Math.round(areaSurcharge).toLocaleString('ru-RU') + " ₽" : "0 ₽";
            } else {
                areaSpan.innerText = "0 ₽";
            }
        }

        // 12. ПРОДАЮЩИЕ РЕКОМЕНДАЦИИ
        if (badge && isDomainAllowed) {
            // Сначала сбрасываем все классы
            // badge.className = 'badge rounded-s';

            const hasProjectCheck = (sketch && sketch.checked) || (typovoy && typovoy.checked) || (individual && individual.checked);
            const hasSoglasCheck = (uvedom && uvedom.checked) || (soglas && soglas.checked);
            const hasEgrnCheck = egrn && egrn.checked;
            const hasSioprCheck = siopr && siopr.checked;
            const hasBothDop = hasEgrnCheck && hasSioprCheck;

            const hasAnyDop = (doc && doc.checked) || (pereof && pereof.checked) || (egrn && egrn.checked) || (siopr && siopr.checked) || (booklet && booklet.checked) || (bti && bti.checked);
            const onlyDopSelected = hasAnyDop && !hasProjectCheck && !hasSoglasCheck;

            const hasTypovoy = typovoy && typovoy.checked;
            const hasIndividual = individual && individual.checked;
            const hasSketch = sketch && sketch.checked;
            const hasFullProject = hasTypovoy || hasIndividual;

            const hasUvedom = uvedom && uvedom.checked;
            const hasSoglasOnly = soglas && soglas.checked;

            // Цвета для разных сценариев
            if (onlyDopSelected) {
                badge.innerHTML = "Уверены, что не пригодится наша помощь в Проектировании или Согласовании?";
                badge.className = 'rounded-s calc__total-badge calc__total-badge_info';
            }
            else if (hasFullProject && !hasSoglasCheck) {
                badge.innerHTML = "Проект требует обязательного согласования. Можно добавить «Согласование летней веранды», чтобы запустить кафе легально.";
                badge.className = 'rounded-s calc__total-badge calc__total-badge_warning';
            }
            else if (hasSketch && !hasSoglasCheck) {
                badge.innerHTML = "Можно добавить «Уведомление о размещении», чтобы получить разрешение на размещение веранды за 1 день!";
                badge.className = 'rounded-s calc__total-badge calc__total-badge_warning';
            }
            else if (hasUvedom && !hasProjectCheck && !hasSoglasOnly) {
                badge.innerHTML = "Можно добавить «Фотомонтаж», чтобы визуализировать веранду для согласования.";
                badge.className = 'rounded-s calc__total-badge calc__total-badge_warning';
            }
            else if (hasSketch && hasUvedom && hasBothDop && !hasFullProject && !hasSoglasOnly) {
                const premiumSetPrice = egrnPrice + sioprPrice;
                const discountAmountCalc = Math.round(premiumSetPrice * DISCOUNT_PERCENT / 100);
                badge.innerHTML = `У вас полный набор для быстрого согласования:<br/> Фотомонтаж + Уведомление + ЕГРН + СИОПР.<br/> Вы сэкономили ${discountAmountCalc.toLocaleString('ru-RU')} ₽`;
                badge.className = 'rounded-s calc__total-badge calc__total-badge_premium';
            }
            else if (hasSketch && hasUvedom && hasEgrnCheck && !hasSioprCheck && !hasFullProject && !hasSoglasOnly) {
                const sioprPriceVal = getPrice('service3d', 5500);
                const discountAmountVal = Math.round(sioprPriceVal * DISCOUNT_PERCENT / 100);
                const finalPrice = sioprPriceVal - discountAmountVal;
                badge.innerHTML = `У вас уже есть фотомонтаж, уведомление и ЕГРН! <br/> Можно добавить «Включение в СИОПР» всего за ${finalPrice.toLocaleString('ru-RU')} ₽ вместо ${sioprPriceVal.toLocaleString('ru-RU')} ₽ и получите скидку 10% на обе доп услуги!`;
                badge.className = 'rounded-s calc__total-badge calc__total-badge_discount';
            }
            else if (hasSketch && hasUvedom && hasSioprCheck && !hasEgrnCheck && !hasFullProject && !hasSoglasOnly) {
                const egrnPriceVal = getPrice('serviceSupervision', 4000);
                const discountAmountVal = Math.round(egrnPriceVal * DISCOUNT_PERCENT / 100);
                const finalPrice = egrnPriceVal - discountAmountVal;
                badge.innerHTML = `У вас уже есть фотомонтаж, уведомление и СИОПР! <br/> Можно добавить «Заказ ЕГРН» всего за ${finalPrice.toLocaleString('ru-RU')} ₽ вместо ${egrnPriceVal.toLocaleString('ru-RU')} ₽ и получите скидку 10% на обе доп услуги!`;
                badge.className = 'rounded-s calc__total-badge calc__total-badge_discount';
            }
            else if (hasSketch && hasUvedom && !hasBothDop && !hasEgrnCheck && !hasSioprCheck && !hasFullProject && !hasSoglasOnly) {
                const egrnPriceVal = getPrice('serviceSupervision', 4000);
                const sioprPriceVal = getPrice('service3d', 5500);
                const fullPrice = egrnPriceVal + sioprPriceVal;
                const discountAmountVal = Math.round(fullPrice * DISCOUNT_PERCENT / 100);
                const finalPrice = fullPrice - discountAmountVal;
                badge.innerHTML = `Можно добавить «Заказ ЕГРН» и «Включение в СИОПР» и получите скидку 10% — всего за ${finalPrice.toLocaleString('ru-RU')}₽ вместо ${fullPrice.toLocaleString('ru-RU')}₽!`;
                badge.className = 'rounded-s calc__total-badge calc__total-badge_offer';
            }
            else if (hasProjectCheck && hasUvedom && !hasSoglasOnly) {
                badge.innerHTML = "Выбран проект + уведомление. <br/> Для уведомления достаточно фотомонтажа или выберите «Согласование летней веранды» для полного пакета.";
                badge.className = 'rounded-s calc__total-badge calc__total-badge_warning';
            }
            else if (hasProjectCheck && hasSoglasCheck && hasEgrnCheck && !hasSioprCheck) {
                const sioprPriceVal = getPrice('service3d', 5500);
                const discountAmountVal = Math.round(sioprPriceVal * DISCOUNT_PERCENT / 100);
                const finalPrice = sioprPriceVal - discountAmountVal;
                badge.innerHTML = `У вас уже есть проект, согласование и ЕГРН! <br/> Можно добавить «Включение в СИОПР» всего за ${finalPrice.toLocaleString('ru-RU')} ₽ вместо ${sioprPriceVal.toLocaleString('ru-RU')} ₽ и получите скидку 10% на обе доп услуги!`;
                badge.className = 'rounded-s calc__total-badge calc__total-badge_discount';
            }
            else if (hasProjectCheck && hasSoglasCheck && hasSioprCheck && !hasEgrnCheck) {
                const egrnPriceVal = getPrice('serviceSupervision', 4000);
                const discountAmountVal = Math.round(egrnPriceVal * DISCOUNT_PERCENT / 100);
                const finalPrice = egrnPriceVal - discountAmountVal;
                badge.innerHTML = `У вас уже есть проект, согласование и СИОПР! <br/> Можно добавить «Заказ ЕГРН» всего за ${finalPrice.toLocaleString('ru-RU')} ₽ вместо ${egrnPriceVal.toLocaleString('ru-RU')} ₽ и получите скидку 10% на обе доп услуги!`;
                badge.className = 'rounded-s calc__total-badge calc__total-badge_discount';
            }
            else if (hasProjectCheck && hasSoglasCheck && hasBothDop) {
                const premiumSetPrice = egrnPrice + sioprPrice;
                const discountAmountCalc = Math.round(premiumSetPrice * DISCOUNT_PERCENT / 100);
                badge.innerHTML = `Набор «Премиум»: проект + согласование + ЕГРН + СИОПР.<br/> Вы сэкономили ${discountAmountCalc.toLocaleString('ru-RU')} ₽`;
                badge.className = 'rounded-s calc__total-badge calc__total-badge_premium';
            }
            else if (hasProjectCheck && hasSoglasCheck && !hasEgrnCheck && !hasSioprCheck) {
                const egrnPriceVal = getPrice('serviceSupervision', 4000);
                const sioprPriceVal = getPrice('service3d', 5500);
                const fullPrice = egrnPriceVal + sioprPriceVal;
                const discountAmountVal = Math.round(fullPrice * DISCOUNT_PERCENT / 100);
                const finalPrice = fullPrice - discountAmountVal;
                badge.innerHTML = `Проект и согласование есть. <br/> Можно добавить «Заказ ЕГРН» и «Включение в СИОПР» и получите скидку 10% — всего за ${finalPrice.toLocaleString('ru-RU')}₽ вместо ${fullPrice.toLocaleString('ru-RU')}₽!`;
                badge.className = 'rounded-s calc__total-badge calc__total-badge_offer';
            }
            else if (hasProjectCheck && !hasSoglasCheck && !hasFullProject) {
                badge.innerHTML = "Можно добавить «Уведомление о размещении» или «Согласование летней веранды», чтобы запустить кафе легально.";
                badge.className = 'rounded-s calc__total-badge calc__total-badge_warning';
            }
            else if (!hasProjectCheck && hasSoglasCheck) {
                badge.innerHTML = "У вас есть согласование. <br/> Можно добавить проект (типовой, индивидуальный или фотомонтаж), чтобы подать на согласование.";
                badge.className = 'rounded-s calc__total-badge calc__total-badge_info';
            }
            else {
                badge.innerHTML = "Выберите нужные услуги для регистрации летней веранды";
                badge.className = 'rounded-s calc__total-badge calc__total-badge_default';
            }
        }

        // 13. Строка скидки
        const rowDiscount = document.getElementById('rowDiscount');
        const discountSumSpan = document.getElementById('discountSum');
        if (rowDiscount && discountSumSpan) {
            if (discountAmount > 0) {
                discountSumSpan.innerText = "- " + discountAmount.toLocaleString('ru-RU') + " ₽";
                rowDiscount.style.display = 'flex';
            } else {
                rowDiscount.style.display = 'none';
            }
        }
    }

    // ---- ЛОГИКА: ТОЛЬКО ОДНА УСЛУГА В ПРОЕКТИРОВАНИИ ----
    function setupProjectExclusive() {
        const projectChecks = [sketch, typovoy, individual];
        function handleProjectClick(e) {
            const current = e.target;
            if (current.checked) {
                projectChecks.forEach(cb => {
                    if (cb && cb !== current) cb.checked = false;
                });
            }
            updateAll();
        }
        projectChecks.forEach(cb => {
            if (cb) cb.addEventListener('change', handleProjectClick);
        });
    }

    // ---- ЛОГИКА: ТОЛЬКО ОДНА УСЛУГА В СОГЛАСОВАНИИ ----
    function setupSoglasExclusive() {
        const soglasChecks = [uvedom, soglas];
        function handleSoglasClick(e) {
            const current = e.target;
            if (current.checked) {
                soglasChecks.forEach(cb => {
                    if (cb && cb !== current) cb.checked = false;
                });
            }
            updateAll();
        }
        soglasChecks.forEach(cb => {
            if (cb) cb.addEventListener('change', handleSoglasClick);
        });
    }

    // ---- НАВЕШИВАЕМ ОБРАБОТЧИКИ ----
    function bindEvents() {
        const dopChecks = [doc, pereof, egrn, siopr, booklet, bti];
        dopChecks.forEach(cb => {
            if (cb) cb.addEventListener('change', updateAll);
        });

        // if (radioStandard) radioStandard.addEventListener('change', updateAll);
        if (buttonDesign) buttonDesign.addEventListener('change', updateAll);
        if (areaSlider) areaSlider.addEventListener('input', updateAll);

        radioLabels.forEach(label => {
            label.addEventListener('click', function () {
                setTimeout(function () {
                    radioLabels.forEach(function (l) {
                        var radio = l.querySelector('input[type="radio"]');
                        if (radio && radio.checked) {
                            l.classList.add('active');
                        } else {
                            l.classList.remove('active');
                        }
                    });
                    updateAll();
                }, 10);
            });
        });

        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                var allChecks = [sketch, typovoy, individual, doc, uvedom, soglas, pereof, egrn, siopr, booklet, bti];
                allChecks.forEach(function (cb) { if (cb) cb.checked = false; });
                // if (radioStandard) radioStandard.checked = true;
                if (buttonDesign) buttonDesign.checked = false;
                if (areaSlider) {
                    areaSlider.value = "50";
                    areaSlider.dispatchEvent(new Event('input', { bubbles: true }));
                }
                radioLabels.forEach(function (l) { l.classList.remove('active'); });
                // if (radioStandard) {
                //     var parent = radioStandard.closest('.radio-label');
                //     if (parent) parent.classList.add('active');
                // }
                updateAll();
            });
        }
    }

    // ---- СБОР ДАННЫХ ДЛЯ ОТПРАВКИ ----
    function collectCalculatorData() {
        let area = parseInt(areaSlider.value);
        if (isNaN(area)) area = 50;
        const total = document.getElementById('totalAmount')?.innerText || '0 ₽';

        const selectedServices = [];
        const servicesList = [
            { id: 'serviceConstruct', name: 'Типовой проект' },
            { id: 'serviceEng', name: 'Индивидуальный проект' },
            { id: 'serviceSketch', name: 'Фотомонтаж' },
            { id: 'servicePermit', name: 'Согласование летней веранды' },
            { id: 'serviceArch', name: 'Уведомление о размещении' },
            { id: 'serviceReissue', name: 'Переоформление' },
            { id: 'serviceDoc', name: 'Сбор и проверка документов' },
            { id: 'serviceSupervision', name: 'Заказ и получение ЕГРН' },
            { id: 'service3d', name: 'Включение заведения в СИОПР' },
            { id: 'serviceBooklet', name: 'Печать дополнительного буклета проекта' },
            { id: 'serviceBTI', name: 'Заказ архивной копии БТИ' }
        ];

        servicesList.forEach(service => {
            const el = document.getElementById(service.id);
            if (el && el.checked) selectedServices.push(service.name);
        });

        const cafeType = document.querySelector('input[name="cafeType"]:checked')?.value === 'premium' ? 'Премиум (+Дизайн)' : 'Стандарт';

        let designText = '';
        if (buttonDesign && buttonDesign.checked && typeSpan && typeSpan.innerText !== '0 ₽') {
            designText = `Дизайн: ${typeSpan.innerText}\n`;
        }

        let areaSurchargeText = '';
        if (areaSpan && areaSpan.innerText !== '0 ₽ (до 150 м²)' && areaSpan.innerText !== '0 ₽ (выберите проект)') {
            areaSurchargeText = `📐 Наценка за площадь: ${areaSpan.innerText}\n`;
        }

        let discountText = '';
        const discountSpan = document.getElementById('discountSum');
        if (discountSpan && discountSpan.innerText !== '0 ₽') {
            discountText = `🎁 Скидка: ${discountSpan.innerText}\n`;
        }

        let servicesText = selectedServices.length === 0 ? '❌ Не выбраны' : selectedServices.map(s => `  • ${s}`).join('\n');

        const comment = `<b>Выбранные услуги:</b>
${servicesText}

<b>ИТОГО:</b> ${total}

<b>Площадь:</b> ${area} м²
<b>Тип:</b> ${cafeType}
${designText}${areaSurchargeText}${discountText}`;

        return { comment, total, selectedServices, area, cafeType };
    }

    async function sendToTelegram(name, phone, comment) {
        const formData = new FormData();
        formData.append('action', 'send_calc_order');
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('comment', comment);
        formData.append('page', window.location.href);

        try {
            const response = await fetch('/wp-admin/admin-ajax.php', {
                method: 'POST',
                credentials: 'same-origin',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                alert('✅ Заявка успешно отправлена!');
                return true;
            } else {
                console.error('Server error:', result);
                alert('❌ Ошибка при отправке');
                return false;
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('❌ Ошибка при отправке');
            return false;
        }
    }

    function openCalcModal() {
        const calcData = collectCalculatorData();
        if (calcData.selectedServices.length === 0) {
            alert('⚠️ Выберите хотя бы одну услугу перед отправкой заявки');
            return;
        }

        const modal = document.getElementById('calculator-order');
        if (!modal) {
            console.error('Модальное окно calculator-order не найдено');
            return;
        }

        const totalSpanModal = modal.querySelector('#calcOrderTotal');
        if (totalSpanModal) totalSpanModal.innerText = calcData.total;

        const nameInput = modal.querySelector('#calcOrderName');
        const phoneInput = modal.querySelector('#calcOrderPhone');
        if (nameInput) nameInput.value = '';
        if (phoneInput) phoneInput.value = '';

        const sendBtn = modal.querySelector('#calcOrderSendBtn');
        if (sendBtn) sendBtn.disabled = false;

        modal.showModal();

        const newSendBtn = modal.querySelector('#calcOrderSendBtn');
        const oldHandler = newSendBtn._calcHandler;
        if (oldHandler) newSendBtn.removeEventListener('click', oldHandler);

        const handler = async () => {
            const name = modal.querySelector('#calcOrderName')?.value.trim();
            const phone = modal.querySelector('#calcOrderPhone')?.value.trim();
            if (!name || !phone) {
                alert('Пожалуйста, заполните имя и телефон');
                return;
            }
            const btn = modal.querySelector('#calcOrderSendBtn');
            const originalText = btn.innerText;
            btn.innerText = '⏳ Отправка...';
            btn.disabled = true;
            const success = await sendToTelegram(name, phone, calcData.comment);
            btn.innerText = originalText;
            btn.disabled = false;
            if (success) modal.close();
        };

        newSendBtn._calcHandler = handler;
        newSendBtn.addEventListener('click', handler);

        const closeBtn = modal.querySelector('#calcOrderCloseBtn');
        if (closeBtn && !closeBtn._calcHandlerClose) {
            closeBtn._calcHandlerClose = true;
            closeBtn.addEventListener('click', () => modal.close());
        }

        modal.addEventListener('click', function onModalClick(e) {
            if (e.target === modal) {
                modal.close();
                modal.removeEventListener('click', onModalClick);
            }
        }, { once: true });
    }

    // ---- ИНИЦИАЛИЗАЦИЯ ----
    setupProjectExclusive();
    setupSoglasExclusive();
    bindEvents();
    updateAll();

    const calcSubmitBtn = document.getElementById('calcSubmitBtn');
    if (calcSubmitBtn) {
        calcSubmitBtn.addEventListener('click', openCalcModal);
    }

});