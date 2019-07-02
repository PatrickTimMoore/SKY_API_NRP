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
    function getConstituentCodes(request, response) {
        Sky.getConstituentCodes(request, request.params.offset, function (results) {
            response.send(results);
        });
    }
    function getConstituentRelationships(request, response) {
        Sky.getConstituentRelationships(request, request.params.constituentId, function (results) {
            /*fs.appendFile(dateString, (JSON.stringify(results, null, '\t') + '\n'), (err) => {
              if (err) console.log(err);
              console.log("Get Successfully Written to File.");
            });*/
            response.send(results);
        });
    }
    function getConstituentFirstName(request, response) {
        Sky.getConstituent(request, request.params.constituentId, function (results) {
            fs.appendFile(dateString, (JSON.stringify(results, null, '\t') + '\n'), (err) => {
              if (err) console.log(err);
              console.log("Get Successfully Written to File.");
            });
            response.send(results);
        });
    }
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
    function patchConstituentFirstName(request, response) {
        Sky.patchConstituentFirstName(request, request.params.constituentId, { "first": request.params.firstName }, function (results) {
          fs.appendFile(dateString, " => ", (err) => {
            if (err) console.log(err);
            console.log("Patch Successfully Written to File.");
          });
          response.send(results);
        });
    }
    function patchConstituentName(request, response) {
        Sky.patchConstituentFirstName(request, request.params.constituentId, { "first": request.params.firstName, "middle": request.params.midInitial }, function (results) {
          fs.appendFile(dateString, " => ", (err) => {
            if (err) console.log(err);
            console.log("Patch Successfully Written to File.");
          });
          response.send(results);
        });
    }
    function getConstituentTitlePreTest(request, response) {
        Sky.getConstituent(request, request.params.constituentId, function (results) {
            response.send(results);
          }
        );
    }
    function getConstituentTitlePostTest(request, response) {
        Sky.getConstituent(request, request.params.constituentId, function (results) {
            fs.appendFile(dateString, (results.id.toString() + ':\n\t{ "first": ' + JSON.stringify(results.first, null, '\t') + ' } + { "title": ' + 'TBD' + ' }\n'), (err) => {
              if (err) console.log(err);
            });
            response.send(results);
          }
        );
    }
    function patchConstituentTitleTest(request, response) {
          fs.appendFile(dateString, " + ", (err) => {
            if (err) console.log(err);
            console.log("Patch Test Successfully Written to File.");
          });
          response.send();
    }
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
    function getConstituentTitlePostLive(request, response) {
        Sky.getConstituent(request, request.params.constituentId, function (results) {
            fs.appendFile(dateString, (' + { "title": ' + 'TBD' + ' }\n'), (err) => {
              if (err) console.log(err);
            });
            response.send(results);
          }
        );
    }
    function patchConstituentTitleLive(request, response) {
          fs.appendFile(dateString, ' + ', (err) => {
            if (err) console.log(err);
            console.log("Patch Test Successfully Written to File.");
          });
          response.send();
    }
    function guessGender(request, response) {
          console.log("Gender: assumed.");
          response.send(guess.guess(request.params.firstName));
    }
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
    function patchGender(request, response) {
        Sky.patchConstituentFirstName(request, request.params.constituentId, { "gender": request.params.gender }, function (results) {
          fs.appendFile(dateString, ' => ', (err) => {
            if (err) console.log(err);
            console.log("Patch Successfully Written to File.");
          });
          response.send(results);
        });
    }
    function titleSwap(request, response) {
        Sky.patchConstituentFirstName(request, request.params.constituentId, { "title": 'Mrs.' }, function (results) {
          fs.appendFile(dateString, ' => ', (err) => {
            if (err) console.log(err);
            console.log("Patch Successfully Written to File.");
          });
          response.send(results);
        });
    }
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
