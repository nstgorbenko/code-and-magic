'use strict';
(function () {
  var WIZARD_NUMBER = 4;
  /**
   * Создает DOM-элемент на основе объекта с данными
   * @param {Object} wizardData - объект с данными о случайном волшебнике
   * @return {Node}
   */
  var renderWizard = function (wizardData) {
    var newWizard = similarWizardTemplate.cloneNode(true);

    newWizard.querySelector('.setup-similar-label').textContent = wizardData.name;
    newWizard.querySelector('.wizard-coat').style.fill = wizardData.colorCoat;
    newWizard.querySelector('.wizard-eyes').style.fill = wizardData.colorEyes;

    return newWizard;
  };

  /**
   * Возвращает фрагмент c DOM-элементами
   * @param {Array.<object>} allWizards - массив объектов с данными о волшебниках
   * @return {NodeList}
   */
  var putWizards = function (allWizards) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < WIZARD_NUMBER; i++) {
      fragment.appendChild(renderWizard(allWizards[i]));
    }

    return fragment;
  };

  /**
   * Отрисовывает похожих волшебников на странице
   * @param {Array.<object>} receivedWizards - массив объектов с данными о волшебниках
   */
  var renderSimilarWizards = function (receivedWizards) {
    similarWizardsList.innerHTML = '';
    similarWizardsList.appendChild(putWizards(receivedWizards));
    similarWizards.classList.remove('hidden');
  };

  /**
   * Коллбэк-функция, принимает данные с сервера, отрисовывает на их основе волшебников
   * @param {Array.<object>} serverData - массив объектов с данными о волшебниках
   */
  var onSuccessLoad = function (serverData) {
    serverData.forEach(function (item) {
      wizardsList.push(item);
    });
    renderSimilarWizards(wizardsList);
  };

  /**
   * Коллбэк-функция, выводит сообщение об ошибке
   * @param {String} error - сообщение об ошибке
   */
  var onErrorLoad = function (error) {
    var errorMessage = document.createElement('div');
    errorMessage.style = 'z-index: 10; text-align: center; background-color: white; border: 2px solid red; position: absolute; left: 0; right: 0; font-size: 20; color: red;';
    errorMessage.textContent = error;
    document.body.insertAdjacentElement('afterbegin', errorMessage);
  };

  /**
   * Коллбэк-функция, закрывает окно настроек персонажа
   */
  var onSuccessSubmit = function () {
    window.setup.closePopup();
  };

  /**
   * Отправляет данные на сервер
   * @param {Object} evt - объект события 'submit'
   */
  var onFormSubmit = function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(form), onSuccessSubmit, onErrorLoad);
    submitButton.disabled = true;
  };

  var form = document.querySelector('.setup-wizard-form');
  var submitButton = form.querySelector('.setup-submit');
  var similarWizardTemplate = document.querySelector('#similar-wizard-template').content.querySelector('.setup-similar-item');
  var similarWizardsList = form.querySelector('.setup-similar-list');
  var similarWizards = form.querySelector('.setup-similar');
  var wizardsList = [];

  window.backend.load(onSuccessLoad, onErrorLoad);

  window.wizards = {
    form: form,
    wizardsList: wizardsList,
    submitButton: submitButton,

    onFormSubmit: onFormSubmit,
    renderSimilarWizards: renderSimilarWizards
  };
})();
