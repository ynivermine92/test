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
    const call = document.querySelector('.call');
    const callToastItems = document.querySelectorAll('.call__item');
    const callMessages = document.querySelectorAll('.callMessage');
    const callNumberTexts = document.querySelectorAll('.callNumberText');

    if (!callToastItems.length || !callNumberTexts.length || !callMessages.length) {
        console.error('One or more elements are missing.');
        return;
    }

    callNumberTexts.forEach((callNumberText) => {
        if (callNumberText.innerHTML.trim() === '') {
            callNumberText.innerHTML = 'Номер неизвестен';
        }
    });

    callMessages.forEach((callMessage) => {
        if (callMessage.innerHTML.trim() === '') {
            callMessage.innerHTML = 'Сообщение отсутствует';
        }
    });

    callToastItems.forEach((item, index) => {
        const callIcon = item.querySelector('.callIcon i');
        
        if (!callIcon) {
            console.error('Icon element is missing in one of the items.');
            return;
        }

        if (status !== 200) {
            item.style.backgroundColor = 'lightcoral';

            if (index > 1) {
                item.style.bottom = `${130 * index}px`;
            }
            
            callIcon.innerHTML = 'hide_source';

            // Определяем задержку для удаления каждого элемента
            const reverseIndex = callToastItems.length - 1 - index;
            setTimeout(() => {
                if (call.lastElementChild) {
                    call.lastElementChild.style.transition = 'opacity 1s';
                    call.lastElementChild.style.opacity = '0.5';

                    setTimeout(() => {
                        if (call.lastElementChild) {
                            call.removeChild(call.lastElementChild);
                        }
                    }, 1000); // Задержка перед удалением элемента
                }
            }, 5000 + 4000 * reverseIndex);
        } else {
            // Сброс стилей при статусе 200
            item.style.backgroundColor = '';
            callIcon.innerHTML = 'phone_in_talk';
        }
    });

    callMessages.forEach((callMessage) => {
        callMessage.style.fontSize = '0.9em';
    });
}

showToast();




