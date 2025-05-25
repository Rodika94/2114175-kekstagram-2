const scaleValueInput = document.querySelector('.scale__control--value'); // отображение процентов
const scaleSmallerBtn = document.querySelector('.scale__control--smaller'); // минус
const scaleBiggerBtn = document.querySelector('.scale__control--bigger'); // плюсик
const previewImage = document.querySelector('.img-upload__preview img'); // фотка
const effectSlider = document.querySelector('.effect-level__slider'); // слайдер со значениями выбранного фильтра
const effectValueInput = document.querySelector('.effect-level__value'); // Уровень эффекта
const effectLevelContainer = document.querySelector('.img-upload__effect-level'); // эффект «Оригинал» слайдер и его контейнер
const effectsRadio = document.querySelectorAll('.effects__radio'); // все кнопки эффектов

const SCALE_STEP = 25; // шаг в 25
const SCALE_MIN = 25; // минимальный процент
const SCALE_MAX = 100; // максимальный процент
let currentScale = 100; // изначальное значение

const updateScale = (newScale) => { // функция изменения размера картинки
  currentScale = Math.min(Math.max(newScale, SCALE_MIN), SCALE_MAX); // получаем цифру в инете нашла не понимаю до конца
  console.log(currentScale);

  scaleValueInput.value = `${currentScale}%`; // записываем новое значение в инпут
  previewImage.style.transform = `scale(${currentScale / 100})`; // перезаписываем размер картинки
};

scaleSmallerBtn.addEventListener('click', () => {
  updateScale(currentScale - SCALE_STEP); // изначальная цифра минус шаг
});

scaleBiggerBtn.addEventListener('click', () => {
  updateScale(currentScale + SCALE_STEP); // изначальная цифра плюс щаг
});

// по умолчанию значение 100
updateScale(currentScale);

const effects = { // эффекты
  'chrome': {min: 0, max: 1, step: 0.1, start: 1, filter: (value) => `grayscale(${value})`},
  'sepia': {min: 0, max: 1, step: 0.1, start: 1, filter: (value) => `sepia(${value})`},
  'marvin': {min: 0, max: 100, step: 1, start: 100, filter: (value) => `invert(${value}%)`},
  'phobos': {min: 0, max: 3, step: 0.1, start: 3, filter: (value) => `blur(${value}px)`},
  'heat': {min: 1, max: 3, step: 0.1, start: 3, filter: (value) => `heat(${value})`},
  'none': {} // Оригинал
};

let currentEffect = 'none'; // выбранный эффект

function updateEffectSlider(effect) {
  if (effect === 'none') { // если выбран эффект 'none'
    effectLevelContainer.style.display = 'none'; // скрывается контейнер слайдера
    previewImage.style.filter = ''; // с изображения убирается CSS-фильтр
    effectValueInput.value = ''; // очищается поле ввода значения эффекта
    return;
  }

  effectLevelContainer.style.display = ''; // показывается контейнер слайдера

  const { min, max, step, start } = effects[effect]; // из объекта effects берутся параметры для выбранного эффекта: min, max, step, start.

  if (effectSlider.noUiSlider) { // если слайдер уже существует
    effectSlider.noUiSlider.updateOptions({ // обновляются его параметры (диапазон, старт, шаг)
      range: {min, max}, start, step
    });
  } else {
    noUiSlider.create(effectSlider, { // если слайдер ещё не был создан
      range: {min, max}, // создаётся новый слайдер с заданными параметрами
      start,
      step,
      connect: 'lower'
    });

    effectSlider.noUiSlider.on('update', (values, handle) => { // вешается обработчик события update
      const value = values[handle]; // получает текущее значение слайдера
      effectValueInput.value = value; // записывает его в поле ввода
      previewImage.style.filter = effects[currentEffect].filter(value); // применяет CSS-фильтр к изображению с этим значением.
    });
  }

  effectSlider.noUiSlider.set(start); // стартовое значение
}

// переключение эффекта:
effectsRadio.forEach((radio) => { // проходим по всем кнопкам
  radio.addEventListener('change', (evt) => { // если кнопка меняется
    currentEffect = evt.target.value; // то выбранному значению выбираем от нажатой
    updateEffectSlider(currentEffect); // и в функцию передаем значения от выбранного
  });
});

// выбор по умолчанию:
updateEffectSlider('none');
