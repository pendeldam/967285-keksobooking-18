'use strict';
(function () {
  var formSuccessTemplate = document.querySelector('#success').content.querySelector('.success');
  var formErrorTemplate = document.querySelector('#error').content.querySelector('.error');
  var mapFilters = document.querySelector('.map__filters');
  var KEYCODE_ESC = 27;
  var TIMEOUT = 10000;

  var closeMsg = function () {
    document.body.firstElementChild.remove();
    document.body.removeEventListener('click', closeMsg);
    document.body.removeEventListener('keydown', onCloseMsg);
  };
  var onCloseMsg = function (evt) {
    if (evt.keyCode === KEYCODE_ESC) {
      closeMsg();
    }
  };

  window.backend = {
    load: function (onLoad, onError) {
      var url = 'https://js.dump.academy/keksobooking/data';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError('Ошибка загрузки объявления (код: ' + xhr.status + ')');
        }
      });

      xhr.addEventListener('error', function () {
        onError('Ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = TIMEOUT;
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
      xhr.timeout = TIMEOUT;
      xhr.open('post', url);
      xhr.send(data);
    },
    loadPinsSuccess: function (data) {
      data.forEach(function (item) {
        if (!item.offer) {
          data.splice(data.indexOf(item), 1);
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
      errorElement.firstElementChild.textContent = msg;
      document.body.insertAdjacentElement('afterbegin', errorElement);
      window.map.disablePage();
      document.body.addEventListener('click', closeMsg);
      document.body.addEventListener('keydown', onCloseMsg);
      document.querySelector('.error__button').addEventListener('click', closeMsg);
    },
    sendFormSuccess: function () {
      var successMsg = formSuccessTemplate.cloneNode(true);
      document.body.insertAdjacentElement('afterbegin', successMsg);
      window.map.disablePage();
      document.body.addEventListener('click', closeMsg);
      document.body.addEventListener('keydown', onCloseMsg);
    },
    sendFormError: function () {
      var errorMsg = formErrorTemplate.cloneNode(true);
      document.body.insertAdjacentElement('afterbegin', errorMsg);
      window.map.disablePage();
      document.body.addEventListener('click', closeMsg);
      document.body.addEventListener('keydown', onCloseMsg);
      document.querySelector('.error__button').addEventListener('click', closeMsg);
    }
  };
})();
