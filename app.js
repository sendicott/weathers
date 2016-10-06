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

app.controller("InputController", function($scope, WeatherService) {
    $scope.test = WeatherService.getTest();
    $scope.start = "";
    $scope.setInputValues = function(start) {

    };
});
// ------------Input Page------------

// ------------Summary Page------------
app.component("summary", {
    templateUrl: "components/summary.html",
    controller: "SummaryController",
});

app.controller("SummaryController", function($scope) {
    $scope.test = "Summary";
});
// ------------Summary Page------------

// ------------Directions Page------------
app.component("directions", {
    templateUrl: "components/directions.html",
    controller: "DirectionsController",
});

app.controller("DirectionsController", function($scope) {
    $scope.test = "Directions";
});
// ------------Directions Page------------

app.factory("WeatherService", function($http) {
    let input = {
        start: null,
        end: null,
        time: null,
    };

/**
 *     let testing = null;
 * 
 *      $http({
 *          method: 'GET',
 *          url:
 * "https://polar-meadow-84741.herokuapp.com/directions/
 * startLocation=charlotte,nc&endLocation=boston,ma"
 *      }).then(function(response) {
 *          angular.copy(response.data, testing);
 *          console.log(testing);
 *      }, function (response) {
 *      console.log("Failed");
 *      });
 * 
 *      let testDate = Date.now(); 
 *
 */

    return {
        getTest: function() {
            return testing;
        },

        setStart: function(firstInput) {
            input.start = firstInput;
        },

        setEnd: function(secondInput) {
            input.end = secondInput;
        },

        setTime: function(thirdInput) {
            input.time = thirdInput;
        },

        getInput: function() {
            return input;
        },
    };
});