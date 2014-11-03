/**
 * Timeline js file
 */


window.onload = function() {

    var bullets = document.getElementsByClassName("timeline-img");
    var blocks = document.getElementsByClassName("timeline-block");

    function hideBlocks(cat) {
        for (var i = 0; i < blocks.length; i++) {
            var thisCat = blocks[i].getAttribute("data-category");
            if (thisCat != cat) {
                blocks[i].setAttribute("style", "display: none");
            } else {
                blocks[i].addEventListener("mousedown", function() {
                    //boolSwitch();
                }, false);
            }
        }
    }

    function boolSwitch() {
        for (var i = 0; i < blocks.length; i++) {
            blocks[i].removeAttribute("style");
        }
        resetListeners();
    }

    function resetListeners() {
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].addEventListener("mousedown", function() {
                hideBlocks(this.getAttribute("data-category"));
            }, false);
        }
    }

    resetListeners();
}
