angular.module("app", [])
    .controller("mainController", ($scope, getStarWars) => {
        const vm = this;
        $scope.test = 'why wont this show up?';
        $scope.test2 = "why wont this show up?";
        $scope.people = [];
        $scope.nextPage = "";
        $scope.previousPage = "";
        $scope.active = {}

        getStarWars.getPeople(1)
            .then(data => {
                $scope.people = data.results;
                $scope.nextPage = data.next;
                $scope.previousPage = data.previous;
                
            })
            .catch((err) => { console.log(err) });

        $scope.printToConsole = function() {
            console.log($scope)
        };

        $scope.showMoreDetails = function(index) {
            $scope.active = $scope.people[index]
        }

        $scope.clearActive = function() {
            $scope.active = {};
        }
    })
    .service("getStarWars", function($http) {
        this.getPeople = (pageNumber) => {
            return $http({
                method: "GET",
                url: `https://swapi.co/api/people/?page=${pageNumber}`,
                cache: true,
            }).then((data) => {return data.data})
            .catch((err) => {console.log(err)});
        }
    })
    