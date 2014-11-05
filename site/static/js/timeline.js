/**
 * Timeline js file
 */


window.onload = function() {

    var bullets = document.getElementsByClassName("timeline-img");
    var blocks = document.getElementsByClassName("timeline-block");
    var dates = document.getElementsByClassName("date");
    var state = false;
    var defaultLocation = "#timeline";

    function hideBlocks(cat) {
        if (state) {
            state = false;
            showAll();
        } else {
            state = true;
            window.location.href = defaultLocation;
            for (var i = 0; i < blocks.length; i++) {
                var thisCat = blocks[i].getAttribute("data-category");
                if (thisCat != cat) {
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
                hideBlocks(this.getAttribute("data-category"));
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

    function insertDataType(){
      for(var i = 0; i < dates.length; i++)
        {
          dates[i].setAttribute("data-type", "human");
        }
    }

    insertDataType();
    addBulletListeners();
    addDateListeners();
}
