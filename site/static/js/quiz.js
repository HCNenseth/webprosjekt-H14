/**
 * Quiz object
 */

var quiz = {
    lib: {},
    file: "",
    form: "",
    curtain: "",
    formlegend: "",
    formcategories: "",
    formlevels: "",
    formquestions: "",
    result: "",
    readJsonFile: function(callback) {
        var request = new XMLHttpRequest();
        request.open("GET", this.file, true);
        request.send();
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                callback(request.responseText);
            }
        }
    },
    /* Function for loading and readJsonFile, and waiting for its
     * callback, then giving its own callback for the caller to
     * process further. */
    loadLib: function(callback) {
        this.readJsonFile(function(response) {
            this.lib = JSON.parse(response);
            callback();
        });
    },
    initState: function() {
        this.curtain.setAttribute("style", "display: none");
    },
    /* Simple capitalize function */
    capitalize: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    parseObj: function(string) {
        return JSON.parse(string);
    },
    /* Build serialized object used for pushing into DOM */
    buildGroupObj: function(cat, level, question) {
        return '['+cat+', "'+level+'", '+question+']';
    },
    /* Build serialized object used for pushing into DOM */
    buildIdObj: function(cat, level, question, answer) {
        return '['+cat+', "'+level+'", '+question+', '+answer+']';
    },
    /* Fisher-Yates shuffle */
    shuffle: function(list) {
        var c = list.length, tmp, idx;
        while (c > 0) {
            idx = Math.floor(Math.random() * c--);

            /* swap */
            tmp = list[c];
            list[c] = list[idx];
            list[idx] = tmp;
        }
        return list;
    },
    isCorrect: function(obj) {
        var cat = obj[0];
        var level = obj[1];
        var question = obj[2];
        var answer = obj[3];
        for (var key in lib.categories[cat]) {
            var questions = lib.categories[cat][key][levels][level][question];
            return questions.alternatives[answer].key;
        }
        return false;
    },
    /* Generate button element */
    buttonGen: function(type, value, name, func) {
        var element = document.createElement("input");
        element.setAttribute("type", type);
        element.setAttribute("value", value);
        element.setAttribute("name", name);
        element.setAttribute("onclick", func);
        return element;
    },
    /* Generate radio input element */
    radioGen: function(name, value, required) {
        var element = document.createElement("input");
        element.setAttribute("type", "radio");
        element.setAttribute("value", value);
        element.setAttribute("name", name);
        element.setAttribute("required", required);
        return element;
    },
    /* Generate question element. This includes image, question and
     * alternatives */
    questionGen: function(obj, cat, level, qID, max) {
        var root = document.createElement("li");
        var alternatives = document.createElement("ul");
        var image = document.createElement("img");
        var question = document.createElement("p");
        var nextButton = this.buttonGen("button",
                                        "Next",
                                        "next"+qID,
                                        "quiz.showNextQuestion('"+qID+"','"+max+"')");
        var submitButton = this.buttonGen("button",
                                          "Submit",
                                          null,
                                          "return quiz.submit('"+qID+"')");

        /* disable next button, until alternative has been selected */
        nextButton.disabled = true;
        submitButton.disabled = true;

        root.setAttribute("class", "question");
        root.setAttribute("data-id", qID);

        if (parseInt(qID) != 0) {
            root.setAttribute("style", "display: none");
        }

        image.setAttribute("src", obj.image);
        image.setAttribute("class", "quizimage");
        question.setAttribute("class", "questiontext");

        question.appendChild(image);
        question.appendChild(document.createTextNode(obj.question));

        var groupId = this.buildGroupObj(cat, level, qID);
        /* shuffle alternatives */
        obj.alternatives = this.shuffle(obj.alternatives);
        for (var i = 0; i < obj.alternatives.length; i++) {
            var li = document.createElement("li");
            var label = document.createElement("label");
            var altText = obj.alternatives[i].alternative;
            var id = this.buildIdObj(cat, level, qID, i);
            label.appendChild(this.radioGen(groupId, id, "required"));
            label.appendChild(document.createTextNode(altText));
            /* Make nextbutton active when one of the alternatives
             * have been selected */
            label.addEventListener('click', function(){
                if (parseInt(qID) != parseInt(max) -1) {
                    nextButton.disabled = false;
                } else {
                    submitButton.disabled = false;
                }
            }, false);
            li.appendChild(label);
            alternatives.appendChild(li);
        }

        alternatives.setAttribute("class", "alternatives");

        root.appendChild(question);
        root.appendChild(alternatives);
        if (parseInt(qID) != parseInt(max) -1) {
            root.appendChild(nextButton);
        } else {
            root.appendChild(submitButton);
        }
        return root;
    },
    checkAnswer: function(curID) {
        for (var i = 0; i < this.form.length; i++) {
            if (this.form[i].getAttribute("type") == "radio" &&
                this.form[i].checked == true) {
                var values = this.parseObj(this.form[i].value);
                if (values[2] == curID) {
                    if (this.isCorrect(values)) {
                        this.showCurtain(true);
                    } else {
                        this.showCurtain(false);
                    }
                }
            }
        }
    },
    showCurtain: function(bool) {
        var banner = document.createElement("h1");

        /* Show the curtain */
        this.curtain.removeAttribute("style");

        /* Give it color and text */
        if (bool) {
            this.curtain.setAttribute("class", "correct");
            banner.appendChild(document.createTextNode("Correct!"));
            this.curtain.appendChild(banner);
        } else {
            this.curtain.setAttribute("class", "incorrect");
            banner.appendChild(document.createTextNode("Incorrect!"));
            this.curtain.appendChild(banner);
        }

        /* Append an event listener for removing it */
        this.curtain.addEventListener("click", function(){
            this.setAttribute("style", "display: none");
            this.removeChild(banner);
        }, false);
    },
    showNextQuestion: function(curID, max) {
        var questions = this.form.getElementsByClassName("question");
        var curID = parseInt(curID);

        /* Check answer */
        this.checkAnswer(curID);

        /* hide current question */
        questions[curID].setAttribute("style", "display: none");

        this.formlegend.innerHTML = "Question " + (curID+2) + " av " + max;

        /* find and show next question */
        for (var i = 0; i < questions.length; i++) {
            var id = questions[i].getAttribute("data-id");
            if (parseInt(id) == curID+1) {
                questions[i].removeAttribute("style");
            }
        }
    },
    loadCategories: function() {
        for (var i = 0; i < lib.categories.length; i++) {
            var li = document.createElement("li");
            var text = Object.keys(lib.categories[i])[0];
            li.appendChild(this.buttonGen("button",
                                          text,
                                          "cat",
                                          "quiz.loadLevels('"+i+"')"));
            this.formcategories.appendChild(li);
        }
    },
    loadLevels: function(cat) {
        for (var key in lib.categories[cat]) {
            for (levels in lib.categories[cat][key]) {
                var levelArr = Object.keys(lib.categories[cat][key][levels]);
                for (var i = 0; i < levelArr.length; i++) {
                    var li = document.createElement("li");
                    li.appendChild(this.buttonGen("button",
                                                  this.capitalize(levelArr[i]),
                                                  levelArr[i],
                                                  "quiz.loadQuestions('"+cat+"','"+levelArr[i]+"')"));
                    this.formlevels.appendChild(li);
                }
            }
        }
        this.formlegend.innerHTML = "Choose level";
        this.formcategories.setAttribute("style", "display: none");
    },
    loadQuestions: function(cat, level) {
        var questions;
        for (var key in lib.categories[cat]) {
            questions = lib.categories[cat][key][levels][level];
            /* shuffle questions */
            questions = this.shuffle(questions);
            for (var i = 0; i < questions.length; i++) {
                this.formquestions.appendChild(
                        this.questionGen(questions[i],
                                         cat,
                                         level,
                                         i,
                                         questions.length));
            }
        }
        this.formlegend.innerHTML = "Question 1 av " + questions.length;
        this.formlevels.setAttribute("style", "display: none");
    },
    submit: function(curID) {
        var count = 0;
        var correct = 0;

        var banner = document.createElement("h1");
        var actions = document.createElement("ul");
        var newQuiz = document.createElement("li");
        var homePage = document.createElement("li");

        this.checkAnswer(parseInt(curID));

        for (var i = 0; i < this.form.length; i++) {
            if (this.form[i].getAttribute("type") == "radio" &&
                this.form[i].checked == true) {
                var values = this.parseObj(this.form[i].value);
                if (this.isCorrect(values)) {
                    correct++;
                }
                count++;
            }
        }

        newQuiz.appendChild(this.buttonGen("button",
                    "New quiz",
                    "",
                    "window.location.reload()"));
        homePage.appendChild(this.buttonGen("button",
                    "Back to the main page",
                    "",
                    "window.location = '/'"));

        actions.appendChild(newQuiz);
        actions.appendChild(homePage);

        this.form.setAttribute("style", "display: none");
        banner.appendChild(document.createTextNode(
                    "Result: "+correct+" of "+count+" questions."));
        this.result.appendChild(banner);
        this.result.appendChild(actions);
        return false;
    }
}
