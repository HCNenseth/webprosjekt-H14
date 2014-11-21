/**
 * Generic js file
 */

window.onload = function() {
    var form = document.getElementById("quizform");
    var back = document.getElementById("back");

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

    back.addEventListener("click", function(){
        if (confirm("Are you sure you want to exit the Quiz?")) {
            window.location = location.href.substring(0,
                    location.href.indexOf('quiz'))+'index.html';
        }
    }, false);
}
