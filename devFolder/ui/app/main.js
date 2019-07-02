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
                function findConstituentEx() {
                  $http.get('/api/constituents/' + ($scope["constituentcodes0"].value[4999].constituent_id).toString()
                  ).then(
                    function (res) {
                      $scope.constituent = res.data;
                      $scope.isReady = true;
                    }
                  );
                }
                function findConstituent(constituentId) {
                  $http.get('/api/constituents/' + constituentId.toString()
                  ).then(
                    function (res) {
                      $scope.constituent = res.data;
                      $scope.isReady = true;
                    }
                  );
                }
                function aquireLists(offset) {
                  $http.get('/api/constituentcodes/' + (offset*5000).toString()
                  ).then(
                    function (res) {
                      var string = 'constituentcodes' + offset.toString();
                      $scope[string] = res.data;
                      $scope.isReady = true;
                      if($scope[string].count > ((offset+1)*5000)){
                        aquireLists((offset+1));
                        return;
                      }
                      return $scope['constituentcodes0'].count
                    }
                  );
                };
                function changeName(constituentId, first) {
                    $http.get('/api/constituents/firstname/pre/' + constituentId.toString()).then(
                      function () {
                        $http.patch('/api/constituents/firstname/' + constituentId.toString() + '-' + first
                        ).then(
                          function () {
                            $http.get('/api/constituents/firstname/post/' + constituentId.toString()).then(
                              function (res) {
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
                  // Fix offset
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
                                        $scope.remaining = 0;
                                        $scope.progress = 100;
                                        return;
                                      }
                                    }
                                  );
                                }
                              );
                            } else if(typeof res.data.title != "undefined"){
                              if(res.data.title.toString() == 'Mr.' || res.data.title.toString() == 'Rev.' || res.data.title.toString() == 'Fr.'){
                                gender = 'Male';
                              } else if(res.data.title.toString() == 'Mrs.' || res.data.title.toString() == 'Miss.' || res.data.title.toString() == 'Ms.'){
                                gender = 'Female';
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
                                        $scope.remaining = 0;
                                        $scope.progress = 100;
                                        return;
                                      }
                                    }
                                  );
                                }
                              );
                            } else {
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
                  function recursiveFIXTitleAndGender(fam){
                    if(j == fam.data.count){
                      // recurse
                      ++i;
                      $scope.remaining = listId.length - i;
                      $scope.progress = (1 - ($scope.remaining / listId.length)) * 100;
                      if(i < listId.length){
                        FIXTitleAndGender();
                      } else {
                        $scope.remaining = 0;
                        $scope.progress = 100;
                      }
                      return;
                    } else if(fam.data.value[j].is_spouse == true || fam.data.value[j].reciprocal_type == 'Spouse' || fam.data.value[j].type == 'Spouse'){
                      $http.patch('/api/constituents/titleSwap/' + listId[i].toString()).then(
                        function(){
                          $http.get('/api/constituents/TG/post/live/' + listId[i].toString()).then(
                            function(){
                              return;
                            }
                          );
                        }
                      );
                    } else {
                      ++j;
                      recursiveFIXTitleAndGender(fam);
                      return;
                    }
                  }
                  $http.get('/api/titleSwap/pre/live/' + listId[i].toString()).then(
                    function(res){
                      if(typeof res.data.title != "undefined"){
                        if(res.data.title.toString() == "Ms."){
                          $http.get('/api/constituentrelationships/' + listId[i].toString()).then(
                            function(fam){
                              j = 0;
                              recursiveFIXTitleAndGender(fam);
                              setTimeout(function(){
                                // recurse
                                ++i;
                                $scope.remaining = listId.length - i;
                                $scope.progress = (1 - ($scope.remaining / listId.length)) * 100;
                                if(i < listId.length){
                                  FIXTitleAndGender();
                                } else {
                                  $scope.remaining = 0;
                                  $scope.progress = 100;
                                }
                                return;
                              }, 5000);
                            }
                          );
                        } else {
                          // recurse
                          ++i;
                          $scope.remaining = listId.length - i;
                          $scope.progress = (1 - ($scope.remaining / listId.length)) * 100;
                          if(i < listId.length){
                            FIXTitleAndGender();
                          } else {
                            $scope.remaining = 0;
                            $scope.progress = 100;
                          }
                          return;
                        }
                      } else {
                        // recurse
                        ++i;
                        $scope.remaining = listId.length - i;
                        $scope.progress = (1 - ($scope.remaining / listId.length)) * 100;
                        if(i < listId.length){
                          FIXTitleAndGender();
                        } else {
                          $scope.remaining = 0;
                          $scope.progress = 100;
                        }
                        return;
                      }
                    }
                  );
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
                /*setTimeout(function(){
                  console.log($scope['constituentcodes0'].count);
                  count = $scope['constituentcodes0'].count;
                  countInit = count;
                  i = (count - 1000); // replace with (count - crash#);
                  j = 0;
                  string = 'constituentcodes' + j.toString();
                  setTimeout(function(){
                    FIXTitleAndGender();
                  }, 350);
                }, 10000);*/
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
