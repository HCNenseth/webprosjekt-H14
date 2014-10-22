/**
 * Generic js file
 */

window.onload = function() {
    var form = document.forms["quizform"];

    quiz.file = "lib/quiz.json";

    quiz.form = form;
    quiz.formlegend = document.getElementById("quizlegend");
    quiz.formcategories = document.getElementById("quizcategories");
    quiz.formlevels = document.getElementById("quizlevels");
    quiz.formquestions = document.getElementById("quizquestions");
    quiz.result = document.getElementById("result");

    quiz.loadLib(function() {
        quiz.loadCategories();
    });

    form.setAttribute("onsubmit", "return quiz.submit()");
}
