// Object that calculates and finds the index in the sorted score array.
// Used to keep track of incrementing index in cases where it won't be even
// (Eg: If you have scores of 90, 90, 90 ,86, 70, 55) it is not divisible by 
// 5 so the grades distribution cannot be 20% even exactly.
function ScoresIndexIncrementCalculator(sortedScoreLength, numberOfGrades) {
    this.initialIndexIncrement = Math.floor(sortedScoreLength / numberOfGrades);
    this.remainder = sortedScoreLength % numberOfGrades;
}
ScoresIndexIncrementCalculator.prototype.calculateIndexIncrement = function() {
    // Since the array isn't always divisible by 5, there's a remainder that you have to increment by.
    // so some sections will have a "grade bucket" one size bigger. This keeps track of how much
    // of the remainder is left. 
    var extraIncrement = 0;
    if (this.remainder) {
        this.remainder--;
        extraIncrement = 1;
    }
    return this.initialIndexIncrement  + extraIncrement;

};

// Function that takes the sorted scores and returns an Object that contains the grades A, B, C, D, with the associated 
// minimum score needed to achieve that grade
function getMinScoreForGrades(sortedScores) {
    var grades = ['A', 'B', 'C', 'D'];
    var numberOfGrades = 5;
    var scoresIndexIncrementCalculator = new ScoresIndexIncrementCalculator(sortedScores.length, numberOfGrades);
    var minScoreForGrades = {A: null, B: null, C: null, D: null};
    // Start at -1 since arrays will have a value at index 0
    var indexOfMinScoreForGrade = -1;
    for (var i = 0; i < grades.length; i++){
            incrementScoreIndexAmount = scoresIndexIncrementCalculator.calculateIndexIncrement();
            indexOfMinScoreForGrade = incrementScoreIndexAmount + indexOfMinScoreForGrade;
            minScoreForGrades[grades[i]] = sortedScores[indexOfMinScoreForGrade];
        }
    return minScoreForGrades;
}


// Sorts the scores given and returns an array that gives the score and its associated grade
function getWeightedGrades(scores) {
    var sortedScores = scores.sort(function(a,b){
        return b-a; 
    });
    var scoresWithGrades = [];

    var minScoreForGrades = getMinScoreForGrades(sortedScores);
    for (var i = 0; i < sortedScores.length; i++) {
        var score = sortedScores[i];
        // Even though the minScoreForGrades object can have the
        // same minimum score for an "A" or "B" if multiple scores exist
        // a score will only be assigned to one grade, and the highest grade 
        // will be chosen. So A minScoreForGrades object of { A: 99, B: 99, C: 99, D: 70 }
        // will always give those with a 99 an A.
        if (minScoreForGrades.A && minScoreForGrades.A <= score) {
            scoresWithGrades.push([score, 'A']);
        } else if (minScoreForGrades.B && minScoreForGrades.B <= score) {
            scoresWithGrades.push([score, 'B']);
        } else if (minScoreForGrades.C && minScoreForGrades.C <= score) {
            scoresWithGrades.push([score, 'C']);
        } else if (minScoreForGrades.D && minScoreForGrades.D <= score) {
            scoresWithGrades.push([score, 'D']);
        } else {
            // scores lower than the minimum score for D default to an F
            scoresWithGrades.push([score, 'F']);
        }
    }

    return scoresWithGrades;
}

console.log(getWeightedGrades([99, 92, 91, 91, 89, 85, 83, 82, 80, 79, 78,
  78, 77, 76, 75, 74, 62, 55, 43, 20]));