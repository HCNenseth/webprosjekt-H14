/**
 * Quiz object
 */

var quiz = {
    lib: {},
    file: "",
    form: [],
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
    buttonGen: function(value, name, func) {
        var element = document.createElement("input");
        element.setAttribute("type", "button");
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
    questionGen: function(obj, cat, level, qID) {
        var root = document.createElement("li");
        var alternatives = document.createElement("ul");
        var question = document.createElement("p");
        
        question.appendChild(document.createTextNode(obj.question));

        var groupId = this.buildGroupObj(cat, level, qID);
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

        root.appendChild(question);
        root.appendChild(alternatives);
        return root;
    },
    loadCategories: function() {
        for (var i = 0; i < lib.categories.length; i++) {
            var li = document.createElement("li");
            var text = Object.keys(lib.categories[i])[0];
            li.appendChild(this.buttonGen(text,
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
                    li.appendChild(this.buttonGen(this.capitalize(levelArr[i]),
                                                  levelArr[i],
                                                  "quiz.loadQuestions('"+cat+"','"+levelArr[i]+"')"));
                    this.formlevels.appendChild(li);
                }
            }
        }
        this.formlegend.innerHTML = "Level";
        this.formcategories.setAttribute("style", "display: none");
    },
    loadQuestions: function(cat, level) {
        for (var key in lib.categories[cat]) {
            var questions = lib.categories[cat][key][levels][level];
            for (var i = 0; i < questions.length; i++) {
                this.formquestions.appendChild(this.questionGen(questions[i],
                                                                cat,
                                                                level,
                                                                i));
            }
        }
        this.formlegend.innerHTML = "Questions";
        this.formlevels.setAttribute("style", "display: none");
    },
    submit: function() {
        var count = 0;
        var correct = 0;
        for (var i = 0; i < this.form.length; i++) {
            if (this.form[i].getAttribute("type") == "radio" &&
                this.form[i].checked == true) {
                var values = this.parseObj(this.form[i].value);
                if (this.isCorrect(values) == "true") {
                    correct++;
                }
                count++;
            }
        }
        this.result.appendChild(document.createTextNode(
                    "Result: "+correct+" of: "+count+" questions."));
        return false;
    }
}
