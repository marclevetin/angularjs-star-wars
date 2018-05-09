angular
  .module("app", [])
  .controller("mainController", ($scope, getStarWars) => {
    $scope.allPeople = []; // collection of the people from the API.
    $scope.showActivePerson = false; // turns on the details page.
    $scope.activePerson = {}; // this is the active person.  The view iterates over the object to show the details.
    $scope.isThereMoreData = true; // controls whether the Next button is enabled.
    $scope.isOnFirstPage = true; // controls whether the Previous button is enabled.
    $scope.activePage = 1; // controls which page has the "active" class in the Pagination control.
    $scope.allPages = []; // shows all of the pages for which we have data.  Appears in the Pagination control.
    $scope.showEditForm = false; // controls if the Details view is in the View state or the Edit state.
    $scope.showEditFormButtonText = "Edit" // Edit or Cancel button on the Details view.
    $scope.showLoadingSpinner = true; // controls if the Loading row appears in the table.
    $scope.formData = {}; // collects the form data.
    $scope.lastFetchedPage = 1; // this function gets people for the next page.
    
    // function that gets data for the next page.
    $scope.getMorePeople = function(number) {
      $scope.showLoadingSpinner = true;
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

          // hides the Loading row.
          $scope.showLoadingSpinner = false;
        })
        .catch(err => {
          console.log(err);
        });
    };

    // utility function is for a debugger tool to see what's in scope.
    $scope.printToConsole = function() {
      console.log($scope);
    };

    // this function opens the detail page
    $scope.showMoreDetails = function(currentPageindex) {
      const index = (($scope.activePage - 1) * 10) + currentPageindex; // ensures that the proper character's details are shown
      $scope.activePerson = $scope.allPeople[index]; 
      $scope.showActivePerson = true; 
      $scope.formData['name'] = $scope.allPeople[index]['name'];
      $scope.showEditForm = false;
    };

    // closes the Detail page
    $scope.clearActive = function() {
      $scope.activePerson = {};
      $scope.showActivePerson = false;
      $scope.showEditForm = false;
    };

    // Pagination control.  Controls which page number has the "Active" class
    $scope.setActivePage = function(number) {
      if (number === "Previous") {
        $scope.activePage = $scope.activePage - 1;
      } else if (number === "Next") {
        $scope.activePage = $scope.activePage + 1;
      } else {
        $scope.activePage = number;
      }
    };

    // watcher to determine if we should ping the API for more data
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

    // custom filter to show only the people that'd appear on that page.
    $scope.filterThings = function(activePage) {
      return function(value, index, array) {
        const maxIndex = activePage * 10 - 1;
        const minIndex = (activePage - 1) * 10;

        if (index >= minIndex && index <= maxIndex) {
          return array[index];
        } else {
          return;
        }
      };
    };


    $scope.toggleEditForm = function() {
      $scope.showEditForm = !$scope.showEditForm;
      $scope.showEditFormButtonText = (!$scope.showEditForm) ? "Edit" : "Cancel";
    };

    $scope.processEditForm = function(event) {
        // In case it needs to be said, this method only changes data in $scope.  It does not post back to the API.
        const objectToChange = $scope.allPeople.filter( object => object.name === $scope.formData.name )[0];
      angular.forEach($scope.formData, function(value, key) {
          debugger;
          objectToChange[key] = value;
      });
    };

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
  });
