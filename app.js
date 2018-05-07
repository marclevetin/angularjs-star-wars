angular.module("app", [])
    .controller("mainController", ($scope, getStarWars) => {
        $scope.allPeople = [];
        $scope.activePerson = {};
        $scope.lastFetchedPage = 1;


        $scope.getMorePeople = function(number) {
            return getStarWars.getPeople(number)
                        .then(data => {
                            angular.forEach(data.results, function (person) {
                                $scope.allPeople.push(person);
                            });
                            $scope.lastFetchedPage += 1;
                        })
                        .catch((err) => { console.log(err) });
        }

        getStarWars.getPeople(1)
            .then(data => {
                $scope.allPeople = data.results;
                $scope.lastFetchedPage += 1;
            })
            .catch((err) => { console.log(err) });

        $scope.printToConsole = function() {
            console.log($scope)
        };

        $scope.showMoreDetails = function(index) {
            $scope.activePerson = $scope.allPeople[index];
        }

        $scope.clearActive = function() {
            $scope.activePerson = {};
        }
    })
    .service("getStarWars", function($http) {
        this.getPeople = (pageNumber) => {
            const url = 'https://swapi.co/api/people/?page=' + pageNumber;

            return $http({
                method: "GET",
                url: url
            }).then((data) => { return data.data })
            .catch((err) => {console.log(err)});
        }
    })
    