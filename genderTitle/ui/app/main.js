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
                 * THE FOLLOWING IS FOR updateTitleAndGender()
                 */
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
                }, 10000);
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
