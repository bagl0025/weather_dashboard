var searchList = [];

$("#search").on("click", function(){
    var cityName = $("#city").val();
    // convert everything to standard first letter upper the rest lower
    cityName = cityName.toLowerCase();
    cityName = cityName[0].toUpperCase() + cityName.substring(1);
    if (!cityName) {
        return false;
    }
    else {
      getLatLon(cityName);    
      
      // if city name is in the list don't add it again
      if ($.inArray(cityName, searchList) === -1) {
        searchList.push(cityName);  
        $("#cityButtons").append("<button id='btnCity" + cityName + "' type='submit'>" + cityName + "</button>");
        $("#city").val("");
      }
      else {
        $("#city").val("");
      }
    }
});

$("#cityButtons").on("click", "[id^='btnCity']", function() {
  var cityName = $(this).text();
  console.log("city name: ",cityName);
  getLatLon(cityName);
});

$("#city").keypress(function(event) {
  if (event.keyCode === 13) {
      $("#search").click();
  }
});

var getLatLon = function(cityName) {
    var geoApi = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=b8cb4d524742e9bb26370e4cb8a14419";
    fetch(geoApi).then(function(response) {
      response.json().then(function(data) {
        console.log(data[0].lat);        
        getWeather(data[0].lon,data[0].lat,cityName);
      });
    });
  };

  var getWeather = function(lon,lat,cityName) {
    var cDate = moment().format("MM/DD/YYYY");
    var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lon=" + lon + "&lat=" + lat +"&appid=b8cb4d524742e9bb26370e4cb8a14419&units=imperial&exclude=minutely,hourly,alerts";
    fetch(weatherApi).then(function(response) {
      response.json().then(function(data) {
        console.log(data);
        
        $("#cwHeader").text(cityName + " (" + cDate +")");
        $("#currentIcon").attr("src", "http://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png", alt="weather icon");
        $("#city").text("Enter a city name")

        $("ul").empty();
        $("#currentWeather ul").append("<li>  Temp: " + data.current.temp + " \u00B0F</li>");
        $("#currentWeather ul").append("<li>  Wind: " + data.current.wind_speed + " MPH</li>");
        $("#currentWeather ul").append("<li>  Humidity: " + data.current.humidity + " %</li>");
        if (data.current.uvi < 3) {
          uviClass = "uviGreen"; 
        }
        else if (data.current.uvi >= 3 || data.current.uvi < 6) {
          uviClass = "uviYellow";
        }
        else if (data.current.uvi >= 6 || data.current.uvi < 8) {
          uviClass = "uviOrange";
        }
        else if (data.current.uvi >= 8 || data.current.uvi < 11) {
          uviClass = "uviRed";
        }
        else {
          uviClass = "uviPurple";
        }
        $("#currentWeather ul").append("<li id=uvi> UV Index: </li> " + "<span id=" + uviClass + ">" + data.current.uvi + "</span>");

        for (var i = 1; i < 6; i++) {
          $("#day-"+i +" h4").text(moment.unix(data.daily[i].dt).format("MM/DD/YYYY"));
          $("#day-"+i + " img").attr("src", "http://openweathermap.org/img/w/" + data.daily[i].weather[0].icon + ".png", alt="weather icon");
          $("#day-"+i +" ul").append("<li>Temp: " + data.daily[i].temp.day + " \u00B0F</li>");
          $("#day-"+i+ " ul").append("<li>Wind: " + data.daily[i].wind_speed + " MPH</li>");
          $("#day-"+i+ " ul").append("<li>Humidity: " + data.daily[i].humidity + " %</li>");
        }  
      });
    });
  }

//media queries
// check indent and spacing
//cards justify-content space between ?
  // style
  // save city list array to local storage
////check uvi
//readme
//screenshot
  // error on bad cityName - add to issues as enhancement
  // copy readme and storage syntax from previous