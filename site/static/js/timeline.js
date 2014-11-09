/**
 * Timeline js file
 */


window.onload = function() {

    var bullets = document.getElementsByClassName("timeline-img");
    var blocks = document.getElementsByClassName("timeline-block");
    var dates = document.getElementsByClassName("date");
    var deletes = document.getElementsByClassName("delete");
    var state = false;
    var defaultLocation = "#timeline";

    function hideBlocks(obj) {
        if (state) {
            state = false;
            showAll();
        } else {
            state = true;
            window.location.href = defaultLocation;
            var cat = obj.parentNode.getAttribute("data-category");
            for (var i = 0; i < blocks.length; i++) {
                var thatCat = blocks[i].getAttribute("data-category");
                if (thatCat != cat) {
                    blocks[i].setAttribute("style", "display: none");
                }
            }
        }
    }

    function showAll(callback) {
        for (var i = 0; i < blocks.length; i++) {
            blocks[i].removeAttribute("style");
        }
        callback();
    }

    function convertTime(date){

            var thisType = date.getAttribute("data-type");

            if (thisType == "human"){
                var myDate = new Date( date.innerHTML);
                var myEpoch = myDate.getTime() / 1000.0;
                date.innerHTML = myEpoch;
                date.setAttribute("data-type", "epoch");
            }
            else
            {
                var myDate = new Date( parseInt( date.innerHTML ) * 1000.0 );
                date.innerHTML = myDate.getFullYear();
                date.setAttribute("data-type", "human");
            }

    }

    function addBulletListeners() {
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].addEventListener("mousedown", function() {
                hideBlocks(this);
            }, false);
        }
    }

    function addDateListeners() {
        for (var j = 0; j < dates.length; j++) {
            dates[j].addEventListener("mouseover", function() {
                convertTime(this);
            }, false);
        }
    }

    function addDeleteListeneres() {
        for (var i = 0; i < deletes.length; i++) {
            deletes[i].addEventListener("mousedown", function() {
                this.parentNode.parentNode.setAttribute("style", "display:none");
            }, false);
            deletes[i].style.display = "block";
        }
    }

    function insertDataCategory() {
        for (var i = 0; i < bullets.length; i++) {
            var classes = bullets[i].getAttribute("class").split(" ");
            bullets[i].parentNode.setAttribute("data-category", classes.pop());
        }
    }

    function insertDataType(){
      for(var i = 0; i < dates.length; i++)
        {
          dates[i].setAttribute("data-type", "human");
        }
    }

    insertDataType();
    insertDataCategory();
    addBulletListeners();
    addDateListeners();
    addDeleteListeneres();
}
