function toggle_visibility(id) {
  var antall = document.getElementsByClassName('nav-ul');

  for ( var i = 0; i < antall.length; i++ )
    {
      antall[i].setAttribute('style', 'display: none');
    }

  var e = document.getElementById(id);
  e.setAttribute('style', 'display: block');
  }
