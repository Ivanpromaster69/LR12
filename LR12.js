const wordsEasy = [
    { word: 'pen', translation: 'ручка' },
    { word: 'chair', translation: 'стілець' },
    { word: 'milk', translation: 'молоко' },
    { word: 'road', translation: 'дорога' },
    { word: 'cat', translation: 'кіт' },
    { word: 'sun', translation: 'сонце' },
    { word: 'car', translation: 'авто' },
    { word: 'money', translation: 'гроші' },
    { word: 'house', translation: 'дім' },
    { word: 'tree', translation: 'дерево' }
];
const wordsMedium = [
    { word: 'strategy', translation: 'стратегія' },
    { word: 'achievement', translation: 'досягнення' },
    { word: 'souvenir', translation: 'сувенір' },
    { word: 'nutrition', translation: 'харчування' },
    { word: 'exercise', translation: 'вправа' },
    { word: 'symptom', translation: 'симптом' },
    { word: 'celebrity', translation: 'знаменитість' },
    { word: 'collaboration', translation: 'співпраця' },
    { word: 'development', translation: 'розробка' },
    { word: 'childhood', translation: 'дитинство' }
];
const wordsHard = [
    { word: 'augury', translation: 'пророцтво' },
    { word: 'colander', translation: 'друшляк' },
    { word: 'dexterity', translation: 'спитність' },
    { word: 'drought', translation: 'посуха' },
    { word: 'penchant', translation: 'схильність' },
    { word: 'pillage', translation: 'мародерство' },
    { word: 'proximity', translation: 'близкість' },
    { word: 'boor', translation: 'грубіян' },
    { word: 'dearth', translation: 'дефіцит' },
    { word: 'deference', translation: 'повага' }
];

let shuffledWords = [];
let wordsDifficult = [];
let total = shuffledWords.length;
let translated = [];
let currentIndex = 0;
let correct = 0;
let incorrect = 0;

function chooseDifficult() {
    const selectedDifficult = $('input[name="difficult"]:checked').val();
    switch (selectedDifficult) {
        case 'easy':
            wordsDifficult = wordsEasy;
            break;
        case 'medium':
            wordsDifficult = wordsMedium;
            break;
        case 'hard':
            wordsDifficult = wordsHard;
            break;
        default:
            wordsDifficult = wordsEasy;
    }
    reset();
}

$(window).ready(function () {
    chooseDifficult();
});

function updateStats() {
    $('#count').text(`${currentIndex + 1}/${total}`);
    $('.correct').text(correct);
    $('.incorrect').text(incorrect);
}

function reset() {
    currentIndex = 0;
    correct = 0;
    incorrect = 0;
    translated = [];
    shuffledWords = [...wordsDifficult].sort(() => Math.random() - 0.5);
    total = shuffledWords.length;
    $('#translate').prop('disabled', false);
    $('#translateButt').prop('disabled', false).text('Перевірити');
    $('#answer').text('')
    updateCard();
    updateStats();
}

function updateCard() {
    const word = shuffledWords[currentIndex];
    $('#cardWord').text(word.word);
    $('#translate').val('');
    if (translated.includes(currentIndex)) {
        $('#translate').prop('disabled', true);
        $('#translateButt').prop('disabled', true).text('Перевірено');
    } else {
        $('#translate').prop('disabled', false);
        $('#translateButt').prop('disabled', false).text('Перевірити');
    }
}

function showModal() {
    const selectedDifficult = $('input[name="difficult"]:checked').val();
    const level = correct >= 8 ? 'Високий' : correct >= 5 ? 'Середній' : 'Низький';
    $('#resultMessage').text(`На рівні складності ${selectedDifficult} ваш результат становить ${correct} балів з 10. Рівень проходження: ${level}`);
    $('#modalOverlay').fadeIn();
}

function resultTranslate() {
    const word = shuffledWords[currentIndex];
    const userTranslation = $('#translate').val().trim().toLowerCase();
    if (userTranslation === word.translation) {
        correct++;
        $('#answer').css("color", "green");
        $('#answer').text("Відповіть правильна!");
    }
    else {
        incorrect++;
        $('#answer').css("color", "red");
        $('#answer').text(`Відповіть неправильна. Переклад: ${word.translation}`);
    }
    translated.push(currentIndex);
    currentIndex++;
    if (correct + incorrect === total) {
        showModal();
        $('.correct').text(correct);
        $('.incorrect').text(incorrect);
    } else if (currentIndex >= total) {
        currentIndex = 0;
    }
    updateCard();
    updateStats();
}

$('#easy, #medium, #hard').on('change', chooseDifficult);
$('#translateButt').on('click', resultTranslate);
$('#next').on('click', function () {
    currentIndex = (currentIndex + 1) % total;
    updateCard();
    updateStats();
});

$('#previous').on('click', function () {
    currentIndex = (currentIndex - 1 + total) % total;
    updateCard();
    updateStats();
});

$('#closeModal').on('click', function () {
    $('#modalOverlay').fadeOut();
});

$('#reset').on('click', function () {
    $('#modalOverlay').fadeOut();
    reset();
});

$(window).keydown(function (event) {
    switch (event.keyCode) {                
        case 37: {
            currentIndex = (currentIndex - 1 + total) % total;
            updateCard();
            updateStats();
        }
            break;
        case 39: {
            currentIndex = (currentIndex + 1) % total;
            updateCard();
            updateStats();
        }
            break;
        case 13: {
            if (correct + incorrect < total) resultTranslate();
        }
            break;
    }
});

updateStats();
updateCard();
