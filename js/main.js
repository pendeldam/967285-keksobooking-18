var map = document.querySelector('.map');
map.classList.remove('map--faded');
var mapPins = document.querySelector('.map__pins');
var mapFilters = document.querySelector('map__filters-container');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var fragment = document.createDocumentFragment();
var offers = [];
var times = document.querySelector('#timein').options;
var types = document.querySelector('#housing-type').children;
var featuresList = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photosList = [
  "http://o0.github.io/assets/images/tokyo/hotel1.jpg",
  "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
  "http://o0.github.io/assets/images/tokyo/hotel3.jpg"
];

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

var renderOffer = function (some) {
  var offerElement = mapPinTemplate.cloneNode(true);
  mapPinTemplate.style.left = some.location.x - mapPinTemplate.firstElementChild.width / 2 + 'px';
  mapPinTemplate.style.top = some.location.y - mapPinTemplate.firstElementChild.height + 'px';
  mapPinTemplate.firstElementChild.src = some.author.avatar;
  mapPinTemplate.firstElementChild.alt = some.offer.title;
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
  map.insertBefore(fragment, mapFilters);
};

for (var i = 1; i < 9; i++) {
  var randomOffer = getRandomOffer(i);
  randomOffer.offer.address = randomOffer.location.x + ', ' + randomOffer.location.y;
  offers.push(randomOffer);
  fragment.appendChild(renderOffer(randomOffer));
}

mapPins.appendChild(fragment);
renderCard(offers[0]);
