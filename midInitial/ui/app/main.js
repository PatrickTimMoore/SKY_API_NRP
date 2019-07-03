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
                 * THE FOLLOWING IS FOR updateMidInitial()
                 */
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
