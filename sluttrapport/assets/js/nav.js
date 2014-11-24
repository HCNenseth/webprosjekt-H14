function toggle_visibility(id) {
  var antall = document.getElementsByClassName('nav-ul');
  var e = document.getElementById(id);

  for ( var i = 0; i < antall.length; i++ ) {
      antall[i].setAttribute('style', 'display: none');
  }
  e.setAttribute('style', 'display: block');
}
