/*jshint node: true */

(function () {
    'use strict';

    var Sky;
    var fs = require('fs');
    var guess = require('gender');
    var currDate = new Date();
    var dateString = (currDate.toLocaleDateString() + "-" + currDate.getHours().toString() + "-" + currDate.getMinutes().toString() + ".txt").replace(/\//g, "-");
    Sky = require('../libs/sky');
    /**
     * Gets a specific constituent by constituentId
     * @name getConstituent
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @returns {string}
     */
    function getConstituent(request, response) {
        Sky.getConstituent(request, request.params.constituentId, function (results) {
            fs.appendFile(dateString, (JSON.stringify(results, null, '\t') + '\n'), (err) => {
              if (err) console.log(err);
              console.log("Get Successfully Written to File.");
            });
            response.send(results);
        });
    }
    /**
     * Gets a list of constituent IDs
     * @name getConstituentCodes
     * @param {Object} request
     * @param {Object} response
     * @param {int} request.params.offset
     * @returns {array[int]}
     */
    function getConstituentCodes(request, response) {
        Sky.getConstituentCodes(request, request.params.offset, function (results) {
            response.send(results);
        });
    }
    /**
     * Gets a list of constituent relations by ID
     * @name getConstituentRelationships
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @returns {string}
     */
    function getConstituentRelationships(request, response) {
        Sky.getConstituentRelationships(request, request.params.constituentId, function (results) {
            /*fs.appendFile(dateString, (JSON.stringify(results, null, '\t') + '\n'), (err) => {
              if (err) console.log(err);
              console.log("Get Successfully Written to File.");
            });*/
            response.send(results);
        });
    }
    /**
     * Gets constituent first name by ID
     * @name getConstituentFirstName
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @returns {string}
     */
    function getConstituentFirstName(request, response) {
        Sky.getConstituent(request, request.params.constituentId, function (results) {
            fs.appendFile(dateString, (JSON.stringify(results, null, '\t') + '\n'), (err) => {
              if (err) console.log(err);
              console.log("Get Successfully Written to File.");
            });
            response.send(results);
        });
    }
    /**
     * Gets constituent first name by ID and prints to file
     * @name getConstituentNamePre
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @returns {string}
     */
    function getConstituentNamePre(request, response) {
        Sky.getConstituent(request, request.params.constituentId, function (results) {
          if(typeof results.first != "undefined"){
            if(results.first.toString().includes(', ') && typeof results.middle === "undefined" && results.first.toString()[results.first.toString().length - 3] == ',' && results.first.toString()[results.first.toString().length - 2] == ' '){
              fs.appendFile(dateString, (results.id.toString() + ':\n\t{ "first": ' + JSON.stringify(results.first, null, '\t') + ', "middle": ' + JSON.stringify(results.middle, null, '\t') + ' }'), (err) => {
                if (err) console.log(err);
                console.log("Get Successfully Written to File.");
              });
            }
          }
          response.send(results);
        });
    }
    /**
     * Gets constituent first name by ID and prints to file
     * @name getConstituentNamePost
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @returns {string}
     */
    function getConstituentNamePost(request, response) {
        Sky.getConstituent(request, request.params.constituentId, function (results) {
            fs.appendFile(dateString, ('{ "first": ' + JSON.stringify(results.first, null, '\t') + ', "middle": ' + JSON.stringify(results.middle, null, '\t') + ' }\n'), (err) => {
              if (err) console.log(err);
              console.log("Get Successfully Written to File.");
            });
            response.send(results);
          }
        );
    }
    /**
     * Gets constituent first name by ID and prints to file
     * @name patchConstituentFirstNamePre
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @returns {string}
     */
    function patchConstituentFirstNamePre(request, response) {
        Sky.getConstituent(request, request.params.constituentId, function (results) {
            fs.appendFile(dateString, (results.id.toString() + ':\n\t{ "first": ' + JSON.stringify(results.first, null, '\t') + ' }'), (err) => {
              if (err) console.log(err);
              console.log("Get Successfully Written to File.");
            });
            response.send(results);
          }
        );
    }
    /**
     * Gets constituent first name by ID and prints to file
     * @name patchConstituentFirstNamePost
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @returns {string}
     */
    function patchConstituentFirstNamePost(request, response) {
        Sky.getConstituent(request, request.params.constituentId, function (results) {
            fs.appendFile(dateString, ('{ "first": ' + JSON.stringify(results.first, null, '\t') + ' }\n'), (err) => {
              if (err) console.log(err);
              console.log("Get Successfully Written to File.");
            });
            response.send(results);
          }
        );
    }
    /**
     * Patches constituent first name by ID and prints to file
     * @name patchConstituentFirstName
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @param {string} request.params.firstName
     * @returns {string}
     */
    function patchConstituentFirstName(request, response) {
        Sky.patchConstituentFirstName(request, request.params.constituentId, { "first": request.params.firstName }, function (results) {
          fs.appendFile(dateString, " => ", (err) => {
            if (err) console.log(err);
            console.log("Patch Successfully Written to File.");
          });
          response.send(results);
        });
    }
    /**
     * Patches constituent first and middle by ID and prints to file
     * @name patchConstituentName
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @param {string} request.params.firstName
     * @param {string} request.params.midInitial
     * @returns {string}
     */
    function patchConstituentName(request, response) {
        Sky.patchConstituentFirstName(request, request.params.constituentId, { "first": request.params.firstName, "middle": request.params.midInitial }, function (results) {
          fs.appendFile(dateString, " => ", (err) => {
            if (err) console.log(err);
            console.log("Patch Successfully Written to File.");
          });
          response.send(results);
        });
    }
    /**
     * Gets constituent title by ID
     * @name getConstituentTitlePreTest
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @returns {string}
     */
    function getConstituentTitlePreTest(request, response) {
        Sky.getConstituent(request, request.params.constituentId, function (results) {
            response.send(results);
          }
        );
    }
    /**
     * Gets constituent title by ID and prints to file
     * @name getConstituentTitlePostTest
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @returns {string}
     */
    function getConstituentTitlePostTest(request, response) {
        Sky.getConstituent(request, request.params.constituentId, function (results) {
            fs.appendFile(dateString, (results.id.toString() + ':\n\t{ "first": ' + JSON.stringify(results.first, null, '\t') + ' } + { "title": ' + 'TBD' + ' }\n'), (err) => {
              if (err) console.log(err);
            });
            response.send(results);
          }
        );
    }
    /**
     * Symbolizes a patched constituent title by ID and prints to file
     * @name patchConstituentTitleTest
     * @param {Object} request
     * @param {Object} response
     * @returns {string}
     */
    function patchConstituentTitleTest(request, response) {
          fs.appendFile(dateString, " + ", (err) => {
            if (err) console.log(err);
            console.log("Patch Test Successfully Written to File.");
          });
          response.send();
    }
    /**
     * Gets constituent title by ID and prints to file
     * @name getConstituentTitlePreLive
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @returns {string}
     */
    function getConstituentTitlePreLive(request, response) {
        Sky.getConstituent(request, request.params.constituentId, function (results) {
            if(typeof results.title === "undefined"){
              fs.appendFile(dateString, (results.id.toString() + ':\n\t{ "first": ' + JSON.stringify(results.first, null, '\t') + ' }'), (err) => {
                if (err) console.log(err);
              });
            }
            response.send(results);
          }
        );
    }
    /**
     * Gets constituent title by ID and prints to file
     * @name getConstituentTitlePostLive
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @returns {string}
     */
    function getConstituentTitlePostLive(request, response) {
        Sky.getConstituent(request, request.params.constituentId, function (results) {
            fs.appendFile(dateString, (' + { "title": ' + 'TBD' + ' }\n'), (err) => {
              if (err) console.log(err);
            });
            response.send(results);
          }
        );
    }
    /**
     * Symbolically patches constituent title by ID and prints to file
     * @name patchConstituentTitleLive
     * @param {Object} request
     * @param {Object} response
     * @returns {string}
     */
    function patchConstituentTitleLive(request, response) {
          fs.appendFile(dateString, ' + ', (err) => {
            if (err) console.log(err);
            console.log("Patch Test Successfully Written to File.");
          });
          response.send();
    }
    /**
     * Uses the USA Census to assume gender
     * @name guessGender
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.firstName
     * @returns {JSON object}
     */
    function guessGender(request, response) {
          console.log("Gender: assumed.");
          response.send(guess.guess(request.params.firstName));
    }
    /**
     * Translates the first collumn of a CSV file to an array
     * @name getCSVid
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.fileName
     * @returns {array[string]}
     */
    function getCSVid(request, response) {
        console.log(request.params.fileName);
          fs.readFile(request.params.fileName + '.csv', (err, fd) => {
            if (err) console.log(err);
            var array = fd.toString().split("\n");
            var arrayNew = [];
            var tempArray = [];
            var i;
            for(i in array){
              if(i != 0){
                tempArray = array[i].split(',');
                arrayNew[i - 1] = tempArray[0];
              }
            }
            console.log("IDs: obtained.");
            response.send(arrayNew);
          });
    }
    /**
     * Gets constituent title/gender by ID and prints to file
     * @name getTGPre
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @returns {string}
     */
    function getTGPre(request, response) {
        Sky.getConstituent(request, request.params.constituentId, function (results) {
          if(typeof results.first != "undefined" && (typeof results.title === "undefined" || (typeof results.gender === "undefined" || results.gender == 'Unknown'))){
              fs.appendFile(dateString, ('\n' + results.id.toString() + ':\n\t{ "first": ' + JSON.stringify(results.first, null, '\t') + ', "title": ' + JSON.stringify(results.title, null, '\t') + ', "gender": ' + JSON.stringify(results.gender, null, '\t') + ' }'), (err) => {
                if (err) console.log(err);
                console.log("Get Successfully Written to File.");
              });
          }
          response.send(results);
        });
    }
    /**
     * Gets constituent title/gender by ID and prints to file
     * @name getTGPost
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @returns {string}
     */
    function getTGPost(request, response) {
        Sky.getConstituent(request, request.params.constituentId, function (results) {
            fs.appendFile(dateString, ('{ "first": ' + JSON.stringify(results.first, null, '\t') + ', "title": ' + JSON.stringify(results.title, null, '\t') + ', "gender": ' + JSON.stringify(results.gender, null, '\t') + ' }'), (err) => {
              if (err) console.log(err);
              console.log("Get Successfully Written to File.");
            });
            response.send(results);
          }
        );
    }
    /**
     * Patches constituent title/gender by ID and prints to file
     * @name patchTG
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @param {string} request.params.gender
     * @returns {string}
     */
    function patchTG(request, response) {
      if(request.params.gender == 'Male'){
        Sky.patchConstituentFirstName(request, request.params.constituentId, { "gender": request.params.gender, "title": 'Mr.' }, function (results) {
          fs.appendFile(dateString, ' => ', (err) => {
            if (err) console.log(err);
            console.log("Patch Successfully Written to File.");
          });
          response.send(results);
        });
      } else if(request.params.gender == 'Female') {
        Sky.patchConstituentFirstName(request, request.params.constituentId, { "gender": request.params.gender, "title": 'Ms.' }, function (results) {
          fs.appendFile(dateString, ' => ', (err) => {
            if (err) console.log(err);
            console.log("Patch Successfully Written to File.");
          });
          response.send(results);
        });
      }
    }
    /**
     * Patches constituent title by ID and prints to file
     * @name patchTitle
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @param {string} request.params.gender
     * @returns {string}
     */
    function patchTitle(request, response) {
      if(request.params.gender == 'Male'){
        Sky.patchConstituentFirstName(request, request.params.constituentId, { "title": 'Mr.' }, function (results) {
          fs.appendFile(dateString, ' => ', (err) => {
            if (err) console.log(err);
            console.log("Patch Successfully Written to File.");
          });
          response.send(results);
        });
      } else if(request.params.gender == 'Female') {
        Sky.patchConstituentFirstName(request, request.params.constituentId, { "title": 'Ms.' }, function (results) {
          fs.appendFile(dateString, ' => ', (err) => {
            if (err) console.log(err);
            console.log("Patch Successfully Written to File.");
          });
          response.send(results);
        });
      }
    }
    /**
     * Patches constituent gender by ID and prints to file
     * @name patchGender
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @param {string} request.params.gender
     * @returns {string}
     */
    function patchGender(request, response) {
        Sky.patchConstituentFirstName(request, request.params.constituentId, { "gender": request.params.gender }, function (results) {
          fs.appendFile(dateString, ' => ', (err) => {
            if (err) console.log(err);
            console.log("Patch Successfully Written to File.");
          });
          response.send(results);
        });
    }
    /**
     * Patches constituent title by ID and prints to file
     * @name titleSwap
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @returns {string}
     */
    function titleSwap(request, response) {
        Sky.patchConstituentFirstName(request, request.params.constituentId, { "title": 'Mrs.' }, function (results) {
          fs.appendFile(dateString, ' => ', (err) => {
            if (err) console.log(err);
            console.log("Patch Successfully Written to File.");
          });
          response.send(results);
        });
    }
    /**
     * Gets constituent title by ID and prints to file
     * @name preTitleSwap
     * @param {Object} request
     * @param {Object} response
     * @param {string} request.params.constituentId
     * @returns {string}
     */
    function preTitleSwap(request, response) {
        Sky.getConstituent(request, request.params.constituentId, function (results) {
          if(typeof results.title != "undefined" && results.title == 'Ms.'){
              fs.appendFile(dateString, ('\n' + results.id.toString() + ':\n\t{ "first": ' + JSON.stringify(results.first, null, '\t') + ', "title": ' + JSON.stringify(results.title, null, '\t') + ', "gender": ' + JSON.stringify(results.gender, null, '\t') + ' }'), (err) => {
                if (err) console.log(err);
                console.log("Get Successfully Written to File.");
              });
          }
          response.send(results);
        });
    }
    /* exports functions to global variables */
    module.exports = {
        getConstituent: getConstituent,
        getConstituentCodes: getConstituentCodes,
        getConstituentRelationships: getConstituentRelationships,
        getConstituentFirstName: getConstituentFirstName,
        patchConstituentFirstName: patchConstituentFirstName,
        patchConstituentFirstNamePre: patchConstituentFirstNamePre,
        patchConstituentFirstNamePost: patchConstituentFirstNamePost,
        getConstituentTitlePreTest: getConstituentTitlePreTest,
        patchConstituentTitleTest: patchConstituentTitleTest,
        getConstituentTitlePostTest: getConstituentTitlePostTest,
        getConstituentTitlePreLive: getConstituentTitlePreLive,
        patchConstituentTitleLive: patchConstituentTitleLive,
        getConstituentTitlePostLive: getConstituentTitlePostLive,
        getConstituentNamePre: getConstituentNamePre,
        getConstituentNamePost: getConstituentNamePost,
        patchConstituentName: patchConstituentName,
        guessGender: guessGender,
        getTGPre: getTGPre,
        getTGPost: getTGPost,
        patchTG: patchTG,
        patchTitle: patchTitle,
        patchGender: patchGender,
        getCSVid: getCSVid,
        titleSwap: titleSwap,
        preTitleSwap: preTitleSwap
    };
}());
