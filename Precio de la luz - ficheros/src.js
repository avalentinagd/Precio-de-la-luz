'use strict';

/* Consulto API, convierto datos string a objeto 
y guardo el objeto en el localStorage  */
async function saveDataInLocalStorage() {
    try {
        const response = await fetch(
            'https://api.allorigins.win/get?url=https://api.preciodelaluz.org/v1/prices/all?zone=PCB'
        );
        const data = await response.json();
        const { contents } = data;
        const hours = JSON.parse(contents);
        localStorage.setItem('hours', JSON.stringify(hours));
    } catch (error) {
        console.error(error);
    }
}
// Para que el fetch no se haga antes de los 5min de la consulta anterior
setInterval(saveDataInLocalStorage, 300000);

// Función para formatear numeros de días y meses
const formatNum = (num) => {
    return num < 10 ? '0' + num : num;
};

function workingDataFromLocalStorage() {
    // Seleccion de algunos elementos html para trabajarlos
    const pCurrentPrice = document.querySelector('p#currentPrice');
    const pMinPrice = document.querySelector('p#economicPrice');
    const pMaxPrice = document.querySelector('p#expensivePrice');
    const economicHour = document.querySelector('p#economicHour');
    const expensiveHour = document.querySelector('p#expensiveHour');
    let now = new Date();
    let currentHour = now.getHours();

    /* Leo datos en el localStorage y convierto a objeto */
    let hours = JSON.parse(localStorage.getItem('hours'));

    // Guardar precios en un array
    let arrayPrices = [];
    for (let hour in hours) {
        const hoursAddPrices = hours[hour];
        const precio = hoursAddPrices.price;
        arrayPrices.push(precio);
    }
    console.log(arrayPrices);

    // Hora actual
    for (let i = 0; i < 24; i++) {
        if (currentHour === i) {
            pCurrentPrice.textContent = `${arrayPrices[i]}€ \n Mwh`;
        }
    }

    // Nuevo array para guardar los precios ordenados
    let arrayPricesSorted = [];
    for (let i = 0; i < 24; i++) {
        arrayPricesSorted.push(arrayPrices[i]);
    }
    console.log(arrayPricesSorted);

    for (let j = 0; j < arrayPricesSorted.length - 1; j++) {
        for (let i = 0; i < arrayPricesSorted.length; i++) {
            if (arrayPricesSorted[i] > arrayPricesSorted[i + 1]) {
                const tmp = arrayPricesSorted[i];
                arrayPricesSorted[i] = arrayPricesSorted[i + 1];
                arrayPricesSorted[i + 1] = tmp;
            }
        }
    }
    console.log(arrayPricesSorted);

    /* Del nuevo array de precios ordenados, la primera posición 
       será el menor precio y la última posición el mayor precio */
    let minPrice = arrayPricesSorted[0];
    let maxPrice = arrayPricesSorted[23];
    console.log(minPrice);
    console.log(maxPrice);

    pMinPrice.textContent = `${minPrice}€ \n Mwh`;
    pMaxPrice.textContent = `${maxPrice}€ \n Mwh`;

    // Asignación de franja horaria para precios min y max de la luz
    for (let i = 0; i < 24; i++) {
        if (minPrice === arrayPrices[i]) {
            let positionMinPrice = arrayPrices.indexOf(arrayPrices[i]);
            console.log(positionMinPrice);
            economicHour.textContent = `${formatNum(
                positionMinPrice
            )}:00 - ${formatNum(positionMinPrice + 1)}:00`;
        }
        if (maxPrice === arrayPrices[i]) {
            let positionMaxPrice = arrayPrices.indexOf(arrayPrices[i]);
            console.log(positionMaxPrice);
            expensiveHour.textContent = `${formatNum(
                positionMaxPrice
            )}:00 - ${formatNum(positionMaxPrice + 1)}:00`;
        }
    }

    // Array ordenado de consumos en Mwh de cada artículo eléctrico
    const electricityConsumption = [
        0.0009, 0.00025, 0.0028, 0.0002, 0.0022, 0.0004, 0.0015,
    ];

    // Array de precios del consumo durante una hora por cada artículo eléctrico
    let itemsPricesForHour = [];
    for (let i = 0; i < 24; i++) {
        if (currentHour === i) {
            let currentPrice = `${arrayPrices[i]}`;
            console.log(currentPrice);
            for (let consum of electricityConsumption) {
                itemsPricesForHour.push((consum * currentPrice).toFixed(3));
            }
        }
    }
    console.log(itemsPricesForHour);

    // Agregando el precio de consumo de una hora a cada artículo eléctrico
    const electricalItem = document.querySelectorAll('section>ul>li>p');
    electricalItem.forEach((item, index) => {
        const priceForHour = itemsPricesForHour[index];
        console.log(item, priceForHour);
        item.textContent = `Costo por hora \n ${priceForHour}€`;
    });
}
workingDataFromLocalStorage();

function currentDate() {
    // Variables y selección de elementos
    const pDates = document.querySelectorAll('p.currentDate');
    const pCurrentHours = document.querySelector('p#currentHour');

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinuts = now.getMinutes();
    const currentSeconds = now.getSeconds();
    const currentDay = now.getDate();
    const currenMonth = now.getMonth();
    const currenYear = now.getFullYear();
    const months = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
    ];

    // Añadimos la fecha actual al HTML
    for (let date of pDates) {
        date.textContent = `${currentDay} de ${months[currenMonth]} de ${currenYear}`;
    }

    pCurrentHours.textContent = `${formatNum(currentHour)}:${formatNum(
        currentMinuts
    )}:${formatNum(currentSeconds)}`;
}
currentDate();
