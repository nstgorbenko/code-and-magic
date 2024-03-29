'use strict';
(function () {
  var COAT_COLORS = ['rgb(101, 137, 164)', 'rgb(241, 43, 107)', 'rgb(146, 100, 161)', 'rgb(56, 159, 117)', 'rgb(215, 210, 55)', 'rgb(0, 0, 0)'];
  var EYE_COLORS = ['black', 'red', 'blue', 'yellow', 'green'];
  var FIREBALL_COLORS = ['#ee4830', '#30a8ee', '#5ce6c0', '#e848d5', '#e6e848'];
  var DEBOUNCE_INTERVAL = 500;
  var COAT_SCORE = 2;
  var EYE_SCORE = 1;

  /**
   * Возвращает функцию, определяющую следующее порядковое значение цвета из массива
   * @param {Array.<string>} someColors - массив цветов
   * @return {Function}
   */
  var getNext = function (someColors) {
    var counter = 0;

    return function () {
      counter = counter === someColors.length - 1 ? 0 : ++counter;
      return someColors[counter];
    };
  };

  /**
   * Меняет цвет элемента на странице и записывает это значение в соответствующий input
   * @param {Node} coloredItem - элемент, цвет которого необходимо изменить
   * @param {Node} itemInput - input для передачи данных
   * @param {RequestCallback} colorCounter - функция, возвращает следующее порядковое значение цвета из массива
   */
  var chooseFillColor = function (coloredItem, itemInput, colorCounter) {
    var color = colorCounter();

    itemInput.value = color;
    if (coloredItem.tagName === 'use') {
      coloredItem.style.fill = color;
    } else {
      coloredItem.style.background = color;
    }
  };

  /**
   * Присваивает похожим волшебникам баллы (плащ +2 балла, глаза +1 балл)
   * @param {Object} wizard - объект с данными о случайном волшебнике
   * @return {Number} points - начисленные баллы
   */
  var getPoints = function (wizard) {
    var points = 0;
    points = wizard.colorCoat === coatColor ? points + COAT_SCORE : points;
    points = wizard.colorEyes === eyesColor ? points + EYE_SCORE : points;

    return points;
  };

  /**
   * Возвращает результат сравнения строк в соответствии с Юникод-кодировкой
   * @param {String} first - имя первого волшебника
   * @param {String} second - имя второго волшебника
   * @return {Number} - результат сравнения
   */
  var sortNames = function (first, second) {
    return first < second ? -1 : 1;
  };

  /**
   * Функция сравнения похожих волшебников на основании начисленных баллов и их имен
   * @param {Object} first - первый волшебник
   * @param {Object} second - второй волшебник
   * @return {Number} - результат сравнения
   */
  var compareWizards = function (first, second) {
    return getPoints(second) - getPoints(first) === 0 ? sortNames(first.name, second.name) : getPoints(second) - getPoints(first);
  };

  /**
   * Отрисовывает волшебников, похожих на выбранного персонажа
   */
  var updateWizards = function () {
    window.wizards.renderSimilarWizards(window.wizards.wizardsList.sort(compareWizards));
  };

  /**
   * Устраняет мигание интерфейса при отрисовке похожих волшебников
   */
  var debounce = function () {
    if (timeOut) {
      window.clearTimeout(timeOut);
    }
    timeOut = window.setTimeout(function () {
      updateWizards();
    }, DEBOUNCE_INTERVAL);
  };

  /**
   * Меняет цвет плаща волшебника по клику, отрисовывает похожих волшебников
   */
  var onWizardCoatClick = function () {
    chooseFillColor(wizardCoat, coatInput, coatCounter);
    coatColor = coatInput.value;
    debounce();
  };

  /**
   * Меняет цвет глаз волшебника по клику, отрисовывает похожих волшебников
   */
  var onWizardEyesClick = function () {
    chooseFillColor(wizardEyes, eyesInput, eyesCounter);
    eyesColor = eyesInput.value;
    debounce();
  };

  /**
   * Меняет цвет файербола волшебника по клику
   */
  var onWizardFireballClick = function () {
    chooseFillColor(wizardFireball, fireballInput, fireballCounter);
  };

  var wizardCoat = document.querySelector('.wizard-coat');
  var wizardEyes = document.querySelector('.wizard-eyes');
  var wizardFireball = document.querySelector('.setup-fireball-wrap');
  var coatInput = document.querySelector('input[name="coat-color"]');
  var eyesInput = document.querySelector('input[name="eyes-color"]');
  var fireballInput = document.querySelector('input[name="fireball-color"]');
  var timeOut;
  var coatColor = COAT_COLORS[0];
  var eyesColor = EYE_COLORS[0];
  var coatCounter = getNext(COAT_COLORS);
  var eyesCounter = getNext(EYE_COLORS);
  var fireballCounter = getNext(FIREBALL_COLORS);

  window.color = {
    wizardCoat: wizardCoat,
    wizardEyes: wizardEyes,
    wizardFireball: wizardFireball,

    onWizardCoatClick: onWizardCoatClick,
    onWizardEyesClick: onWizardEyesClick,
    onWizardFireballClick: onWizardFireballClick
  };
})();
