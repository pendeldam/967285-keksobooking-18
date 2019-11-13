'use strict';
(function () {
  var adForm = document.querySelector('.ad-form');
  var avatar = adForm.querySelector('.ad-form-header__preview img');
  var photo = adForm.querySelector('.ad-form__photo');
  var title = adForm.querySelector('#title');
  var description = adForm.querySelector('#description');
  var timein = adForm.querySelector('#timein');
  var timeout = adForm.querySelector('#timeout');
  var capacity = adForm.querySelector('#capacity');
  var roomNumber = adForm.querySelector('#room_number');
  var price = adForm.querySelector('#price');
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  window.form = {
    enableForm: function (form, input) {
      form.querySelectorAll(input).forEach(function (item) {
        item.removeAttribute('disabled');
      });
    },
    disableForm: function (form, input) {
      title.value = '';
      description.value = '';
      price.value = '';
      form.querySelectorAll(input).forEach(function (item) {
        item.setAttribute('disabled', true);
      });
    },
    checkOfferPrice: function (evt) {
      switch (evt.target.value) {
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
        capacity.style.borderColor = 'red';
      } else {
        capacity.setCustomValidity('');
        capacity.style.borderColor = '';
      }
    },
    checkTimeIn: function (evt) {
      timeout.value = evt.target.value
    },
    checkTimeOut: function (evt) {
      timein.value = evt.target.value
    },
    uploadImage: function (evt) {
      var file = evt.target.files[0];
      var filename = file.name.toLowerCase();

      var match = FILE_TYPES.some(function (type) {
        return filename.endsWith(type);
      });

      if (match) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          if (evt.target.name === 'avatar') {
            avatar.src = reader.result;
          } else {
            photo.style.background = 'no-repeat center/100% url(' + reader.result + ')';
          }
        });
        reader.readAsDataURL(file);
      }
    },
    sendForm: function (evt) {
      evt.preventDefault();
      window.backend.save(new FormData(adForm), window.backend.sendFormSuccess, window.backend.sendFormError);
    }
  };
})();
