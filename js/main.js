document.querySelector('.map').classList.remove('map--faded');
var mapPins = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('.map__pin');
var fragment = document.createDocumentFragment();
var offers = [];

var getAvatar = function (number) {
  var avatar = 'img/avatars/user0' + number + '.png';
  return avatar;
};

var getHousingType = function () {
  var types = document.querySelector('#housing-type').children;
  return types[Math.floor(Math.random() * types.length)].value;
};

var getChecks = function () {
  var times = ['12:00', '13:00', '14:00'];
  return times[Math.floor(Math.random() * times.length)];
};

var getFeatures = function () {
  var features = [];
  var featuresList = document.querySelectorAll('.map__feature');
  var index = Math.floor(Math.random() * featuresList.length);
  for (var i = index; i < featuresList.length; i++) {
    features.push(featuresList[i].innerText);
  }
  return features;
};

var getPhotos = function () {
  var photos = [];
  var photosList = [
    "http://o0.github.io/assets/images/tokyo/hotel1.jpg",
    "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
    "http://o0.github.io/assets/images/tokyo/hotel3.jpg"
  ];
  var index = Math.floor(Math.random() * photosList.length);
  for (var i = index; i < photosList.length; i++) {
    photos.push(photosList[i]);
  }
  return photos;
};

var getLocationX = function () {
  return Math.floor(Math.random() * 1201);
};

var getLocationY = function () {
  return Math.floor(Math.random() * (630 - 130) + 130);
};

var getRandomOffer = function (number) {
  var randomOffer = {
    author: {
      avatar: getAvatar(number)
    },
    offer: {
      title: 'offer title',
      price: Math.floor(Math.random() * 10001),
      type: getHousingType(),
      rooms: Math.floor(Math.random() * 4),
      guests: Math.floor(Math.random() * 3),
      checkin: getChecks(),
      checkout: getChecks(),
      features: getFeatures(),
      description: 'offer description',
      photos: getPhotos()
    },
    location: {
      x: getLocationX(),
      y: getLocationY()
    }
  };
  return randomOffer;
};

var renderOffer = function (some) {
  var offerElement = mapPinTemplate.cloneNode(true);
  mapPinTemplate.setAttribute('style', 'left: ' + (some.location.x - 40) + 'px; ' + 'top: ' + (some.location.y - 40) + 'px');
  mapPinTemplate.children[0].setAttribute('src', some.author.avatar);
  mapPinTemplate.children[0].setAttribute('alt', some.offer.title);
  return offerElement;
};

for (var i = 1; i <= 8; i++) {
  var randomOffer = getRandomOffer(i);
  randomOffer.offer.address = randomOffer.location.x + ', ' + randomOffer.location.y;
  offers.push(randomOffer);
  fragment.appendChild(renderOffer(randomOffer));
}

mapPins.appendChild(fragment);
console.log(offers);
