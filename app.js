angular.module("app", [])
    .controller("mainController", ($scope, getStarWars) => {
        $scope.allPeople = [];
        $scope.allPeopleCount = 0;
        $scope.activePerson = {};
        $scope.isThereMoreData = true;
        
        // this function gets people for the next page.
        $scope.lastFetchedPage = 1;
        $scope.getMorePeople = function(number) {
            return getStarWars.getPeople(number)
                        .then(data => {
                            // this block of code adds fetch results to data set
                            angular.forEach(data.results, function (person) {
                                $scope.allPeople.push(person);
                            });
                            $scope.lastFetchedPage += 1;

                            // this block disables the "next" button.
                            if (data.next === null) {
                                $scope.isThereMoreData = false;
                            } 

                        })
                        .catch((err) => { console.log(err) });
        }

        $scope.printToConsole = function() {
            console.log($scope)
        };

        $scope.showMoreDetails = function(index) {
            $scope.activePerson = $scope.allPeople[index];
        }

        $scope.clearActive = function() {
            $scope.activePerson = {};
        }

        // this gets people the first time the page loads.
        $scope.getMorePeople(1);
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
    