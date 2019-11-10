'use strict';
(function () {
  var KEYCODE_ENTER = 13;
  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters');
  var mapPinMain = map.querySelector('.map__pin--main');
  var mapPinMainStartX = mapPinMain.offsetLeft;
  var mapPinMainStartY = mapPinMain.offsetTop;
  var adForm = document.querySelector('.ad-form');
  var adFormReset = adForm.querySelector('.ad-form__reset');
  var avatar = adForm.querySelector('#avatar');
  var photo = adForm.querySelector('.ad-form__upload input');
  var capacity = adForm.querySelector('#capacity');
  var roomNumber = adForm.querySelector('#room_number');
  var timein = adForm.querySelector('#timein');
  var timeout = adForm.querySelector('#timeout');
  var type = adForm.querySelector('#type');
  var price = adForm.querySelector('#price');
  var address = adForm.querySelector('#address');
  var isEnabled = false;

  window.map = {
    offers: [],
    disablePage: function () {
      isEnabled = false;
      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      adForm.reset();
      mapFilters.reset();
      window.form.disableForm(adForm, 'fieldset');
      window.form.disableForm(mapFilters, 'select');
      adForm.querySelector('.ad-form-header__preview img').src = 'img/muffin-grey.svg';
      adForm.querySelector('.ad-form__photo').removeAttribute('style');

      if (document.querySelector('.map__card')) {
        window.card.closeCardHandler();
      }

      document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pin) {
        pin.removeEventListener('mousedown', window.card.openCardHandler);
        pin.remove();
      });
      avatar.removeEventListener('change', window.form.uploadImage);
      photo.removeEventListener('change', window.form.uploadImage);
      roomNumber.removeEventListener('change', window.form.checkGuestsNumber);
      capacity.removeEventListener('change', window.form.checkGuestsNumber);
      type.removeEventListener('change', window.form.checkOfferPrice);
      timein.removeEventListener('change', window.form.checkTime);
      timeout.removeEventListener('change', window.form.checkTime);

      address.value = Math.ceil(mapPinMainStartX + mapPinMain.offsetWidth / 2) + ', ' + Math.ceil(mapPinMainStartY + mapPinMain.offsetHeight / 2);
      mapPinMain.style.left = mapPinMainStartX + 'px';
      mapPinMain.style.top = mapPinMainStartY + 'px';
      price.min = '1000';
      price.placeholder = '1000';
    },
    enablePage: function () {
      if (isEnabled) {
        return;
      }
      isEnabled = true;
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      window.form.enableForm(adForm, 'fieldset');
      window.backend.load(window.backend.loadPinsSuccess, window.backend.loadPinsError);
      address.value = Math.ceil(mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2) + ', ' + Math.ceil(mapPinMain.offsetTop + mapPinMain.offsetHeight);

      avatar.addEventListener('change', window.form.uploadImage);
      photo.addEventListener('change', window.form.uploadImage);
      roomNumber.addEventListener('change', window.form.checkGuestsNumber);
      capacity.addEventListener('change', window.form.checkGuestsNumber);
      type.addEventListener('change', window.form.checkOfferPrice);
      timein.addEventListener('change', window.form.checkTime);
      timeout.addEventListener('change', window.form.checkTime);
      mapFilters.addEventListener('change', window.filtering.addFilter);

      adForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        window.backend.save(new FormData(adForm), window.backend.sendFormSuccess, window.backend.sendFormError);
      });
    }
  };

  adFormReset.addEventListener('click', window.map.disablePage);
  adFormReset.addEventListener('keydown', function (evt) {
    if (evt.keyCode === KEYCODE_ENTER) {
      window.map.disablePage();
    }
  });

  window.map.disablePage();
})();
