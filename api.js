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