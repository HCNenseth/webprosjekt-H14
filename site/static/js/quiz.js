/**
 * Quiz object
 */

var quiz = {
    lib: {},
    file: "",
    form: "",
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
    loadLib: function(callback) {
        this.readJsonFile(function(response) {
            this.lib = JSON.parse(response);
            callback();
        });
    },
    capitalize: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    parseObj: function(string) {
        return JSON.parse(string);
    },
    buildGroupObj: function(cat, level, question) {
        return '['+cat+', "'+level+'", '+question+']';
    },
    buildIdObj: function(cat, level, question, answer) {
        return '['+cat+', "'+level+'", '+question+', '+answer+']';
    },
    shuffle: function(list) {
        /* Fisher-Yates shuffle */
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
    buttonGen: function(type, value, name, func) {
        var element = document.createElement("input");
        element.setAttribute("type", type);
        element.setAttribute("value", value);
        element.setAttribute("name", name);
        element.setAttribute("onclick", func);
        return element;
    },
    radioGen: function(name, value, required) {
        var element = document.createElement("input");
        element.setAttribute("type", "radio");
        element.setAttribute("value", value);
        element.setAttribute("name", name);
        element.setAttribute("required", required);
        return element;
    },
    questionGen: function(obj, cat, level, qID, max) {
        var root = document.createElement("li");
        var alternatives = document.createElement("ul");
        var image = document.createElement("img");
        var question = document.createElement("p");
        var nextButton = this.buttonGen("button",
                                        "Gå videre",
                                        "next"+qID,
                                        "quiz.showNextQuestion('"+qID+"','"+max+"')");

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
            li.appendChild(label);
            alternatives.appendChild(li);
        }

        alternatives.setAttribute("class", "alternatives");

        root.appendChild(question);
        root.appendChild(alternatives);
        if (parseInt(qID) != parseInt(max) -1) {
            root.appendChild(nextButton);
        } else {
            root.appendChild(this.buttonGen("submit",
                        "Vis resultat",
                        null,
                        "return quiz.submit()"
                        ));
        }
        return root;
    },
    showNextQuestion: function(curID, max) {
        var questions = this.form.getElementsByClassName("question");

        /* hide current question */
        questions[curID].setAttribute("style", "display: none");

        this.formlegend.innerHTML = "Spørsmål " + (parseInt(curID)+2) + " av " + max;

        /* find and show next question */
        for (var i = 0; i < questions.length; i++) {
            var id = questions[i].getAttribute("data-id");
            if (parseInt(id) == parseInt(curID)+1) {
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
        this.formlegend.innerHTML = "Velg vanskelighets grad";
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
        this.formlegend.innerHTML = "Spørsmål 1 av " + questions.length;
        this.formlevels.setAttribute("style", "display: none");
    },
    submit: function() {
        var count = 0;
        var correct = 0;

        var actions = document.createElement("ul");
        var newQuiz = document.createElement("li");
        var homePage = document.createElement("li");

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
                    "Ny quiz",
                    "",
                    "window.location.reload()"));
        homePage.appendChild(this.buttonGen("button",
                    "Tilbake til hovedsiden",
                    "",
                    "window.location = '/'"));

        actions.appendChild(newQuiz);
        actions.appendChild(homePage);

        this.form.setAttribute("style", "display: none");
        this.result.appendChild(document.createTextNode(
                    "Result: "+correct+" of: "+count+" questions."));
        this.result.appendChild(actions);
        return false;
    }
}
