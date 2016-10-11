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
    $scope.start = "";
    $scope.setInputValues = function(start, end, time) {
        WeatherService.setStart(start);
        WeatherService.setEnd(end);
        WeatherService.setTime(time);
        $state.go("summary");
        // console.log(WeatherService.getInput());
        // console.log(WeatherService.getURL());
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
    // console.log(summaryArray);
});
// ------------Summary Page------------

// ------------Directions Page------------
app.component("directions", {
    templateUrl: "components/directions.html",
    controller: "DirectionsController",
});

app.controller("DirectionsController", function($scope, WeatherService) {
    $scope.directionsArray = WeatherService.getDirectionData();
    // $scope.test = "Directions";
});
// ------------Directions Page------------

app.factory("WeatherService", function($http) {

    let input = {
        start: null,
        end: null,
        time: null,
    };

    let testing = null;

    // $http({
    //     method: 'GET',
    //     url: "https://polar-meadow-84741.herokuapp.com/directions/?startLocation=" + input.start + "&endLocation=" + input.end + "&startTime=" + input.time
    // }).then(function(response) {
    //     angular.copy(response.data, testing);
    //     console.log(testing);
    // }, function (response) {
    // console.log("Failed");
    // });
 
    let summaryTesting = [
        {
            street: "95W",
            time: "12:00PM",
            weather: "Heavy Rain",
            temp: 74,
            icon: "wi wi-wu-rain",
        },
        {
            street: "85N",
            time: "4:00PM",
            weather: "Clear Skies",
            temp: 79,
            icon: "wi wi-wu-clear",
        },
        {
            street: "Interstate-77",
            time: "9:00PM",
            weather: "Blizzard",
            temp: 12,
            icon: "wi wi-wu-snow",
        },
        {
            street: "Shore Road",
            time: "4:00AM",
            weather: "Thunderstorm",
            temp: 64,
            icon: "wi wi-wu-tstorms",
        }
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

        setTime: function(thirdInput) {
            thirdInput = moment(thirdInput).format();
            console.log(thirdInput);
            input.time = thirdInput;
        },

        getInput: function() {
            return input;
        },

        getURL: function() {
            return "https://polar-meadow-84741.herokuapp.com/directions/?startLocation=" + input.start + "&endLocation=" + input.end + "&startTime=" + input.time;
        },

        getSummaryData: function() {
            return summaryTesting;
        },

        getDirectionData: function() {
            return directionTesting;
        },
    };
});