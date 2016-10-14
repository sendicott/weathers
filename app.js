var moment = require('moment');

let app = angular.module('WeathersApp', ['ui.router']);

app.config(function ($stateProvider) {
    $stateProvider.state({
        name: "inputter",
        url: "/input",
        component: "inputter",
    });

    $stateProvider.state({
        name: "summary",
        url: "/summary",
        component: "summary",
    });

    $stateProvider.state({
        name: "directions",
        url: "/directions",
        component: "directions",
    });
});

// ------------Input Page------------
app.component("inputter", {
    templateUrl: "components/input.html",
    controller: "InputController",
});

app.controller("InputController", function($scope, WeatherService, $state) {
    $scope.start = 'Charlotte, NC'; // just for testing
    $scope.end = 'Denver, CO'; // just for testing

    $scope.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    let dayArray = [];
    for (let i = 1; i <= 31; i++) {
        dayArray.push(i);
    }
    $scope.days = dayArray;
    $scope.years = [moment().format('YYYY'), String(parseInt(moment().format('YYYY')) + 1)];

    let hourArray = [];
    for (let i = 1; i <= 24; i++) {
        hourArray.push(i);
    }
    $scope.hours = hourArray;

    let minuteArray = [];
    for (let i = 0; i <= 45; i = i + 15) {
        if (i === 0) {
            minuteArray.push("00");
        } else {
            minuteArray.push(i);
        }
    }
    $scope.minutes = minuteArray;

    $scope.setInputValues = function(start, end, month, day, year, hour, minute) {
        WeatherService.setStart(start);
        WeatherService.setEnd(end);
        let monthIndex = "";
        for (let i = 0; i <= 12; i++) {
            if (month === $scope.months[i]) {
                month = i;
            }
        }
        let time = new Date(year, month, day, hour, minute).getTime() / 1000;
        WeatherService.setTime(time);
        $state.go("summary");
    };
});
// ------------Input Page------------

// ------------Summary Page------------
app.component("summary", {
    templateUrl: "components/summary.html",
    controller: "SummaryController",
});

app.controller("SummaryController", function($scope, WeatherService) {
    $scope.summaryArray = WeatherService.getSummaryData();
});
// ------------Summary Page------------

// ------------Directions Page------------
app.component("directions", {
    templateUrl: "components/directions.html",
    controller: "DirectionsController",
});

app.controller("DirectionsController", function($scope, WeatherService) {
    $scope.directionsArray = WeatherService.getDirectionData();
});
// ------------Directions Page------------

app.factory("WeatherService", function($http) {
    let input = {
        start: null,
        end: null,
        time: null,
    };
    
    let summaryTesting = [
        {
            street: "95W",
            time: "12:00PM",
            weather: "Heavy Rain",
            temp: 74,
            icon: "wi-wu-rain",
        },
        {
            street: "85N",
            time: "4:00PM",
            weather: "Clear Skies",
            temp: 79,
            icon: "wi-wu-clear",
        },
        {
            street: "Interstate-77",
            time: "9:00PM",
            weather: "Blizzard",
            temp: 12,
            icon: "wi-wu-snow",
        },
        {
            street: "Shore Road",
            time: "4:00AM",
            weather: "Thunderstorm",
            temp: 64,
            icon: "wi-wu-tstorms",
        },
    ];

    let directionTesting = [
        {
            navicon: "arrow_downward",
            description: "Head southeast on W 1st St towards S Church St",
            distance: 400,
            distanceUnit: "feet",
            temp: 64,
            weather: "Thunderstorms",
            weathicon: "wi wi-wu-tstorms",
        },
               {
            navicon: "arrow_forward",
            description: "Turn right onto the Interstate 277 Outer N ramp",
            distance: 0.2,
            distanceUnit: "miles",
            temp: 63,
            weather: "Thunderstorms",
            weathicon: "wi wi-wu-tstorms",
        },
               {
            navicon: "arrow_upward",
            description: "Keep straight at the fork to continue on US-74 E, follow signs for NC-27 E/Independence Expy",
            distance: 76,
            distanceUnit: "miles",
            temp: 68,
            weather: "Rain",
            weathicon: "wi wi-wu-rain",
        },
               {
            navicon: "arrow_back",
            description: "Use the left 2 lands to turn left onto US-11 S/US Hwy 220 N (signs for US-220 N)",
            distance: 0.1,
            distanceUnit: "miles",
            temp: 35,
            weather: "Sleet",
            weathicon: "wi wi-wu-sleat",
        },
    ]

    return {
        setStart: function(firstInput) {
            input.start = firstInput;
        },

        setEnd: function(secondInput) {
            input.end = secondInput;
        },

        setTime: function(dateandtime) {
            input.time = dateandtime;
        },

        getInput: function() {
            return input;
        },

        getSummaryData: function() {
            // originally had only dataArray, tried to splice it
            // when the weather conditions matched
            // -- nothing was ever removed
            let dataArray = [];
            // now I have a second empty array, where I am trying to push
            // the current index of dataArray when it doesn't match the 
            // weather condition that came before it
            // -- returning an error because there are duplicates in my repeater
            let returnedArray = [];

            $http({
                method: 'GET',
                url: "https://whispering-cliffs-96344.herokuapp.com/?startLocation=" + input.start + "&endLocation=" + input.end + "&startTime=" + input.time
            }).then(function(response) {
                angular.copy(response.data, dataArray);
                returnedArray.push(dataArray[0]);
                for (let i = 1; i < dataArray.length; i++) {
                    if (dataArray[i].weather.currently.summary !== dataArray[i-1].weather.currently.summary) {
                        // dataArray.splice(i, 1);
                        // console.log(dataArray[i]);
                        returnedArray.push(dataArray[i]);
                    }
                };
                for (let j = 0; j < dataArray.length; j++) {
                    console.log(dataArray[j].weather.currently.summary);
                }
            }, function (response) {
            console.log("Failed");
            });
            return returnedArray;
        },

        getDirectionsData: function() {
            return summaryTesting;
        },

        getDirectionData: function() {
            return directionTesting;
        },
    };
});