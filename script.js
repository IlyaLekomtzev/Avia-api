//Переменные
const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
      dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
      clearFrom = formSearch.querySelector('.from__clear'),
      inputCitiesTo = formSearch.querySelector('.input__cities-to'),
      dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
      clearTo = formSearch.querySelector('.to__clear');

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

//Вызов API
getData(citiesApi, (data) => {
    city = JSON.parse(data);
});