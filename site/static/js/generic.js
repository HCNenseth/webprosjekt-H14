/**
 * Generic js file
 */

window.onload = function() {
    var form = document.getElementById("quizform");

    quiz.file = "lib/quiz.json";

    quiz.form = form;
    quiz.curtain = document.getElementById("curtain");
    quiz.formlegend = document.getElementById("quizlegend");
    quiz.formcategories = document.getElementById("quizcategories");
    quiz.formlevels = document.getElementById("quizlevels");
    quiz.formquestions = document.getElementById("quizquestions");
    quiz.result = document.getElementById("result");

    quiz.loadLib(function() {
        quiz.initState();
        quiz.loadCategories();
    });
}
