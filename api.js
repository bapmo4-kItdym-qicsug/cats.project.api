let currentPage = 1;
const itemsPerPage = 10;
let filteredBreeds = [];

const API_KEY = 'live_Mu5mJ7oGLnoY4n13exzSVftaWPi137NSSZwkxHr4vbgLfvICJo4y7Vpq2gXCT5cN';
const API_URL = 'https://api.thecatapi.com/v1/breeds';

async function fetchBreeds() {// функция для получения всех пород
    try {
        const response = await fetch(API_URL, {
            headers: {
                'x-api-key': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при загрузке пород:', error);
        document.getElementById('result').innerHTML = 'Не удалось загрузить данные. Проверьте API-ключ.';
        return [];
    }
}

function displayBreeds(breeds) {// функция для отображения пород на странице
    const resultDiv = document.getElementById('result');
    const paginationDiv = document.getElementById('pagination');

    if (breeds.length === 0) {
        resultDiv.innerHTML = 'Ничего не найдено.';
        paginationDiv.innerHTML = '';
        return;
    }

    const totalPages = Math.ceil(breeds.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;// вычисляем индекс перовой породы на текущей странице
    const end = start + itemsPerPage;// вычисляем индекс последней породы на текущей странице
    const breedsToShow = breeds.slice(start, end);

    resultDiv.innerHTML = '<strong>Результаты:</strong><br><br>' +
        breedsToShow.map(breed => `
            <div class="breed">
                <strong>${breed.name}</strong> (${breed.origin})<br>
                Тип шерсти: ${breed.hairless === 1 ? 'Лысая' : 'Обычная'}<br>
                Гипоаллергенная: ${breed.hypoallergenic === 1 ? 'Да' : 'Нет'}<br>
                Темперамент: ${breed.temperament}<br><br>
                <img src="${breed.image ? breed.image.url : 'https://via.placeholder.com/150'}" alt="${breed.name}" style="width: 150px; height: auto; border-radius: 8px;">
            </div>
        `).join('');

    paginationDiv.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.innerText = i;//номер старницы
        if (i === currentPage) {// если кнопка соответствует текущей странице, добавляем класс active-page
            pageBtn.classList.add('active-page');
        }
        pageBtn.onclick = () => {
            currentPage = i;
            displayBreeds(filteredBreeds);
        };
        paginationDiv.appendChild(pageBtn);
    }
}

document.getElementById('searchBtn').addEventListener('click', async () => { // обработчик события нажатия кнопки поиска
    const query = document.getElementById('searchInput').value.toLowerCase();// получаем введенный текст в поле поиска
    const category = document.getElementById('categorySelect').value;// получаем выбранную категорию
    const breeds = await fetchBreeds(); // получаем все породы

    filteredBreeds = breeds.filter(breed => { // фильтруем породы по имени и категории
        const matchesName = breed.name.toLowerCase().includes(query);// проверяем, содержится ли введенный текст в названии породы
        const matchesCategory = category ? breed.category === category : true;
        return matchesName && matchesCategory;
    });

    currentPage = 1;// сбрасываем номер страницы на 1
    displayBreeds(filteredBreeds);
});

document.getElementById('randomBtn').addEventListener('click', async () => {// обработчик события нажатия кнопки случайной породы
    const breeds = await fetchBreeds();//вызывем функцию получения пород
    if (breeds.length === 0) return;

    const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
    document.getElementById('result').innerHTML =
        `<strong>Случайная порода:</strong><br>
        ${randomBreed.name} (${randomBreed.origin})<br>
        Тип шерсти: ${randomBreed.hairless === 1 ? 'Лысая' : 'Обычная'}<br>
        Гипоаллергенная: ${randomBreed.hypoallergenic === 1 ? 'Да' : 'Нет'}<br>
        Темперамент: ${randomBreed.temperament}<br><br>
        <img src="${randomBreed.image ? randomBreed.image.url : 'https://via.placeholder.com/150'}" alt="${randomBreed.name}" style="width: 150px; height: auto; border-radius: 8px;">`;
    document.getElementById('pagination').innerHTML = '';
});

// Функция для фильтрации пород по категориям
document.getElementById('categorySelect').addEventListener('change', async () => {
    const category = document.getElementById('categorySelect').value;
    const breeds = await fetchBreeds();

    filteredBreeds = breeds.filter(breed => {
        return category ? breed.category === category : true;
    });

    currentPage = 1;
    displayBreeds(filteredBreeds);
});