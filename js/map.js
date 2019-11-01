'use strict';
(function () {
  var KEYCODE_ENTER = 13;
  var KEYCODE_ESC = 27;
  var pageIsActive = false;
  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var mapFilters = map.querySelector('.map__filters');
  var mapPins = map.querySelector('.map__pins');
  var mapPinMain = map.querySelector('.map__pin--main');
  var mapPinMainStartX = mapPinMain.offsetLeft;
  var mapPinMainStartY = mapPinMain.offsetTop;
  var formSuccessTemplate = document.querySelector('#success').content.querySelector('.success');
  var formErrorTemplate = document.querySelector('#error').content.querySelector('.error');
  var capacity = adForm.querySelector('#capacity');
  var roomNumber = adForm.querySelector('#room_number');
  var type = adForm.querySelector('#type');
  var address = adForm.querySelector('#address');
  address.value = mapPinMain.offsetTop + ', ' + mapPinMain.offsetLeft;

  window.map = {
    offers: [],
    filters: {},
    loadPinsSuccess: function (data) {
      data.forEach(function (item) {
        window.map.offers.push(item);
      });
      window.render.pin(window.map.offers);
    },
    loadPinsError: function (msg) {
      var errorElement = formErrorTemplate.cloneNode(true);
      errorElement.firstElementChild.textContent = 'Ошибка загрузки объявления ' + '(код: ' + msg + ')';
      document.body.insertAdjacentElement('afterbegin', errorElement);
    },
    checkPinCoords: function (startX, startY, shiftX, shiftY) {
      if (startX < mapPins.offsetParent.offsetLeft) {
        mapPinMain.style.left = mapPins.offsetParent.offsetLeft - mapPins.offsetParent.offsetLeft - mapPinMain.offsetWidth / 2 + 'px';
      } else if (startX > map.offsetWidth + map.offsetLeft) {
        mapPinMain.style.left = map.offsetWidth - mapPinMain.offsetWidth / 2 + 'px';
      } else {
        mapPinMain.style.left = (mapPinMain.offsetLeft - shiftX) + 'px';
      }
      if (startY < 130 - mapPinMain.offsetHeight) {
        mapPinMain.style.top = 130 - mapPinMain.offsetHeight + 'px';
      } else if (startY > 630 + mapPinMain.offsetHeight) {
        mapPinMain.style.top = 630 + 'px';
      } else {
        mapPinMain.style.top = (mapPinMain.offsetTop - shiftY) + 'px';
      }
    },
    disablePage: function () {
      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      window.form.disableForm(adForm, 'fieldset');
      window.form.disableForm(mapFilters, 'select');
      document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pin) {
        pin.remove();
      });
      if (document.querySelector('.map__card')) {
        window.card.closeCardHandler();
      }
      address.value = mapPinMainStartX + ', ' + mapPinMainStartY;
      mapPinMain.style.left = mapPinMainStartX + 'px';
      mapPinMain.style.top = mapPinMainStartY + 'px';
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
    enablePage: function () {
      if (pageIsActive) {
        return
      }
      pageIsActive = true;
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      window.form.enableForm(adForm, 'fieldset');
      window.form.enableForm(mapFilters, 'select');
      window.backend.load(window.map.loadPinsSuccess, window.map.loadPinsError);
      window.form.checkOfferPrice();
      address.value = Math.ceil(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2) + ', ' + Math.ceil(mapPinMain.offsetTop + mapPinMain.offsetHeight);

      roomNumber.addEventListener('change', window.form.checkGuestsNumber);
      capacity.addEventListener('change', window.form.checkGuestsNumber);
      type.addEventListener('change', window.form.checkOfferPrice);
      mapFilters.addEventListener('change', window.filtering.add);

      adForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        window.backend.save(new FormData(adForm), window.map.sendFormSuccess, window.map.sendFormError);
      });
    }
  };

  mapPinMain.addEventListener('click', window.map.enablePage);
  mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.keyCode === KEYCODE_ENTER) {
    window.map.enablePage();
  }
  });

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (evt) {
      evt.preventDefault();

      var shift = {
        x: startCoords.x - evt.clientX,
        y: startCoords.y - evt.clientY
      };

      startCoords.x = evt.clientX;
      startCoords.y = evt.clientY;
      address.value = Math.ceil(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2) + ', ' + Math.ceil(mapPinMain.offsetTop + mapPinMain.offsetHeight);
      window.map.checkPinCoords(startCoords.x, startCoords.y, shift.x, shift.y);
    };

    var onMouseUp = function (evt) {
      evt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      address.value = Math.ceil(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2) + ', ' + Math.ceil(mapPinMain.offsetTop + mapPinMain.offsetHeight);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
  window.map.disablePage();
})();
