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

app.controller("InputController", function ($scope, WeatherService, $state) {
    $scope.start = 'Charlotte, NC'; // just for testing
    $scope.end = 'San Francisco, CA'; // just for testing

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

    $scope.setInputValues = function (start, end, month, day, year, hour, minute) {
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

app.controller("SummaryController", function ($scope, WeatherService) {
    $scope.summaryArray = WeatherService.getSummaryData();
    $scope.seeDirections = function () {
        $state.go("directions");
    }
});
// ------------Summary Page------------

// ------------Directions Page------------
app.component("directions", {
    templateUrl: "components/directions.html",
    controller: "DirectionsController",
});

app.controller("DirectionsController", function ($scope, WeatherService) {
    $scope.directionsArray = WeatherService.getDirectionsData();
    console.log(WeatherService.getDirectionsData());
});
// ------------Directions Page------------

app.factory("WeatherService", function ($http) {
    let input = {
        start: null,
        end: null,
        time: null,
    };

    let dataArray = [];

    return {
        setStart: function (firstInput) {
            input.start = firstInput;
        },

        setEnd: function (secondInput) {
            input.end = secondInput;
        },

        setTime: function (dateandtime) {
            input.time = dateandtime;
        },

        getSummaryData: function () {
            let returnedArray = [];

            $http({
                method: 'GET',
                url: "https://whispering-cliffs-96344.herokuapp.com/?startLocation=" + input.start + "&endLocation=" + input.end + "&startTime=" + input.time
            }).then(function (response) {
                angular.copy(response.data, dataArray);
                returnedArray.push(dataArray[0]);
                for (let i = 1; i < dataArray.length; i++) {
                    if (dataArray[i].weathers[0].currently.summary !== dataArray[i - 1].weathers[0].currently.summary) {
                        returnedArray.push(dataArray[i]);
                    }
                };
                for (let j = 0; j < returnedArray.length; j++) {
                    returnedArray[j].displayTime = moment.unix(returnedArray[j].epochTime).format('MMMM Do, h:mm a');
                }

                // Get the location name for latlongs
                for (let j = 0; j < returnedArray.length; j++) {
                    $http({
                        method: 'GET',
                        url: "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + returnedArray[j].weathers[0].latitude + "," + returnedArray[j].weathers[0].longitude + "&sensor=true"
                    }).then(function (response) {
                        if (response.data.results !== undefined) {
                            let result = response.data.results[0];
                            for (let k = 0; k < result.address_components.length; k++) {
                                if (result.address_components[k].types.indexOf("locality") !== -1) {
                                    returnedArray[j].displayCity = result.address_components[k].long_name;
                                }
                                if (result.address_components[k].types.indexOf("administrative_area_level_1") !== -1) {
                                    returnedArray[j].displayState = result.address_components[k].long_name;
                                }
                            }
                        } else {
                            returnedArray[j].displayCity = "No address found";
                        }
                    });
                }

            }, function (response) {
                console.log("Failed");
            });
            return returnedArray;
        },

        getDirectionsData: function () {
            let directionArray = dataArray;
            for (let i = 0; i < directionArray.length; i++) {
                $http({
                    method: 'GET',
                    url: "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + directionArray[i].weathers[0].latitude + "," + directionArray[i].weathers[0].longitude + "&sensor=true"
                }).then(function (response) {
                    if (response.data.results !== undefined) {
                        let result = response.data.results[0];
                        for (let j = 0; j < result.address_components.length; j++) {
                            if (result.address_components[j].types.indexOf("locality") !== -1) {
                                directionArray[i].displayCity = result.address_components[j].long_name;
                            }
                            if (result.address_components[j].types.indexOf("administrative_area_level_1") !== -1) {
                                directionArray[i].displayState = result.address_components[j].long_name;
                            }
                        }
                    } else {
                        directionArray[i].displayCity = "No address found";
                    }
                });
            }
            for (let k = 0; k < directionArray.length; k++) {
                directionArray[k].displayTime = moment.unix(directionArray[k].epochTime).format('MMMM Do, h:mm a');
                // if maneuver is null, then make it straight
                if (directionArray[k].step.maneuver === null || directionArray[k].step.maneuver === "merge") {
                    directionArray[k].step.maneuver = "straight";
                }
                // split the array on each space in the string and return the last index of the array
                // let splitter = directionArray[k].step.maneuver;
                // directionArray[k].step.maneuver = splitter.split(" ", -1);
            }

            return directionArray;
        },
    };
});