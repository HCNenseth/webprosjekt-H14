/**
 * Timeline js file
 */


window.onload = function() {

    var bullets = document.getElementsByClassName("timeline-img");
    var blocks = document.getElementsByClassName("timeline-block");
    var state = false;

    function hideBlocks(cat) {
        if (state) {
            state = false;
            showAll();
        } else {
            state = true;
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

    function addListeners() {
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].addEventListener("mousedown", function() {
                hideBlocks(this.getAttribute("data-category"));
            }, false);
        }
    }

    addListeners();
}
