/**
 * Quiz object
 */

var quiz = {
    lib: {},
    file: "",
    form: [],
    formcategories: "",
    formlevels: "",
    formquestions: "",
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
    buttonGen: function(value, name, func) {
        var element = document.createElement("input");
        element.setAttribute("type", "button");
        element.setAttribute("value", value);
        element.setAttribute("name", name);
        element.setAttribute("onclick", func);
        return element;
    },
    questionGen: function(obj) {
        var root = document.createElement("li");
        var alternatives = document.createElement("ul");
        var question = document.createElement("p");
        
        question.appendChild(document.createTextNode(obj.question));

        for (var i = 0; i < obj.alternatives.length; i++) {
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(obj.alternatives[i].alternative));
            alternatives.appendChild(li);
        }
        root.appendChild(question);
        root.appendChild(alternatives);
        return root;
    },
    loadCategories: function() {
        for (var i = 0; i < lib.categories.length; i++) {
            var li = document.createElement("li");
            var text = Object.keys(lib.categories[i])[0];
            li.appendChild(this.buttonGen(text,
                                          text.toLowerCase(),
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
                    li.appendChild(this.buttonGen(this.capitalize(levelArr[i]),
                                                  levelArr[i],
                                                  "quiz.loadQuestions('"+cat+"','"+levelArr[i]+"')"));
                    this.formlevels.appendChild(li);
                }
            }
        }
    },
    loadQuestions: function(cat, level) {
        for (var key in lib.categories[cat]) {
            var questions = lib.categories[cat][key][levels][level];
            for (var i = 0; i < questions.length; i++) {
                this.formquestions.appendChild(this.questionGen(questions[i]));
            }
        }
    }
}
