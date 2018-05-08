angular
  .module("app", [])
  .controller("mainController", ($scope, getStarWars) => {
    $scope.allPeople = [];
    $scope.showActivePerson = false;
    $scope.activePerson = {};
    $scope.isThereMoreData = true;
    $scope.isOnFirstPage = true;
    $scope.activePage = 1;
    $scope.allPages = [];
    $scope.form = {};
    $scope.showEditForm = false;

    // this function gets people for the next page.
    $scope.lastFetchedPage = 1;
    $scope.getMorePeople = function(number) {
      $scope.allPages.push(number);
      return getStarWars
        .getPeople(number)
        .then(data => {
          // this block of code adds fetch results to data set
          angular.forEach(data.results, function(person) {
            $scope.allPeople.push(person);
          });
          $scope.lastFetchedPage += 1;

          // this block disables the "next" button.
          if (data.next === null) {
                $scope.isThereMoreData = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    };

    $scope.printToConsole = function() {
      console.log($scope);
    };

    $scope.showMoreDetails = function(index) {
        $scope.activePerson = $scope.allPeople[index];
        $scope.showActivePerson = true;
    };

    $scope.clearActive = function() {
        $scope.activePerson = {};
        $scope.showActivePerson = false;
        $scope.showEditForm = false;
    };

    $scope.setActivePage = function(number) {
      if (number === "Previous") {
        $scope.activePage = $scope.activePage - 1;
      } else if (number === "Next") {
        $scope.activePage = $scope.activePage + 1;
      } else {
        $scope.activePage = number;
      }
    };

    $scope.$watch("activePage", function(newVal, oldVal, scope) {
      const havePageData = scope.allPages.includes(newVal);
      // this block only fetches data if we don't already have it in scope
      // this minimizes API calls
      if (!havePageData) {
        scope.getMorePeople(scope.activePage);
      }

    // this block disables the "previous button".
      if (newVal === 1) {
          $scope.isOnFirstPage = true;
      } else {
          $scope.isOnFirstPage = false;
      }
    });

    $scope.filterThings = function(activePage) {
        return function (value, index, array) {
            const maxIndex = activePage * 10 - 1;
            const minIndex = (activePage - 1) * 10;

            if (index >= minIndex && index <= maxIndex) {
                return array[index]
            } else {
                return
            }
        }
    }

    $scope.toggleEditForm = function() {
        $scope.showEditForm = !$scope.showEditForm
    }

    $scope.processEditForm = function() {
        console.log($scope.form)
    }

    // this gets people the first time the page loads.
    $scope.getMorePeople(1);
  })
  .service("getStarWars", function($http) {
    this.getPeople = pageNumber => {
      const url = "https://swapi.co/api/people/?page=" + pageNumber;

      return $http({
        method: "GET",
        url: url
      })
        .then(data => {
          return data.data;
        })
        .catch(err => {
          console.log(err);
        });
    };
  })
