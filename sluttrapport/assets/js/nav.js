window.onload = function() {
  responsiveScrollBy();
}

function toggle_visibility(id) {
  var antall = document.getElementsByClassName('nav-ul');
  var e = document.getElementById(id);

  for ( var i = 0; i < antall.length; i++ ) {
      antall[i].setAttribute('style', 'display: none');
  }
  e.setAttribute('style', 'display: block');
}

function responsiveScrollBy(){
  var window_width = window.innerWidth;
  if( ( window_width > 1 ) && ( window_width < 481 ) ){
        var innerHeight = document.getElementById('naven').offsetHeight;
        alert(innerHeight);
        window.scrollBy(0, 1000);
  }
}
