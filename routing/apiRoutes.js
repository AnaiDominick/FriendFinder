// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// ===============================================================================

var friendAnswers = require("../data/friends");

// ROUTING API
// ===============================================================================

module.exports = function (app) {

  app.get("/api/friends", function (req, res) {
    return res.json(friendAnswers);
  });

  app.post("/api/friends", function (req, res) {      
      // friendAnswers.push(req.body);      
      // res.json(true);

      //Calculate total points for user submission
      var userPoints = 0;
      for(var i = 0; i < req.body.scores.length; i++){
        userPoints += parseInt(req.body.scores[i]);
      }

      //Calculate points of matches
      var matchPoints = 0;
      var comparisonArray = [];
      for(var i = 0; i<friendAnswers.length; i++){
        //Grab points array from each potential match
        pointsArray = friendAnswers[i].scores;
        for(var j = 0; j < pointsArray.length; j++){
        //Calculate total points of each potential match
          matchPoints += parseInt(pointsArray[j]);
        }

        //Calculate absolute value of the diff between user and match points
        var compare = Math.abs(userPoints - matchPoints);
        console.log("Difference between " + req.body.name + " and potential match "+ friendAnswers[i].name+ " is "+ compare + " points");
        //Push each difference value into an array
        comparisonArray.push(compare);
        //Reset match points to zero
        matchPoints = 0;
      }

      //Return the minimum of the comparison array
      Array.min = function(array){
          return Math.min.apply( Math, array );
      };
      var minimum = Array.min(comparisonArray);


      //Find the index number of the minimum value in the comparison array
      var indexNum = comparisonArray.indexOf(minimum);

      //Use indexNum to grab the matching object from the JSON data and fill the response data that will be posted to the survey page
      res.json(friendAnswers[indexNum]);
      friendAnswers.push(req.body);
    
  });

  app.post("/api/clear", function(req, res) {
    // Empty out the arrays of data
    friendAnswers.length = [];
    res.json({ ok: true });
  });
};



