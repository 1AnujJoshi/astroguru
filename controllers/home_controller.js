var client = require('../api/api');

//render home page
module.exports.home = function (req, res) {
  return res.render('home', {
    title: 'home',
  });
};

//get data from both the api and send it to views to render
//Note- gem_suggestion api is not sending any data stating {"status":false,"msg":"Your subscribed plan is not authorized to access this API. Kindly visit your dashboard."}.
module.exports.getData = function (req, res) {
  var astroDetails = 'astro_details';
  var birthDetails = 'birth_details';

  var dateObj = new Date(req.body.date);
  // req.body.month = dateObj.getMonth() + 1; //months from 1-12
  // req.body.day = parseInt(dateObj.getDate());
  // req.body.year = dateObj.getFullYear();
  // req.body.minute = dateObj.getMinutes();
  // req.body.hour = dateObj.getHours();
  var month = dateObj.getMonth() + 1; //months from 1-12
  var day = parseInt(dateObj.getDate());
  var year = dateObj.getFullYear();
  var minute = dateObj.getMinutes();
  var hour = dateObj.getHours();
  var latitude = req.body.lat;
  var longitude = req.body.lon;
  var zone = req.body.zone;
  console.log(day, 'value of day)');
  // call horoscope apis
  client.call(
    astroDetails,
    day,
    month,
    year,
    hour,
    minute,
    latitude,
    longitude,
    zone,
    function (error, result) {
      if (error) {
        console.log('Response Error returned!!');
      } else {
        console.log('Response details has arrived from API server --');
        console.log(result);
        //save result in obj
        var obj = JSON.parse(result);

        client.call(
          birthDetails,
          day,
          month,
          year,
          hour,
          minute,
          latitude,
          longitude,
          zone,
          function (error, result) {
            if (error) {
              console.log('Response Error returned!!');
            } else {
              console.log('Response details has arrived from API server --');
              console.log(result);
              const birth = JSON.parse(result);
              //save birth details received from api and add it to astro details received above in obj object
              obj = { ...obj, birth };
              //render horoscope page and send obj along with it
              return res.render('horoscope', {
                title: 'Horoscope',
                horoscope: obj,
              });
            }
          }
        );
      }
    }
  );
};
