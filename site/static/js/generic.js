/**
 * Generic js file
 */

window.onload = function() {
    quiz.file = "lib/quiz.json";
    quiz.form = document.forms["quizform"];
    quiz.formcategories = document.getElementById("quizcategories");
    quiz.formlevels = document.getElementById("quizlevels");
    quiz.formquestions = document.getElementById("quizquestions");
    quiz.loadLib(function() {
        quiz.loadCategories();
    });
}
