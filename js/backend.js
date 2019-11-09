'use strict';
(function () {
  var formSuccessTemplate = document.querySelector('#success').content.querySelector('.success');
  var formErrorTemplate = document.querySelector('#error').content.querySelector('.error');
  var mapFilters = document.querySelector('.map__filters');
  var KEYCODE_ESC = 27;

  window.backend = {
    load: function (onLoad, onError) {
      var url = 'https://js.dump.academy/keksobooking/data';
      //var url = 'https://raw.githubusercontent.com/pendeldam/HTMLAcademy/master/data.json';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError(xhr.status);
        }
      });
      xhr.timeout = 10000;
      xhr.open('get', url);
      xhr.send();
    },
    save: function (data, onLoad, onError) {
      var url = 'https://js.dump.academy/keksobooking';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad();
        } else {
          onError('Error ' + xhr.status);
        }
      });
      xhr.timeout = 10000;
      xhr.open('post', url);
      xhr.send(data);
    },
    loadPinsSuccess: function (data) {
      data.forEach(function (item) {
        if (!item.offer) {
          var index = window.map.offers.indexOf(item);
          data.splice(index, 1);
          return;
        } else {
          window.map.offers.push(item);
        }
      });
      window.rendering.renderPins(window.map.offers);
      window.form.enableForm(mapFilters, 'select');
    },
    loadPinsError: function (msg) {
      var errorElement = formErrorTemplate.cloneNode(true);
      errorElement.firstElementChild.textContent = 'Ошибка загрузки объявления ' + '(код: ' + msg + ')';
      document.body.insertAdjacentElement('afterbegin', errorElement);
    },
    sendFormSuccess: function () {
      var successMsg = formSuccessTemplate.cloneNode(true);
      document.body.insertAdjacentElement('afterbegin', successMsg);
      window.map.disablePage();
      document.body.addEventListener('click', function () {
        successMsg.remove();
      });
      document.addEventListener('keydown', function (evt) {
        if (evt.keyCode === KEYCODE_ESC) {
          successMsg.remove();
        }
      });
    },
    sendFormError: function () {
      var errorMsg = formErrorTemplate.cloneNode(true);
      document.querySelector('main').insertAdjacentElement('afterbegin', errorMsg);
      window.map.disablePage();
      document.body.addEventListener('click', function () {
        errorMsg.remove();
      });
      document.addEventListener('keydown', function (evt) {
        if (evt.keyCode === KEYCODE_ESC) {
          errorMsg.remove();
        }
      });
      document.querySelector('.error__button').addEventListener('click', function () {
        errorMsg.remove();
      });
    },
  };
})();
