'use strict';

/* Consulto API, convierto datos string a objeto 
y guardo el objeto en el localStorage  */
async function saveDataInLocalStorage() {
    try {
        const response = await fetch(
            'https://api.allorigins.win/get?url=https://api.preciodelaluz.org/v1/prices/all?zone=PCB'
        );
        const data = await response.json();
        //console.log(data);
        const { contents } = data;
        //console.log(contents);
        //console.log(typeof contents);

        const hours = JSON.parse(contents);
        //console.log(hours);
        //console.log(typeof hours);
        localStorage.setItem('hours', JSON.stringify(hours));
        //
    } catch (error) {
        console.error(error);
    }
}
setInterval(saveDataInLocalStorage, 300000);

const formatNum = (num) => {
    return num < 10 ? '0' + num : num;
};

/* Leo datos en el localStorage y convierto a objeto */
function getDataFromLocalStorage() {
    const pCurrentPrice = document.querySelector('p#currentPrice');
    const pMinPrice = document.querySelector('p#economicPrice');
    const pMaxPrice = document.querySelector('p#expensivePrice');
    const economicHour = document.querySelector('p#economicHour');
    const expensiveHour = document.querySelector('p#expensiveHour');
    let now = new Date();
    let currentHour = now.getHours();
    console.log(typeof currentHour);

    let hours = JSON.parse(localStorage.getItem('hours'));
    //console.log(hours);

    let arrayPrices = [];

    for (let hour in hours) {
        const hoursAddPrices = hours[hour];
        console.log(hoursAddPrices);
        //return hoursAddPrices;
        //console.log(typeof hour);
        //console.log(typeof hoursAddPrices);
        const precio = hoursAddPrices.price;
        //console.log(precio);
        arrayPrices.push(precio);

        /* const hora = hoursAddPrices.hour;
        console.log(hora); */
    }
    console.log(arrayPrices);

    for (let i = 0; i < 24; i++) {
        if (currentHour === i) {
            pCurrentPrice.textContent = `${arrayPrices[i]}€ \n Mwh`;
        }
    }

    let arrayPricesSorted = [];
    for (let i = 0; i < 24; i++) {
        arrayPricesSorted.push(arrayPrices[i]);
    }
    console.log(arrayPricesSorted);

    for (let j = 0; j < arrayPricesSorted.length - 1; j++) {
        // Bucle secundario que se encarga de ordenar mover el nº más
        // grande a la derecha.
        for (let i = 0; i < arrayPricesSorted.length; i++) {
            // Comprobamos si el nº actual es mayor que el nº siguiente.
            if (arrayPricesSorted[i] > arrayPricesSorted[i + 1]) {
                // Almacenamos el nº actual en una variable temporal.
                const tmp = arrayPricesSorted[i];

                // Almacenamos en la posición actual el nº menos.
                arrayPricesSorted[i] = arrayPricesSorted[i + 1];

                // Almacenamos en la posición siguiente el valor temporal.
                arrayPricesSorted[i + 1] = tmp;
            }
        }
    }
    console.log(arrayPricesSorted);

    let minPrice = arrayPricesSorted[0];
    let maxPrice = arrayPricesSorted[23];
    console.log(minPrice);
    console.log(maxPrice);

    pMinPrice.textContent = `${minPrice}€ \n Mwh`;
    pMaxPrice.textContent = `${maxPrice}€ \n Mwh`;

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

    //Array ordenado de consumos en Mwh de artículos eléctricos
    const electricityConsumption = [
        0.0009, 0.00025, 0.0028, 0.0002, 0.0022, 0.0004, 0.0015,
    ];

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

    const electricalItem = document.querySelectorAll('section>ul>li>p');
    electricalItem.forEach((item, index) => {
        const priceForHour = itemsPricesForHour[index];
        console.log(item, priceForHour);
        item.textContent = `${priceForHour}€  \n  costo por hora`;
    });
}
getDataFromLocalStorage();

function currentDate() {
    const pDates = document.querySelectorAll('p.currentDate');
    const pHours = document.querySelector('p#currentHour');

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

    for (let date of pDates) {
        date.textContent = `${currentDay} de ${months[currenMonth]} de ${currenYear}`;
    }

    pHours.textContent = `${formatNum(currentHour)}:${formatNum(
        currentMinuts
    )}:${formatNum(currentSeconds)}`;
}
currentDate();
