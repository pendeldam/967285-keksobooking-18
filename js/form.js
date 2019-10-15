'use strict';
(function () {
  var timein = document.querySelector('#timein');
  var timeout = document.querySelector('#timeout');
  var capacity = document.querySelector('#capacity');
  var roomNumber = document.querySelector('#room_number');
  var type = document.querySelector('#type');

  window.form = {
    enableForm: function (form, input) {
      form.querySelectorAll(input).forEach(function (item) {
        item.removeAttribute('disabled');
      })
    },
    disableForm: function (form, input) {
      form.querySelectorAll(input).forEach(function (item) {
        item.setAttribute('disabled', true);
      })
    },
    checkOfferPrice: function () {
      var type = document.querySelector('#type').selectedOptions[0].value;
      var price = document.querySelector('#price');
      switch (type) {
        case 'flat':
          price.min = '1000';
          price.placeholder = '1000';
        break;
        case 'bungalo':
          price.min = '0';
          price.placeholder = '0';
        break;
        case 'house':
          price.min = '5000';
          price.placeholder = '5000';
        break;
        case 'palace':
          price.min = '10000';
          price.placeholder = '10000';
        break;
        default:
          price.min = '1000';
          price.placeholder = '1000';
      }
    },
    checkGuestsNumber: function () {
      var guests = +capacity.value;
      var rooms = +roomNumber.value;
      if (rooms === 100) {
        capacity.setCustomValidity('not for guests');
        capacity.style.borderColor = 'red';
      } else if (rooms !== 100 && !guests) {
        capacity.setCustomValidity('need some guests');
        capacity.style.borderColor = 'red';
      } else if (guests > rooms) {
        capacity.setCustomValidity('too much guests');
        document.querySelector('#capacity').style.borderColor = 'red';
      } else {
        capacity.setCustomValidity('');
        capacity.style.borderColor = '';
      }
    }
  };

  roomNumber.addEventListener('change', window.form.checkGuestsNumber);
  capacity.addEventListener('change', window.form.checkGuestsNumber);
  type.addEventListener('change', window.form.checkOfferPrice);
  timein.addEventListener('change', function (evt) {
    timeout.value = evt.target.value;
  });
  timeout.addEventListener('change', function (evt) {
    timein.value = evt.target.value;
  });
})();
