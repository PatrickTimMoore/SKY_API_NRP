(function (angular) {
    'use strict';

    angular.module('AuthCodeFlowTutorial', ['ngRoute'])
        .config(function ($routeProvider) {

            /**
             *  Defines our app's routes.
             *  For this example we will only be using two: a `#/home`
             *  and a `#/auth-success` route. We define which controllers and
             *  templates each route will use.
             */
            $routeProvider
                .when('/home', {
                    templateUrl: './app/main-template.html',
                    controller: 'AppController'
                })
                .when('/auth-success', {
                    template: '<h1>Login Successful</h1>',
                    controller: 'AuthController'
                })
                .otherwise({
                    redirectTo: '/home'
                });
        })

        /**
         * This controller is for handling our post-success authentication.
         */
        .controller('AuthController', function ($window) {

            /**
             * When we arrive at this view, the popup window is closed, and we redirect the main
             * window to our desired route; in this case, '/'.
             *   - This is also a great place for doing any post-login logic you want to implement
             *     before we redirect.
             */
            $window.opener.location = '/';
            $window.close();
        })

        /**
         * General controller for handling the majority of our routes.  As our app grows, we would use more
         * controllers for each route.
         */
        .controller('AppController', function ($scope, $http, $window) {

            /**
             *  Checks the user access token.
             */
            $http.get('/auth/authenticated').then(function (res) {
                $scope.isAuthenticated = res.data.authenticated;
                if ($scope.isAuthenticated === false) {
                    $scope.isReady = true;
                    return;
                }


                /**
                  *  Access token is valid. Begin data code.
                  */

                /**
                  *  Global Variables, DO NOT DELETE
                  */
                  var count;
                  var countInit;
                  var string;
                  var i = 0;
                  var j = 0;
                  var firstName;
                  var midInitial;
                  var gender;
                  var constituentId;
                  var listId;
                  var countInit;
                  var fileName = 'genderTitleChangelog'; //SET CSV FILENAME HERE

                /**
                  *  Finished meta-functions
                  */

                /*
                 * FIXTitleAndGender()
                 *
                 * STATUS: Complete!!!! Do not modify
                 *
                 * Assigns gender and title from context
                 * Input: var i (global)
                 *        var j (global)
                 *        var listId (global)
                 * Output: All changes are logged in <date-time>.txt
                 */
                // Data passed through global variables
                function FIXTitleAndGender() {
                  // Establishes a recursive sub-function
                  function recursiveFIXTitleAndGender(fam){
                    if(j == fam.data.count){
                      // Recursive iteration and stat output
                      ++i;
                      $scope.remaining = listId.length - i;
                      $scope.progress = (1 - ($scope.remaining / listId.length)) * 100;
                      if(i < listId.length){
                        // Recursive call
                        FIXTitleAndGender();
                      } else {
                        // End statistics
                        $scope.remaining = 0;
                        $scope.progress = 100;
                      }
                      // Terminate call
                      return;
                    // Checks if the constituent has any relationships with the "spouse" tag
                    } else if(fam.data.value[j].is_spouse == true || fam.data.value[j].reciprocal_type == 'Spouse' || fam.data.value[j].type == 'Spouse'){
                      // Swaps title from Ms. to Mrs. via PATCH
                      $http.patch('/api/constituents/titleSwap/' + listId[i].toString()).then(
                        function(){
                          // Confirms change via GET
                          $http.get('/api/constituents/TG/post/live/' + listId[i].toString()).then(
                            function(){
                              // Terminates recursion
                              return;
                            }
                          );
                        }
                      );
                    } else {
                      // Iterates recursive helper function
                      ++j;
                      recursiveFIXTitleAndGender(fam);
                      return;
                    }
                  }
                  // Aquire and print Name and Title in question
                  $http.get('/api/titleSwap/pre/live/' + listId[i].toString()).then(
                    function(res){
                      // Checks if the title is "Ms."
                      if(typeof res.data.title != "undefined"){
                        if(res.data.title.toString() == "Ms."){
                          // Aquire a list of the constituent relationships
                          $http.get('/api/constituentrelationships/' + listId[i].toString()).then(
                            function(fam){
                              // Sets up and calls recursive spouse search
                              j = 0;
                              recursiveFIXTitleAndGender(fam);
                              setTimeout(function(){
                                // Recursive iteration and stat output
                                ++i;
                                $scope.remaining = listId.length - i;
                                $scope.progress = (1 - ($scope.remaining / listId.length)) * 100;
                                if(i < listId.length){
                                  // Recursive call
                                  FIXTitleAndGender();
                                } else {
                                  // End statistics
                                  $scope.remaining = 0;
                                  $scope.progress = 100;
                                }
                                // Terminate recusion
                                return;
                              }, 5000);
                            }
                          );
                        } else {
                          // Recursive iteration and stat output
                          ++i;
                          $scope.remaining = listId.length - i;
                          $scope.progress = (1 - ($scope.remaining / listId.length)) * 100;
                          if(i < listId.length){
                            // Recursive call
                            FIXTitleAndGender();
                          } else {
                            // End statistics
                            $scope.remaining = 0;
                            $scope.progress = 100;
                          }
                          // Terminate recusion
                          return;
                        }
                      } else {
                        // Recursive iteration and stat output
                        ++i;
                        $scope.remaining = listId.length - i;
                        $scope.progress = (1 - ($scope.remaining / listId.length)) * 100;
                        if(i < listId.length){
                          // Recursive call
                          FIXTitleAndGender();
                        } else {
                          // End statistics
                          $scope.remaining = 0;
                          $scope.progress = 100;
                        }
                        // Terminate recusion
                        return;
                      }
                    }
                  );
                }

                /*
                 * THE FOLLOWING IS FOR FIXTitleAndGender()
                 */
                $http.get('/api/csv/' + fileName).then(
                  function(res){
                    listId = res.data;
                    i = 0; // Modify with offset on failure
                    if(i < listId.length){
                      FIXTitleAndGender();
                    }
                  }
                );
            });



            /**
             * Opens a new popup window and redirects it to our login route.
             * After a successful login within the popup, the popup is redirected to the `#/auth-success`
             * route, which closes the popup window and returns focus to the parent window.
             */
            $scope.popupLogin = function () {
                var popup;

                popup = $window.open('auth/login?redirect=/%23/auth-success', 'login', 'height=450,width=600');

                if ($window.focus) {
                    popup.focus();
                }
            };
        });
})(window.angular);
