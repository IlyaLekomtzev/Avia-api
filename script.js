//ДАННЫЕ!
//Переменные
const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
      dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
      clearFrom = formSearch.querySelector('.from__clear'),
      inputCitiesTo = formSearch.querySelector('.input__cities-to'),
      dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
      inputDate = formSearch.querySelector('.input__date-depart'),
      clearTo = formSearch.querySelector('.to__clear'),
      cheapestTicket = document.getElementById('cheapest-ticket'),
      otherCheapTickets = document.getElementById('other-cheap-tickets');

//Массив городов
let city = [];

//Url api aviasales по городам
const citiesApi = 'data/cities.json';
//Url proxy
const proxy = 'https://cors-anywhere.herokuapp.com/';
//API Key
const API_KEY = '49fb4ef6d6779275d180cc344c5e3954';
//Url api Календарь цен
const calendar = 'http://min-prices.aviasales.ru/calendar_preload';

//ФУНКЦИИ!
//API: функция обращения
const getData = (url, callback) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);
    request.addEventListener('readystatechange', () => {
        if(request.readyState !== 4) return;

        if(request.status === 200){
            callback(request.response);
        } else {
            console.error(request.status);
        }
    });
    request.send();
}

//Главная функция обработки и вывода массива при наборе в инпуты
const showCity = (input, list, clear) => {
    list.textContent = '';

    if(input.value !== ''){
        clear.style.opacity = '1';

        const filterCity = city.filter(item => { 
            if(item.name){
                const fixItem = item.name.toLowerCase();
                return fixItem.includes(input.value.toLowerCase());
            }
        });

        filterCity.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item.name;
            list.append(li);
        });
    } else{
        clear.style.opacity = '0';
    }
}

const getDate = () => {
    
}

const getChanges = (num) => {
    if(num){
        return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
    } else{
        return 'Без пересадок';
    }
}

const createCard = (data) => {
    article = document.createElement('article');
    article.classList.add('ticket');

    let htmlArticle = '';

    if(data){
        htmlArticle = `
        <h3 class="agent">${data.gate}</h3>
        <div class="ticket__wrapper">
            <div class="left-side">
                <a href="https://www.aviasales.ru/search/SVX2905KGD1" class="button button__buy">Купить
                    за ${data.value}₽</a>
            </div>
            <div class="right-side">
                <div class="block-left">
                    <div class="city__from">Вылет из города
                        <span class="city__name">${data.origin}</span>
                    </div>
                    <div class="date">${data.depart_date}</div>
                </div>
        
                <div class="block-right">
                    <div class="changes">${getChanges(data.number_of_changes)}</div>
                    <div class="city__to">Город назначения:
                        <span class="city__name">${data.destination}</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    } else{
        htmlArticle = '<h3>Нет билетов</h3>';
    }

    article.insertAdjacentHTML('afterbegin', htmlArticle);

    return article;
}

const renderCheapDay = (ticket) => {
    const ticketElement = createCard(ticket[0]);
    cheapestTicket.append(ticketElement);
    console.log(ticketElement);
    
};

const renderCheapYear = (tickets) => {
    tickets.sort((a, b) => {
        if(a.value > b.value){
            return 1;
        }
        if(a.value < b.value){
            return -1;
        }
        return 0;
    });

    console.log(tickets);
    
};

//Рендер билетов
const renderCheap = (response, date) => {
    const cheapTicket = JSON.parse(response).best_prices;
    const cheapTicketDay = cheapTicket.filter((item) => item.depart_date === date);
    
    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicket);

}

//СОБЫТИЯ!
//Вызов функции для from интпута
inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom, clearFrom);
});
//Обработка выбора города из появившегося списка при наборе from
dropdownCitiesFrom.addEventListener('click', (event) => {
    const targetElement = event.target;
    if(targetElement.tagName.toLowerCase() === 'li'){
        inputCitiesFrom.value = targetElement.textContent;
        dropdownCitiesFrom.textContent = '';
    }  
});
//Обработка клика: очистка инпута и вывода массива городов from
clearFrom.addEventListener('click', () => {
    inputCitiesFrom.value = '';
    dropdownCitiesFrom.textContent = '';
    clearFrom.style.opacity = '0';
});

//Вызов функции для to интпута
inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo, clearTo);
});
//Обработка выбора города из появившегося списка при наборе to
dropdownCitiesTo.addEventListener('click', (event) => {
    const targetElement = event.target;
    if(targetElement.tagName.toLowerCase() === 'li'){
        inputCitiesTo.value = targetElement.textContent;
        dropdownCitiesTo.textContent = '';
    }  
});
//Обработка клика: очистка инпута и вывода массива городов to
clearTo.addEventListener('click', () => {
    inputCitiesTo.value = '';
    dropdownCitiesTo.textContent = '';
    clearTo.style.opacity = '0';
});

//Обработка отправки формы
formSearch.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = {
        from: city.find((item) => inputCitiesFrom.value === item.name),
        to: city.find((item) => inputCitiesTo.value === item.name),
        when: inputDate.value,
    };

    if(formData.from && formData.to){
        const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true&token=${API_KEY}`;

        getData(calendar + requestData, (response) => {
            renderCheap(response, formData.when);
        });
    } else{
        alert(`Некорректные данные: ${inputCitiesFrom.value} или ${inputCitiesTo.value}`);
    }
});

//ВЫЗОВЫ!
//Вызов API
getData(citiesApi, (data) => {
    city = JSON.parse(data);
    city.sort((a, b) => {
        if(a.name > b.name){
            return 1;
        }
        if(a.name < b.name){
            return -1;
        }
        return 0;
    });
});