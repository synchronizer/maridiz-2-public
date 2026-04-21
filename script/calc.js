// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // КАЛЬКУЛЯТО�  УСЛУГ ЛЕТН�?Х КАФЕ
    // � азработчик: Evgenii Andreev | Маридиз
    // Сайт: https://maridiz.ru
    // Telegram: @Zloi_Barmaleika
    // Дата создания: 2026
    // ============================================

    console.log("%cКалькулятор услуг для летних кафе | � азработчик: Evgenii Andreev - Маридиз | https://maridiz.ru", "color: #f5a623; font-size: 16px; font-weight: bold;");

    // ============================================
    // НАСТ� ОЙК�? КАЛЬКУЛЯТО� А (для удобного редактирования)
    // ============================================
    const CONFIG = {
        // Цены за услуги (будут дополнены из PHP)
        prices: window.servicePrices || {},

        // Стоимость дизайна за м² в зависимости от площади
        designPrices: [
            { min: 20, max: 40, price: 1800 },
            { min: 41, max: 80, price: 1400 },
            { min: 81, max: 150, price: 1200 },
            { min: 151, max: 300, price: 900 }
        ],

        // Коэффициенты наценки за площадь
        areaSurcharge: {
            minArea: 151,
            maxArea: 300,
            coefficient: 1.25  // +25%
        },

        // Коэффициенты наценки за локацию
        locationSurcharge: {
            zelograd: { project: 0.20, soglas: 0.15, name: "Зеленоград" },
            mo30km: { project: 0.30, soglas: 0.25, name: "ТиНАО/МО" }
        },

        // Тексты для бейджа (продающие сообщения)
        badgeMessages: {
            // 1. Ничего не выбрано
            nothingSelected: "Вам также пригодится наша помощь в Проектировании или Согласовании",

            // 2. Типовой или �?ндивидуальный проект (без согласования)
            projectWithoutSoglas: "Проект требует обязательного Согласования летней веранды, чтобы запустить кафе легально",

            // 3. Фотомонтаж (без согласования)
            sketchWithoutSoglas: "Чтобы получить разрешение на размещение веранды за 1 день, вам пригодится «Уведомление о размещении»",

            // 4. Согласование летней веранды (без проекта)
            soglasWithoutProject: "Мы также можем разработать для вас Типовой проект для получения дислокации",

            // 5. Уведомление о размещении (без проекта)
            uvedomWithoutProject: "Вам также может пригодиться фотомонтаж, чтобы согласовать по упрощенной системе",

            // 6. Типовой проект + Согласование
            typovoyAndSoglas: "Для регистрации необходима выписка из ЕГ� Н и включение в С�?ОП� , добавьте, чтобы мы сделали это за вас",

            // 7. Типовой проект + Согласование + ЕГ� Н
            typovoySoglasEgrn: "Необходимо обязательно подтвердить включение в С�?ОП� , добавьте, чтобы мы сделали это за вас",

            // 8. Типовой проект + Согласование + С�?ОП� 
            typovoySoglasSiopr: "Вам может пригодиться «Заказ ЕГ� Н», добавьте, чтобы мы сделали это за вас",

            // 9. Фотомонтаж + Уведомление
            sketchAndUvedom: "Необходимо обязательно подтвердить включение в С�?ОП� , добавьте, чтобы мы сделали это за вас",

            // 10. �?ндивидуальный проект + Согласование
            individualAndSoglas: "Для согласования индивидуального решения понадобится выписка из ЕГ� Н",

            // 11. �?ндивидуальный проект + Согласование + ЕГ� Н
            individualSoglasEgrn: "Отправьте заявку прямо сейчас, чтобы мы начали работу над вашим индивидуальным проектом уже сегодня",

            // 12. Типовой проект + Согласование + ЕГ� Н + С�?ОП�  (полный набор)
            fullTypovoySet: "Отправьте заявку прямо сейчас, чтобы мы начали работу по включению в дислокацию уже сегодня",

            // 13. Фотомонтаж + Уведомление + С�?ОП� 
            sketchUvedomSiopr: "Отправьте заявку прямо сейчас, чтобы мы начали работу по регистрации вашей веранды уже сегодня",

            // 14. Проект (любой) + Уведомление
            projectAndUvedom: "Если планируете получить дислокацию, вам нужно «Согласование летней веранды».<br/>Для уведомления о размещении достаточно Фотомонтажа",

            // 15. Только Переоформление
            onlyReissue: "Отправьте заявку прямо сейчас, чтобы мы начали работу по переоформлению веранды на вашу организацию уже сегодня",

            // 16. Только Сбор и проверка документов
            onlyDoc: "Приедем на объект и вместе с вами разберемся во всех документах. Выясним каких не хватает и составим план по их получению.",

            // Дефолтное сообщение
            default: "Выберите нужные услуги для регистрации летней веранды"
        },

        // CSS классы для бейджа
        badgeClasses: {
            info: 'rounded-s calc__total-badge calc__total-badge_info',
            warning: 'rounded-s calc__total-badge calc__total-badge_warning',
            premium: 'rounded-s calc__total-badge calc__total-badge_premium',
            discount: 'rounded-s calc__total-badge calc__total-badge_discount',
            offer: 'rounded-s calc__total-badge calc__total-badge_offer',
            default: 'rounded-s calc__total-badge calc__total-badge_default'
        },

        // � азрешенные домены
        allowedDomains: ['maridiz.ru', 'localhost', '127.0.0.1']
    };

    



    // ============================================
    // Функция для безопасного получения цены
    // ============================================
    function getPrice(key, defaultValue) {
        return (typeof CONFIG.prices[key] !== 'undefined' && !isNaN(CONFIG.prices[key]) && CONFIG.prices[key] > 0)
            ? CONFIG.prices[key]
            : defaultValue;
    }

    // ============================================
    // ПОЛУЧАЕМ ВСЕ �ЛЕМЕНТЫ DOM (единый блок)
    // ============================================

    // --- Чекбоксы услуг ---
    const elements = {
        // Проектирование
        sketch: document.getElementById('serviceSketch'),
        typovoy: document.getElementById('serviceConstruct'),
        individual: document.getElementById('serviceEng'),

        // Документы и согласование
        doc: document.getElementById('serviceDoc'),
        uvedom: document.getElementById('serviceArch'),
        soglas: document.getElementById('servicePermit'),
        pereof: document.getElementById('serviceReissue'),

        // Дополнительные услуги
        egrn: document.getElementById('serviceSupervision'),
        siopr: document.getElementById('service3d'),
        booklet: document.getElementById('serviceBooklet'),
        bti: document.getElementById('serviceBTI'),

        // Дизайн
        buttonDesign: document.getElementById('serviceDesign'),

        // Локация (радио-кнопки в новом стиле)
        locationMoscow: document.querySelector('input[name="cafeType"][value="moscow"]'),
        locationZelograd: document.querySelector('input[name="cafeType"][value="zelograd"]'),
        locationMo30km: document.querySelector('input[name="cafeType"][value="mo_30km"]'),

        // Площадь
        areaSlider: document.getElementById('areaSlider'),
        areaValueDisplay: document.getElementById('areaValueDisplay'),
        areaValueInput: document.getElementById('areaValueInput'),

        // Отображение результатов
        totalSpan: document.getElementById('totalAmount'),
        baseSpan: document.getElementById('baseSum'),
        extraSpan: document.getElementById('extraSum'),
        typeSpan: document.getElementById('typeCoeffSpan'),
        areaSpan: document.getElementById('areaImpactSpan'),
        discountSumSpan: document.getElementById('discountSum'),

        // Бейдж и кнопки
        badge: document.getElementById('recommendBadge'),
        resetBtn: document.getElementById('resetBtn'),
        calcSubmitBtn: document.getElementById('calcSubmitBtn'),

        // Строки в детализации
        rowDiscount: document.getElementById('rowDiscount'),
        rowBase: document.getElementById('rowBase'),
        rowDesign: document.getElementById('rowDesign'),
        rowArea: document.getElementById('rowArea'),
        rowLocation: document.getElementById('rowLocation'),
        rowExtra: document.getElementById('rowExtra'),
        locationSurchargeSpan: document.getElementById('locationSurchargeSpan'),

        // Total container
        totalContainer: document.querySelector('.calc__total-container')
    };

    // Кнопки локации (все label для стилизации)
    const locationLabels = document.querySelectorAll('.button');

    // Модальное окно
    const modal = document.getElementById('calculator-order');

    // ============================================
    // П� ОВЕ� КА ДОМЕНА
    // ============================================
    let isDomainAllowed = true;
    const currentDomain = window.location.hostname;

    if (!isDomainAllowed && elements.badge) {
        console.warn('ВН�?МАН�?Е! Данный калькулятор разработан Маридиз. �?спользование без разрешения запрещено.');
        elements.badge.innerHTML = '� ️ Данный калькулятор является авторской разработкой <a href="https://maridiz.ru">Маридиз</a>. �?спользование без разрешения запрещено.';
        elements.badge.style.background = "#ffebee";
        elements.badge.style.border = "2px solid #f44336";
        elements.badge.style.color = "#c62828";
    }

    // ============================================
    // Функция для вычисления высоты total
    // ============================================

    function calculateTotalContainerHeight() {
        elements.totalContainer.style.setProperty('--_height', elements.totalContainer.offsetHeight + 'px');
    }
    
    calculateTotalContainerHeight();

    window.addEventListener('resize', () => {
        calculateTotalContainerHeight();
    })

    // ============================================
    // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦ�?�?
    // ============================================

    // Получение цены дизайна в зависимости от площади
    function getDesignPricePerSqm(area) {
        for (const tier of CONFIG.designPrices) {
            if (area >= tier.min && area <= tier.max) {
                return tier.price;
            }
        }
        return 900;
    }

    // Получение коэффициентов локации и наценки
    function getLocationData() {
        if (elements.locationZelograd && elements.locationZelograd.checked) {
            return {
                project: 1.20,
                soglas: 1.15,
                name: "Зеленоград",
                surchargeProject: CONFIG.locationSurcharge.zelograd.project,
                surchargeSoglas: CONFIG.locationSurcharge.zelograd.soglas
            };
        }
        if (elements.locationMo30km && elements.locationMo30km.checked) {
            return {
                project: 1.30,
                soglas: 1.25,
                name: "ТиНАО/МО",
                surchargeProject: CONFIG.locationSurcharge.mo30km.project,
                surchargeSoglas: CONFIG.locationSurcharge.mo30km.soglas
            };
        }
        return {
            project: 1.0,
            soglas: 1.0,
            name: "Москва",
            surchargeProject: 0,
            surchargeSoglas: 0
        };
    }

    // Обновление отображения цены дизайна в лейбле
    function updateDesignLabelPrice(area) {
        const designPriceSpan = document.getElementById('designPricePerSqm');
        if (designPriceSpan) {
            const pricePerSqm = getDesignPricePerSqm(area);
            designPriceSpan.innerText = pricePerSqm.toLocaleString('ru-RU');
        }
    }

    // Обновление прогресса слайдера
    // function updateSliderProgress() {
    //     const slider = elements.areaSlider;
    //     if (slider) {
    //         const min = slider.min || 20;
    //         const max = slider.max || 300;
    //         const val = slider.value;
    //         const percent = (val - min) / (max - min) * 100;
    //         slider.style.setProperty('--progress', `${percent}%`);
    //     }
    // }

    elements.areaValueInput?.addEventListener('change', () => {
        const area = parseInt(elements.areaValueInput.value);
        if (!isNaN(area)) {
            elements.areaSlider.value = area;
            elements.areaSlider.dispatchEvent(new Event('input', { bubbles: true }));
            // updateSliderProgress();
            updateAll();
        }
    });


    // ============================================
    // ГЛАВНАЯ ФУНКЦ�?Я ОБНОВЛЕН�?Я
    // ============================================
    function updateAll() {
        

        // Получаем площадь
        let area = parseInt(elements.areaSlider?.value || 50);
        if (isNaN(area)) area = 50;
        if (elements.areaValueInput) {
            elements.areaValueInput.value = area;
        }

        // Обновляем цену дизайна в лейбле
        updateDesignLabelPrice(area);

        // Обновляем прогресс слайдера
        // updateSliderProgress();

        // Получаем данные локации
        const locationData = getLocationData();

        // ========== 1. Сумма проектных работ (базовая) ==========
        let projectSum = 0;
        if (elements.sketch && elements.sketch.checked) projectSum = getPrice('serviceSketch', 30000);
        if (elements.typovoy && elements.typovoy.checked) projectSum = getPrice('serviceConstruct', 57000);
        if (elements.individual && elements.individual.checked) projectSum = getPrice('serviceEng', 80000);

        const baseProjectSum = projectSum;

        // ========== 2. Наценка за удаленность (локацию) ==========
        let locationSurchargeAmount = 0;
        let locationSurchargeText = "";

        if (locationData.surchargeProject > 0 || locationData.surchargeSoglas > 0) {
            let projectSurcharge = baseProjectSum * locationData.surchargeProject;
            let soglasSurcharge = 0;

            if (elements.uvedom && elements.uvedom.checked) soglasSurcharge += getPrice('serviceArch', 25000) * locationData.surchargeSoglas;
            if (elements.soglas && elements.soglas.checked) soglasSurcharge += getPrice('servicePermit', 51000) * locationData.surchargeSoglas;

            locationSurchargeAmount = Math.round(projectSurcharge + soglasSurcharge);
            locationSurchargeText = locationData.name;
        }

        // Применяем коэффициент к проекту и согласованию
        let finalProjectSum = projectSum * locationData.project;
        let soglasSum = 0;
        if (elements.uvedom && elements.uvedom.checked) soglasSum += getPrice('serviceArch', 25000);
        if (elements.soglas && elements.soglas.checked) soglasSum += getPrice('servicePermit', 51000);
        const baseSoglasSum = soglasSum;
        soglasSum = soglasSum * locationData.soglas;

        // ========== 3. Наценка за площадь ==========
        let areaCoeff = 1.0;
        let areaSurcharge = 0;
        if (area >= CONFIG.areaSurcharge.minArea && area <= CONFIG.areaSurcharge.maxArea) {
            areaCoeff = CONFIG.areaSurcharge.coefficient;
            areaSurcharge = projectSum * (CONFIG.areaSurcharge.coefficient - 1) * locationData.project;
        }
        finalProjectSum = finalProjectSum * areaCoeff;

        // ========== 4. Сумма дополнительных опций ==========
        let dopSum = 0;
        let egrnPrice = 0;
        let sioprPrice = 0;

        if (elements.doc && elements.doc.checked) dopSum += getPrice('serviceDoc', 14000);
        if (elements.pereof && elements.pereof.checked) dopSum += getPrice('serviceReissue', 27000);
        if (elements.egrn && elements.egrn.checked) {
            egrnPrice = getPrice('serviceSupervision', 4000);
            dopSum += egrnPrice;
        }
        if (elements.siopr && elements.siopr.checked) {
            sioprPrice = getPrice('service3d', 5500);
            dopSum += sioprPrice;
        }
        if (elements.booklet && elements.booklet.checked) dopSum += getPrice('serviceBooklet', 4500);
        if (elements.bti && elements.bti.checked) dopSum += getPrice('serviceBTI', 6000);

        // ========== 5. Проверки для бейджа ==========
        const hasProject = (elements.sketch && elements.sketch.checked) ||
            (elements.typovoy && elements.typovoy.checked) ||
            (elements.individual && elements.individual.checked);
        const hasSoglasService = (elements.uvedom && elements.uvedom.checked) ||
            (elements.soglas && elements.soglas.checked);
        const hasEgrn = elements.egrn && elements.egrn.checked;
        const hasSiopr = elements.siopr && elements.siopr.checked;
        const hasBothDop = hasEgrn && hasSiopr;

        // ========== 6. Базовая сумма и итог ==========
        let baseSum = baseProjectSum + baseSoglasSum;
        let subtotal = finalProjectSum + soglasSum + dopSum;

        // ========== 7. Дизайн ==========
        let designPrice = 0;
        if (elements.buttonDesign && elements.buttonDesign.checked) {
            const designPricePerSqm = getDesignPricePerSqm(area);
            designPrice = area * designPricePerSqm;
        }

        // ========== 8. �?тог ==========
        let total = subtotal + designPrice;

        // ========== 9. Обновляем отображение ==========
        if (elements.baseSpan) {
            elements.baseSpan.innerText = baseSum.toLocaleString('ru-RU') + " ₽";
        }

        // Дополнительные услуги
        if (elements.extraSpan) {
            elements.extraSpan.innerText = dopSum.toLocaleString('ru-RU') + " ₽";
        }

        // Скрываем/показываем строку "Дополнительные услуги"
        if (elements.rowExtra) {
            if (dopSum > 0) {
                elements.rowExtra.classList.remove('calc__total-detail-item_zero')
            } else {
                elements.rowExtra.classList.add('calc__total-detail-item_zero')
            }
            // elements.rowExtra.style.display = dopSum > 0 ? 'flex' : 'none';
        }

        if (elements.totalSpan) {
            const currentValue = parseInt(elements.totalSpan.innerText.replace(/\D/g, '')) || 0;
            if (total !== currentValue) {
                elements.totalSpan.innerText = total.toLocaleString('ru-RU') + " ₽";
                elements.totalSpan.classList.add('calc__total-price_updated');
                setTimeout(() => {
                    elements.totalSpan.classList.remove('calc__total-price_updated');
                }, 300);
            }
        }

        // Дизайн строка
        if (elements.typeSpan) {
            elements.typeSpan.innerText = designPrice > 0 ? designPrice.toLocaleString('ru-RU') + " ₽" : "0 ₽";
        }

        if (elements.rowBase) {
            if (baseSum > 0) {
                elements.rowBase.classList.remove('calc__total-detail-item_zero')
            } else {
                elements.rowBase.classList.add('calc__total-detail-item_zero')
            }
            // elements.rowBase.style.display = designPrice > 0 ? 'flex' : 'none';
        }

        if (elements.rowDesign) {
            if (designPrice > 0) {
                elements.rowDesign.classList.remove('calc__total-detail-item_zero')
            } else {
                elements.rowDesign.classList.add('calc__total-detail-item_zero')
            }
            // elements.rowDesign.style.display = designPrice > 0 ? 'flex' : 'none';
        }


        // Наценка за площадь
        const hasAreaSurcharge = (area >= CONFIG.areaSurcharge.minArea && area <= CONFIG.areaSurcharge.maxArea && areaSurcharge > 0);

        if (elements.areaSpan) {
            if (hasAreaSurcharge) {
                elements.areaSpan.innerText = "" + Math.round(areaSurcharge).toLocaleString('ru-RU') + " ₽";
            } else {
                elements.areaSpan.innerText = "0 ₽";
            }
        }

        if (elements.rowArea) {
            if (hasAreaSurcharge > 0) {
                elements.rowArea.classList.remove('calc__total-detail-item_zero')
            } else {
                elements.rowArea.classList.add('calc__total-detail-item_zero')
            }
            // elements.rowArea.style.display = hasAreaSurcharge ? 'flex' : 'none';
        }

        // Наценка за удаленность (локацию)
        if (elements.rowLocation && elements.locationSurchargeSpan) {
            if (locationSurchargeAmount > 0) {
                elements.locationSurchargeSpan.innerText = "" + locationSurchargeAmount.toLocaleString('ru-RU') + " ₽";
                elements.rowLocation.style.display = 'flex';
            } else {
                elements.rowLocation.style.display = 'none';
            }
        }

        // Строка скидки - скрыта
        if (elements.rowDiscount) {
            elements.rowDiscount.style.display = 'none';
        }

        // ========== 10. Продающие рекомендации (бейдж) ==========
        if (elements.badge && isDomainAllowed) {
            updateBadge(
                hasProject, hasSoglasService, hasEgrn, hasSiopr, hasBothDop,
                egrnPrice, sioprPrice, 0, locationData.name
            );
        }

        calculateTotalContainerHeight();
    }

    // ========== Функция обновления бейджа ==========
    function updateBadge(hasProject, hasSoglasService, hasEgrn, hasSiopr, hasBothDop, egrnPrice, sioprPrice, discountAmount, locationName) {
        const hasAnyDop = (elements.doc && elements.doc.checked) ||
            (elements.pereof && elements.pereof.checked) ||
            (elements.egrn && elements.egrn.checked) ||
            (elements.siopr && elements.siopr.checked) ||
            (elements.booklet && elements.booklet.checked) ||
            (elements.bti && elements.bti.checked);

        // Проверка на "только Переоформление"
        const onlyReissue = elements.pereof && elements.pereof.checked && !hasProject && !hasSoglasService &&
            !elements.doc?.checked && !elements.egrn?.checked && !elements.siopr?.checked &&
            !elements.booklet?.checked && !elements.bti?.checked && !elements.buttonDesign?.checked;

        // Проверка на "только Сбор и проверка документов"
        const onlyDoc = elements.doc && elements.doc.checked && !hasProject && !hasSoglasService &&
            !elements.pereof?.checked && !elements.egrn?.checked && !elements.siopr?.checked &&
            !elements.booklet?.checked && !elements.bti?.checked && !elements.buttonDesign?.checked;

        const hasTypovoy = elements.typovoy && elements.typovoy.checked;
        const hasIndividual = elements.individual && elements.individual.checked;
        const hasSketch = elements.sketch && elements.sketch.checked;
        const hasFullProject = hasTypovoy || hasIndividual;

        const hasUvedom = elements.uvedom && elements.uvedom.checked;
        const hasSoglasOnly = elements.soglas && elements.soglas.checked;

        let message = "";
        let badgeClass = CONFIG.badgeClasses.default;

        // 15. Только Переоформление
        if (onlyReissue) {
            message = CONFIG.badgeMessages.onlyReissue;
            badgeClass = CONFIG.badgeClasses.info;
        }
        // 16. Только Сбор и проверка документов
        else if (onlyDoc) {
            message = CONFIG.badgeMessages.onlyDoc;
            badgeClass = CONFIG.badgeClasses.info;
        }
        // 1. Ничего не выбрано (и нет доп. услуг)
        else if (!hasProject && !hasSoglasService && !hasAnyDop) {
            message = CONFIG.badgeMessages.nothingSelected;
            badgeClass = CONFIG.badgeClasses.info;
        }
        // 4. Согласование летней веранды (без проекта)
        else if (hasSoglasOnly && !hasProject && !hasUvedom) {
            message = CONFIG.badgeMessages.soglasWithoutProject;
            badgeClass = CONFIG.badgeClasses.info;
        }
        // 5. Уведомление о размещении (без проекта)
        else if (hasUvedom && !hasProject && !hasSoglasOnly) {
            message = CONFIG.badgeMessages.uvedomWithoutProject;
            badgeClass = CONFIG.badgeClasses.warning;
        }
        // 2. Типовой или �?ндивидуальный проект (без согласования)
        else if (hasFullProject && !hasSoglasService) {
            message = CONFIG.badgeMessages.projectWithoutSoglas;
            badgeClass = CONFIG.badgeClasses.warning;
        }
        // 3. Фотомонтаж (без согласования)
        else if (hasSketch && !hasSoglasService && !hasFullProject) {
            message = CONFIG.badgeMessages.sketchWithoutSoglas;
            badgeClass = CONFIG.badgeClasses.warning;
        }
        // 14. Проект (любой) + Уведомление
        else if (hasProject && hasUvedom && !hasSoglasOnly) {
            message = CONFIG.badgeMessages.projectAndUvedom;
            badgeClass = CONFIG.badgeClasses.warning;
        }
        // 6. Типовой проект + Согласование
        else if (hasTypovoy && hasSoglasService && !hasEgrn && !hasSiopr) {
            message = CONFIG.badgeMessages.typovoyAndSoglas;
            badgeClass = CONFIG.badgeClasses.offer;
        }
        // 7. Типовой проект + Согласование + ЕГ� Н
        else if (hasTypovoy && hasSoglasService && hasEgrn && !hasSiopr) {
            message = CONFIG.badgeMessages.typovoySoglasEgrn;
            badgeClass = CONFIG.badgeClasses.discount;
        }
        // 8. Типовой проект + Согласование + С�?ОП� 
        else if (hasTypovoy && hasSoglasService && hasSiopr && !hasEgrn) {
            message = CONFIG.badgeMessages.typovoySoglasSiopr;
            badgeClass = CONFIG.badgeClasses.discount;
        }
        // 9. Фотомонтаж + Уведомление
        else if (hasSketch && hasUvedom && !hasFullProject && !hasSoglasOnly && !hasBothDop) {
            message = CONFIG.badgeMessages.sketchAndUvedom;
            badgeClass = CONFIG.badgeClasses.offer;
        }
        // 10. �?ндивидуальный проект + Согласование
        else if (hasIndividual && hasSoglasService && !hasEgrn && !hasSiopr) {
            message = CONFIG.badgeMessages.individualAndSoglas;
            badgeClass = CONFIG.badgeClasses.offer;
        }
        // 11. �?ндивидуальный проект + Согласование + ЕГ� Н
        else if (hasIndividual && hasSoglasService && hasEgrn && !hasSiopr) {
            message = CONFIG.badgeMessages.individualSoglasEgrn;
            badgeClass = CONFIG.badgeClasses.premium;
        }
        // 12. Типовой проект + Согласование + ЕГ� Н + С�?ОП�  (полный набор)
        else if (hasTypovoy && hasSoglasService && hasBothDop) {
            message = CONFIG.badgeMessages.fullTypovoySet;
            badgeClass = CONFIG.badgeClasses.premium;
        }
        // 13. Фотомонтаж + Уведомление + С�?ОП� 
        else if (hasSketch && hasUvedom && hasSiopr && !hasEgrn && !hasFullProject && !hasSoglasOnly) {
            message = CONFIG.badgeMessages.sketchUvedomSiopr;
            badgeClass = CONFIG.badgeClasses.premium;
        }
        // Дефолт
        else {
            message = CONFIG.badgeMessages.default;
            badgeClass = CONFIG.badgeClasses.default;
        }

        elements.badge.innerHTML = message;
        elements.badge.className = badgeClass;
    }

    // ============================================
    // ЛОГ�?КА ВЗА�?МО�?СКЛЮЧАЮЩ�?Х УСЛУГ
    // ============================================

    function setupProjectExclusive() {
        const projectChecks = [elements.sketch, elements.typovoy, elements.individual];
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

    function setupSoglasExclusive() {
        const soglasChecks = [elements.uvedom, elements.soglas];
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

    // ============================================
    // НАВЕШ�?ВАН�?Е ОБ� АБОТЧ�?КОВ
    // ============================================
    function bindEvents() {
        const dopChecks = [elements.doc, elements.pereof, elements.egrn, elements.siopr, elements.booklet, elements.bti];
        dopChecks.forEach(cb => {
            if (cb) cb.addEventListener('change', updateAll);
        });

        if (elements.buttonDesign) elements.buttonDesign.addEventListener('change', updateAll);
        if (elements.areaSlider) elements.areaSlider.addEventListener('input', updateAll);

        if (elements.locationMoscow) elements.locationMoscow.addEventListener('change', updateAll);
        if (elements.locationZelograd) elements.locationZelograd.addEventListener('change', updateAll);
        if (elements.locationMo30km) elements.locationMo30km.addEventListener('change', updateAll);

        locationLabels.forEach(label => {
            label.addEventListener('click', function () {
                setTimeout(updateAll, 10);
            });
        });

        if (elements.resetBtn) {
            elements.resetBtn.addEventListener('click', function () {
                const allChecks = [elements.sketch, elements.typovoy, elements.individual,
                elements.doc, elements.uvedom, elements.soglas,
                elements.pereof, elements.egrn, elements.siopr,
                elements.booklet, elements.bti];
                allChecks.forEach(cb => { if (cb) cb.checked = false; });

                if (elements.buttonDesign) elements.buttonDesign.checked = false;
                if (elements.locationMoscow) elements.locationMoscow.checked = true;
                if (elements.locationZelograd) elements.locationZelograd.checked = false;
                if (elements.locationMo30km) elements.locationMo30km.checked = false;
                if (elements.areaSlider) elements.areaSlider.value = "50";

                updateAll();
            });
        }
    }

    // ============================================
    // СБО�  ДАННЫХ ДЛЯ ОТП� АВК�?
    // ============================================
    function collectCalculatorData() {
        let area = parseInt(elements.areaSlider?.value || 50);
        if (isNaN(area)) area = 50;
        const total = elements.totalSpan?.innerText || '0 ₽';

        const selectedServices = [];
        const servicesList = [
            { id: 'serviceConstruct', name: 'Типовой проект' },
            { id: 'serviceEng', name: '�?ндивидуальный проект' },
            { id: 'serviceSketch', name: 'Фотомонтаж' },
            { id: 'servicePermit', name: 'Согласование летней веранды' },
            { id: 'serviceArch', name: 'Уведомление о размещении' },
            { id: 'serviceReissue', name: 'Переоформление' },
            { id: 'serviceDoc', name: 'Сбор и проверка документов' },
            { id: 'serviceSupervision', name: 'Заказ и получение ЕГ� Н' },
            { id: 'service3d', name: 'Включение заведения в С�?ОП� ' },
            { id: 'serviceBooklet', name: 'Печать дополнительного буклета проекта' },
            { id: 'serviceBTI', name: 'Заказ архивной копии БТ�?' },
            { id: 'serviceDesign', name: 'Дизайн веранды' }
        ];

        servicesList.forEach(service => {
            const el = document.getElementById(service.id);
            if (el && el.checked) selectedServices.push(service.name);
        });

        const locationData = getLocationData();

        let designText = '';
        if (elements.buttonDesign && elements.buttonDesign.checked && elements.typeSpan && elements.typeSpan.innerText !== '0 ₽') {
            designText = `Дизайн веранды: ${elements.typeSpan.innerText}\n`;
        }

        let areaSurchargeText = '';
        if (elements.areaSpan && elements.areaSpan.innerText !== '0 ₽') {
            areaSurchargeText = `Наценка за площадь: ${elements.areaSpan.innerText}\n`;
        }

        let locationSurchargeText = '';
        if (elements.locationSurchargeSpan && elements.locationSurchargeSpan.innerText !== '0 ₽') {
            locationSurchargeText = `Наценка за удаленность: ${elements.locationSurchargeSpan.innerText}\n`;
        }

        let servicesText = selectedServices.length === 0 ? '❌ Не выбраны' : selectedServices.map(s => `  • ${s}`).join('\n');

        const comment = `<b>Выбранные услуги:</b>
${servicesText}
<br />
<b>�?ТОГО:</b> ${total}
<br />
<b>Площадь:</b> ${area} м²
<b>Локация:</b> ${locationData.name}
${designText}${areaSurchargeText}${locationSurchargeText}`;

        return { comment, total, selectedServices, area, locationName: locationData.name };
    }

    // ============================================
    // ОТП� АВКА В ТЕЛЕГ� АМ
    // ============================================
    async function sendToTelegram(name, phone, comment) {
        const formData = new FormData();
        formData.append('action', 'send_calc_order');
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('comment', comment);
        formData.append('page', window.location.href);
        formData.append('parse_mode', 'HTML');

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

    // ============================================
    // ОТК� ЫТ�?Е МОДАЛЬНОГО ОКНА
    // ============================================
    function openCalcModal() {
        const calcData = collectCalculatorData();
        if (calcData.selectedServices.length === 0) {
            alert('� ️ Выберите хотя бы одну услугу перед отправкой заявки');
            return;
        }

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

    // ============================================
    // �?Н�?Ц�?АЛ�?ЗАЦ�?Я
    // ============================================
    function init() {
        setupProjectExclusive();
        setupSoglasExclusive();
        bindEvents();
        updateAll();

        if (elements.calcSubmitBtn) {
            elements.calcSubmitBtn.addEventListener('click', openCalcModal);
        }
    }

    init();
});