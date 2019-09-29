var map = document.querySelector('.map');
var adForm = document.querySelector('.ad-form');
var mapFilters = map.querySelector('.map__filters');
var mapPins = map.querySelector('.map__pins');
var mapPinMain = map.querySelector('.map__pin--main');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var offers = [];
var times = document.querySelector('#timein').options;
var types = document.querySelector('#housing-type').children;
var featuresList = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photosList = [
  "http://o0.github.io/assets/images/tokyo/hotel1.jpg",
  "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
  "http://o0.github.io/assets/images/tokyo/hotel3.jpg"
];
var KEYCODE_ENTER = 13;

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var getRandomArray = function (array) {
  var result = [];
  var index = getRandomNumber(0, array.length);
  for (var i = index; i < array.length; i++) {
    result.push(array[i]);
  }
  return result;
};

var getAvatar = function (number) {
  return 'img/avatars/user0' + number + '.png';
};

var getRandomOffer = function (number) {
  var randomOffer = {
    author: {
      avatar: getAvatar(number)
    },
    offer: {
      title: 'offer title',
      price: getRandomNumber(1, 10000),
      type: types[getRandomNumber(1, types.length)].textContent,
      rooms: getRandomNumber(1, 4),
      guests: getRandomNumber(1, 4),
      checkin: times[getRandomNumber(0, times.length)].value,
      checkout: times[getRandomNumber(0, times.length)].value,
      features: getRandomArray(featuresList),
      description: 'offer description',
      photos: getRandomArray(photosList)
    },
    location: {
      x: getRandomNumber(10, map.offsetWidth),
      y: getRandomNumber(130, (630 - 130) + 130)
    }
  };
  return randomOffer;
};

var renderOffer = function (pin) {
  var offerElement = mapPinTemplate.cloneNode(true);
  offerElement.style.left = pin.location.x - mapPinTemplate.firstElementChild.width / 2 + 'px';
  offerElement.style.top = pin.location.y - mapPinTemplate.firstElementChild.height + 'px';
  offerElement.firstElementChild.src = pin.author.avatar;
  offerElement.firstElementChild.alt = pin.offer.title;
  return offerElement;
};

var renderCard = function (random) {
  var fragment = document.createDocumentFragment();
  var cardElement = cardTemplate.cloneNode(true);

  var photosBlock = cardElement.querySelector('.popup__photos');
  photosBlock.innerHTML = '';
  random.offer.photos.forEach(function (photo) {
    var element = document.createElement('img');
    element.className = 'popup__photo';
    element.src = photo;
    element.width = 45;
    element.height = 40;
    element.alt = 'offer image';
    photosBlock.appendChild(element);
  });

  var featuresBlock = cardElement.querySelector('.popup__features');
  featuresBlock.innerHTML = '';
  random.offer.features.forEach(function (feature) {
    var element = document.createElement('li');
    element.className = 'popup__feature popup__feature--' + feature;
    featuresBlock.appendChild(element);
  });

  cardElement.querySelector('.popup__title').textContent = random.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = random.offer.address;
  cardElement.querySelector('.popup__text--price').innerHTML = random.offer.price + ' &#x20bd;<span>/ночь</span>';
  cardElement.querySelector('.popup__type').textContent = random.offer.type;
  cardElement.querySelector('.popup__text--capacity').textContent = random.offer.rooms + ' комнаты для ' + random.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + random.offer.checkin + '. Выезд до ' + random.offer.checkout;
  cardElement.querySelector('.popup__description').textContent = random.offer.description;
  cardElement.querySelector('.popup__avatar').src = random.author.avatar;
  fragment.appendChild(cardElement);
  map.insertBefore(fragment, mapPins.nextSibling);
};

var renderPins = function (number) {
  var fragment = document.createDocumentFragment();
  for (var i = 1; i <= number; i++) {
    var randomOffer = getRandomOffer(i);
    randomOffer.offer.address = randomOffer.location.x + ', ' + randomOffer.location.y;
    offers.push(randomOffer);
    fragment.appendChild(renderOffer(randomOffer));
  }
  mapPins.appendChild(fragment);
};

var disableForm = function (form, input) {
  form.querySelectorAll(input).forEach(function (item) {
    item.setAttribute('disabled', true);
  })
};

var enableForm = function (form, input) {
  form.querySelectorAll(input).forEach(function (item) {
    item.removeAttribute('disabled');
  })
};

var enablePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  enableForm(adForm, 'fieldset');
  enableForm(mapFilters, 'select');
  setOfferPrice('flat');
};

var disablePage = function () {
  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
  disableForm(adForm, 'fieldset');
  disableForm(mapFilters, 'select');
  getPinCoordinates();
};

var getPinCoordinates = function () {
  var axisX= mapPinMain.offsetTop;
  var axisY= mapPinMain.offsetLeft;

  if (!map.classList.contains('map--faded')) {
    adForm.querySelector('#address').value = Math.ceil(axisX + mapPinMain.offsetHeight / 2) + ', ' + Math.ceil(axisY + mapPinMain.offsetWidth / 2);
  } else {
      adForm.querySelector('#address').value = axisX + ', ' + axisY;
  }
};

var setOfferPrice = function () {
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
};

var checkGuestsNumber = function () {
  var guests = +document.querySelector('#capacity').value;
  var rooms = +document.querySelector('#room_number').value;
  if (rooms === 100) {
    document.querySelector('#capacity').setCustomValidity('not for guests');
    document.querySelector('#capacity').style.backgroundColor = 'pink';
  } else if (guests > rooms) {
    document.querySelector('#capacity').setCustomValidity('too much guests');
    document.querySelector('#capacity').style.backgroundColor = 'pink';
  } else {
    document.querySelector('#capacity').setCustomValidity('');
    document.querySelector('#capacity').style.backgroundColor = '';
  }
};

document.querySelector('.map__pin--main').addEventListener('mousedown', function (evt) {
  enablePage();
  getPinCoordinates();
});

document.querySelector('.map__pin--main').addEventListener('keydown', function (evt) {
  if (evt.keyCode === KEYCODE_ENTER) {
    enablePage();
    getPinCoordinates();
  }
});

document.querySelector('#timein').addEventListener('change', function (evt) {
  document.querySelector('#timeout').value = evt.target.value;
});

document.querySelector('#timeout').addEventListener('change', function (evt) {
  document.querySelector('#timein').value = evt.target.value;
});

document.querySelector('#room_number').addEventListener('change', checkGuestsNumber);
document.querySelector('#capacity').addEventListener('change', checkGuestsNumber);
document.querySelector('#type').addEventListener('change', setOfferPrice);

disablePage();
