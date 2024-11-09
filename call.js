// Функція для перевірки куки has_sip
function checkSipCookie() {
    const match = document.cookie.match(/(^|;)\s*has_sip=([^;]+)/);
    return match ? match[2] === '1' : false;
}

// Функція для обробки дзвінків
function makeCall(number) {
    fetch('/crm/api/calls/init', {
        method: 'POST',
        headers: post_headers,
        body: JSON.stringify({ number })
    })
        .then(response => {
            return response.json().then(data => ({ data, status: response.status }));
        })
        .then(({ data, status }) => {
            // Обробка відповіді
            console.log(data);
            // Показати спливаюче вікно про дзвінок
            showToast(number, data.message, status);
        });
}

// Функція для показу спливаючого вікна дзвінка


function showToast(number, response, status) {
    const callToastItems = document.querySelectorAll('.call__item');
    const callMessages = document.querySelectorAll('.callMessage');
    const callNumberTexts = document.querySelectorAll('.callNumberText');

    // Проверка на существование элементов, иначе выводим сообщение об ошибке
    if (!callToastItems.length || !callNumberTexts.length || !callMessages.length) {
        console.error('One or more elements are missing.');
        return;
    }

    // Обновление текста с номером телефона
    callNumberTexts.forEach((callNumberText) => {
        if (callNumberText.innerHTML.trim() === '') {
            callNumberText.innerHTML = 'Номер неизвестен';
        }
    });

    // Обновление сообщения
    callMessages.forEach((callMessage) => {
        if (callMessage.innerHTML.trim() === '') {
            callMessage.innerHTML = 'Сообщение отсутствует';
        }
    });

    // Устанавливаем стиль и иконку в зависимости от статуса
    callToastItems.forEach((item) => {
        const callIcon = item.querySelector('.callIcon i');

        if (!callIcon) {
            console.error('Icon element is missing in one of the items.');
            return;
        }

        if (status !== 200) {
            item.style.backgroundColor = 'lightcoral';
            callIcon.innerHTML = 'hide_source';
        } else {
            item.style.backgroundColor = '';
            callIcon.innerHTML = 'phone_in_talk';
        }
    });

    // Устанавливаем размер шрифта для сообщения
    callMessages.forEach((callMessage) => {
        callMessage.style.fontSize = '0.9em';
    });

    setTimeout(() => {
        if (callToastItems.length > 0) {
      
                const updatedCallToastItems = document.querySelectorAll('.call__item');
                const lastItem = updatedCallToastItems[updatedCallToastItems.length - 1];
                if(lastItem) {
                    lastItem.remove();
                }
        }
    }, 5000);

}

// Вызов функции с произвольными данными
showToast();



