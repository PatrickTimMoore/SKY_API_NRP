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
                 * findConstituentEx()
                 *
                 * STATUS: Complete!!!! Do not modify
                 *
                 * Finds a test sample for formatting
                 * Input:
                 * Output: data to http scope
                 */
                function findConstituentEx() {
                  // Grabs a random constituent
                  $http.get('/api/constituents/' + ($scope["constituentcodes0"].value[4999].constituent_id).toString()
                  ).then(
                    function (res) {
                      // Output data to Http
                      $scope.constituent = res.data;
                      $scope.isReady = true;
                    }
                  );
                }

                /*
                 * findConstituent(constituentId)
                 *
                 * STATUS: Complete!!!! Do not modify
                 *
                 * Finds and prints to console information for single constituent
                 * Input: var constituentId
                 * Output: data to http scope
                 */
                function findConstituent(constituentId) {
                  // Finds constituent given ID
                  $http.get('/api/constituents/' + constituentId.toString()
                  ).then(
                    function (res) {
                      // Output data to Http
                      $scope.constituent = res.data;
                      $scope.isReady = true;
                    }
                  );
                }

                /*
                 * aquireLists(offset)
                 *
                 * STATUS: Complete!!!! Do not modify
                 *
                 * Congregates a list of all constiuent IDs
                 * Input: var offset
                 * Output: List of IDs to scope.constituentcodes# (bulk of 5000)
                 *         Returns number of constituents
                 */
                function aquireLists(offset) {
                  $http.get('/api/constituentcodes/' + (offset*5000).toString()
                  ).then(
                    function (res) {
                      // Dynamically create variable names
                      var string = 'constituentcodes' + offset.toString();
                      $scope[string] = res.data;
                      $scope.isReady = true;
                      // Recursively aquire lists until empty
                      if($scope[string].count > ((offset+1)*5000)){
                        aquireLists((offset+1));
                        return;
                      }
                      // Outputs number of total constituent codes
                      return $scope['constituentcodes0'].count
                    }
                  );
                };

                /*
                 * changeName(constituentId, first)
                 *
                 * STATUS: Complete!!!! Do not modify
                 *
                 * Changes the first name of the given constituent
                 * Input: var constituentId
                 *        var first
                 * Output: change to http scope
                 */
                function changeName(constituentId, first) {
                  // Fetches name to print
                    $http.get('/api/constituents/firstname/pre/' + constituentId.toString()).then(
                      function () {
                        // Changes the first name of the same constituent
                        $http.patch('/api/constituents/firstname/' + constituentId.toString() + '-' + first
                        ).then(
                          function () {
                            // Fetches constituent again to confirm change
                            $http.get('/api/constituents/firstname/post/' + constituentId.toString()).then(
                              function (res) {
                                // data to http scope
                                $scope.constituent = res.data;
                                $scope.isReady = true;
                              }
                            );
                          }
                        );
                      }
                    );
                }

                /*
                 * updateMidInitial()
                 *
                 * STATUS: Complete!!!! Do not modify
                 *
                 * Reassigns middle initial out of first name
                 * Input: var string == 'constituentcodes0' (global)
                 *        var firstName (global)
                 *        var midInitial (global)
                 *        var count == # of iterations (global)
                 *        var countInit == count(global)
                 *        var constituentId (global)
                 *        var i == offset from start
                 *        var j (global)
                 * Output: All changes are logged in <date-time>.txt
                 */
                // Data passed through global variables
                function updateMidInitial() {
                  // Fix offset
                  while(i >= 5000){
                    count -= 5000;
                    i -= 5000;
                    ++j;
                    string = 'constituentcodes' + j.toString();
                  }
                  // GET constituent data
                  constituentId = $scope[string].value[i].constituent_id.toString();
                  $http.get('/api/constituents/name/pre/live/' + constituentId).then(
                    // Awaits GET to return a promise
                    function (res) {
                      // Checks for middle initial in promise
                      if(typeof res.data.first != "undefined" && res.data.first.includes(', ') && typeof res.data.middle === "undefined" && res.data.first[res.data.first.length - 3] == ',' && res.data.first[res.data.first.length - 2] == ' '){
                        // If there is a middle initial, partition the string
                        firstName = res.data.first.substring(0, res.data.first.length - 3);
                        midInitial = res.data.first[res.data.first.length - 1];
                        // Update first and middle name via PATCH
                        $http.patch('/api/constituents/name/live/' + constituentId + '-' + firstName + '-' + midInitial).then(
                          // Awaits PATCH to return a promise
                          function(){
                            // Calls GET from server to confirm change
                            $http.get('/api/constituents/name/post/live/' + constituentId).then(
                              // Awaits GET to return a promise
                              function() {
                                // Updates index for update recursive call
                                ++i;
                                if(i == 5000){
                                  count -= 5000;
                                  i = 0;
                                  ++j;
                                  string = 'constituentcodes' + j.toString();
                                }
                                if(i < count){
                                  // Iterate
                                  $scope.remaining = count - i;
                                  $scope.progress = (1 - ($scope.remaining / countInit)) * 100;
                                  updateMidInitial();
                                  return;
                                } else {
                                  // End condition
                                  $scope.remaining = 0;
                                  $scope.progress = 100;
                                  return;
                                }
                              }
                            );
                          }
                        );
                      } else {
                        // Updates index for update recursive call
                        ++i;
                        if(i == 5000){
                          count -= 5000;
                          i = 0;
                          ++j;
                          string = 'constituentcodes' + j.toString();
                        }
                        if(i < count){
                          // Iterate
                          $scope.remaining = count - i;
                          $scope.progress = (1 - ($scope.remaining / countInit)) * 100;
                          updateMidInitial();
                          return;
                        } else {
                          // End condition
                          $scope.remaining = 0;
                          $scope.progress = 100;
                          return;
                        }
                      }
                    }
                  );
                }

                /*
                 * updateTitleAndGender()
                 *
                 * STATUS: Complete!!!! Do not modify
                 *
                 * Note: use in combination with fn FIXTitleAndGender()
                 *
                 * Assigns gender and title from context
                 * Input: var string == 'constituentcodes0' (global)
                 *        var count == # of iterations (global)
                 *        var countInit == count(global)
                 *        var constituentId (global)
                 *        var i == offset from start (global)
                 *        var j (global)
                 *        var gender (global)
                 *        var guess == gender.npm (global)
                 * Output: All changes are logged in <date-time>.txt
                 */
                // Data passed through global variables
                function updateTitleAndGender() {
                  // Fix offset -> iterate through list depending on offset
                  while(i >= 5000){
                    count -= 5000;
                    i -= 5000;
                    ++j;
                    string = 'constituentcodes' + j.toString();
                  }
                  // GET constituent data
                  constituentId = $scope[string].value[i].constituent_id.toString();
                  $http.get('/api/constituents/TG/pre/live/' + constituentId).then( //WRITE FUNCTION HERE
                    // Awaits GET to return a promise
                    function (res) {
                      // Checks for missing title or gender on constituent
                      if(typeof res.data.first != "undefined" && (typeof res.data.title === "undefined" || (typeof res.data.gender === "undefined" || res.data.gender.toString() == 'Unknown'))){
                        $http.get('/api/guessGender/' + res.data.first.toString()).then(
                          function(gen){
                            // If there is a missing title or gender, partition the string
                            if(typeof res.data.gender != "undefined" && res.data.gender.toString() != 'Unknown'){
                              gender = res.data.gender.toString();
                              // Update missing title via PATCH
                              $http.patch('/api/constituents/title/live/' + constituentId + '-' + gender).then( //WRITE FUNCTION HERE
                                // Awaits PATCH to return a promise
                                function(){
                                  // Calls GET from server to confirm change
                                  $http.get('/api/constituents/TG/post/live/' + constituentId).then( //WRITE FUNCTION HERE
                                    // Awaits GET to return a promise
                                    function() {
                                      // Updates index for update recursive call
                                      ++i;
                                      if(i == 5000){
                                        count -= 5000;
                                        i = 0;
                                        ++j;
                                        string = 'constituentcodes' + j.toString();
                                      }
                                      if(i < count){
                                        // Iterate
                                        $scope.remaining = count - i;
                                        $scope.progress = (1 - ($scope.remaining / countInit)) * 100;
                                        updateTitleAndGender();
                                        return;
                                      } else {
                                        // End condition
                                        $scope.remaining = 0;
                                        $scope.progress = 100;
                                        return;
                                      }
                                    }
                                  );
                                }
                              );
                            } else if(typeof res.data.title != "undefined"){
                              // Checks for unique male titles
                              if(res.data.title.toString() == 'Mr.' || res.data.title.toString() == 'Rev.' || res.data.title.toString() == 'Fr.'){
                                gender = 'Male';
                              // Checks for unique female titles
                              } else if(res.data.title.toString() == 'Mrs.' || res.data.title.toString() == 'Miss.' || res.data.title.toString() == 'Ms.'){
                                gender = 'Female';
                              // Check for existing gender and last letter excetions
                              } else{
                                if(gen.data.gender.toString() == 'male'){
                                  gender = 'Male';
                                } else if(gen.data.gender.toString() == 'female'){
                                  gender = 'Female';
                                } else if(res.data.first[res.data.first.toString().length - 1] == 'a'){
                                  gender = 'Female';
                                } else if(res.data.first[res.data.first.toString().length - 1] == 'o'){
                                  gender = 'Male';
                                } else {
                                  // Updates index for update recursive call
                                  ++i;
                                  if(i == 5000){
                                    count -= 5000;
                                    i = 0;
                                    ++j;
                                    string = 'constituentcodes' + j.toString();
                                  }
                                  if(i < count){
                                    // Iterate
                                    $scope.remaining = count - i;
                                    $scope.progress = (1 - ($scope.remaining / countInit)) * 100;
                                    updateTitleAndGender();
                                    return;
                                  } else {
                                    // End condition
                                    $scope.remaining = 0;
                                    $scope.progress = 100;
                                    return;
                                  }
                                }
                              }
                              // Update missing title via PATCH
                              $http.patch('/api/constituents/gender/live/' + constituentId + '-' + gender).then( //WRITE FUNCTION HERE
                                // Awaits PATCH to return a promise
                                function(){
                                  // Calls GET from server to confirm change
                                  $http.get('/api/constituents/TG/post/live/' + constituentId).then( //WRITE FUNCTION HERE
                                    // Awaits GET to return a promise
                                    function() {
                                      // Updates index for update recursive call
                                      ++i;
                                      if(i == 5000){
                                        count -= 5000;
                                        i = 0;
                                        ++j;
                                        string = 'constituentcodes' + j.toString();
                                      }
                                      if(i < count){
                                        // Iterate
                                        $scope.remaining = count - i;
                                        $scope.progress = (1 - ($scope.remaining / countInit)) * 100;
                                        updateTitleAndGender();
                                        return;
                                      } else {
                                        // End condition
                                        $scope.remaining = 0;
                                        $scope.progress = 100;
                                        return;
                                      }
                                    }
                                  );
                                }
                              );
                            } else {
                              // Check for existing gender and last letter excetions
                              if(gen.data.gender.toString() == 'male'){
                                gender = 'Male';
                              } else if(gen.data.gender.toString() == 'female'){
                                gender = 'Female';
                              } else if(res.data.first[res.data.first.toString().length - 1] == 'a'){
                                gender = 'Female';
                              } else if(res.data.first[res.data.first.toString().length - 1] == 'o'){
                                gender = 'Male';
                              } else {
                                // Updates index for update recursive call
                                ++i;
                                if(i == 5000){
                                  count -= 5000;
                                  i = 0;
                                  ++j;
                                  string = 'constituentcodes' + j.toString();
                                }
                                if(i < count){
                                  // Iterate
                                  $scope.remaining = count - i;
                                  $scope.progress = (1 - ($scope.remaining / countInit)) * 100;
                                  updateTitleAndGender();
                                  return;
                                } else {
                                  // End condition
                                  $scope.remaining = 0;
                                  $scope.progress = 100;
                                  return;
                                }
                              }
                              // Update missing title via PATCH
                              $http.patch('/api/constituents/TG/live/' + constituentId + '-' + gender).then( //WRITE FUNCTION HERE
                                // Awaits PATCH to return a promise
                                function(){
                                  // Calls GET from server to confirm change
                                  $http.get('/api/constituents/TG/post/live/' + constituentId).then( //WRITE FUNCTION HERE
                                    // Awaits GET to return a promise
                                    function() {
                                      // Updates index for update recursive call
                                      ++i;
                                      if(i == 5000){
                                        count -= 5000;
                                        i = 0;
                                        ++j;
                                        string = 'constituentcodes' + j.toString();
                                      }
                                      if(i < count){
                                        // Iterate
                                        $scope.remaining = count - i;
                                        $scope.progress = (1 - ($scope.remaining / countInit)) * 100;
                                        updateTitleAndGender();
                                        return;
                                      } else {
                                        // End condition
                                        $scope.remaining = 0;
                                        $scope.progress = 100;
                                        return;
                                      }
                                    }
                                  );
                                }
                              );
                            }
                          }
                        );
                      } else {
                        // Updates index for update recursive call
                        ++i;
                        if(i == 5000){
                          count -= 5000;
                          i = 0;
                          ++j;
                          string = 'constituentcodes' + j.toString();
                        }
                        if(i < count){
                          // Iterate
                          $scope.remaining = count - i;
                          $scope.progress = (1 - ($scope.remaining / countInit)) * 100;
                          updateTitleAndGender();
                          return;
                        } else {
                          // End condition
                          $scope.remaining = 0;
                          $scope.progress = 100;
                          return;
                        }
                      }
                    }
                  );
                }

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
                 * updatePhone()
                 *
                 * STATUS: IP
                 *
                 * Updates Phone from use
                 * Input: var i (global)
                 *        var j (global)
                 *        var listId (global)
                 * Output: All changes are logged in <date-time>.txt
                 */

                function updatePhone(){
                  $http.get('/api/constituents/phone/pre/' + listId[i].toString()).then(
                    function(){
                      ++i;
                      if(i < listId.length){
                        updatePhone();
                      }
                    }
                  )
                }


                /**
                  *  Testing Zone
                  */
                /*$http.get('/api/constituentrelationships/7501'
                ).then(
                  function (res) {
                    $scope.constituent2 = res.data;
                    $scope.isReady = true;
                  }
                );*/


                /**
                  *  Meta-function calls
                  */
                //aquireLists(0);
                //changeName(4906, 'Brian');
                //findConstituent(8);
                /* For the titles real app */

                /*
                 * THE FOLLOWING IS FOR updateMidInitial()
                 *//*
                aquireLists(0);
                setTimeout(function(){
                  console.log($scope['constituentcodes0'].count);
                  count = $scope['constituentcodes0'].count;
                  countInit = count;
                  i = 0; // replace with (count - crash#);
                  j = 0;
                  string = 'constituentcodes' + j.toString();
                  setTimeout(function(){
                    updateMidInitial();
                  }, 350);
                }, 10000);*/

                /*
                 * THE FOLLOWING IS FOR updateTitleAndGender()
                 *//*
                aquireLists(0);
                setTimeout(function(){
                  console.log($scope['constituentcodes0'].count);
                  count = $scope['constituentcodes0'].count;
                  countInit = count;
                  i = (count - 1000); // replace with (count - crash#);
                  j = 0;
                  string = 'constituentcodes' + j.toString();
                  setTimeout(function(){
                    updateTitleAndGender();
                  }, 350);
                }, 10000);*/

                /*
                 * THE FOLLOWING IS FOR FIXTitleAndGender()
                 *//*
                $http.get('/api/csv/' + fileName).then(
                  function(res){
                    listId = res.data;
                    i = 0; // Modify with offset on failure
                    if(i < listId.length){
                      FIXTitleAndGender();
                    }
                  }
                );*/

                /*
                 * THE FOLLOWING IS FOR updatePhone()
                 */
                $http.get('/api/csv/' + fileName).then(
                  function(res){
                    listId = res.data;
                    i = 0; // Modify with offset on failure
                    if(i < listId.length){
                      updatePhone();
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
