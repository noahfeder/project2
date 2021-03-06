"use strict";
$(function(){

  function resetModal() {
    $('#new-password-2,#new-password,#new-username').removeClass('invalid animated shake').val('');
  }

  function alertError(sel) {
    $(sel).addClass('invalid animated shake');
    setTimeout(function(){
      $(sel).removeClass('animated shake');
    },1000)
  }

  function handleResponse(response) {
    if (response.logged_in) {
      location.reload();
    } else {
      $('.welcome_message').text(response.error).addClass('red-text');
      var errorSelector = (response.error.indexOf('Passwords') > -1) ? '#new-password, #new-password-2' : '#new-username';
      alertError(errorSelector);
    }
  };

  function makeRequest() {
    var fromClick = $(arguments[0].toElement).val()
    var route = (fromClick) ? fromClick : arguments[0];
    if (route === 'signup') {
      var data = {
      'username' : $('#new-username').val(),
      'password' : $('#new-password').val(),
      'password2' : $('#new-password-2').val(),
      'color' : $('#colorPicker').val()
      };
      if (data.username.length < 4 || data.username.indexOf(' ') > -1) {
        alertError('#new-username');
        return;
      } else if (data.password !== data.password2 || data.password.length < 7 || data.password.indexOf(' ') > -1) {
        alertError('#new-password,#new-password-2');
        return;
      }
    } else {
      var data = {
        'username' : $('#username').val(),
        'password' : $('#password').val()
      };
    }
    $.ajax({
      'url'    : '/users/' + route,
      'method' : 'POST',
      'data'   : data
    }).always(function(response) {
      handleResponse(response);
    });
  };

  function bing() {
    $.ajax({
      'method' : 'GET',
      'url' : '/images'
    }).always(function(data) {
      var rand = Math.floor(Math.random() * data.value.length);
      var img = data.value[rand].contentUrl
      $('body').css({
        'background-image': 'url(' + img + ')'
      });
    });
  };

  function initPage() {
    bing();
    $('select').material_select();
    $('.button-collapse').sideNav();
    $('#login_button').on('click',makeRequest);
    $('#create-user').on('click',makeRequest);
    $('#signup_button').on('click',function(){
      $('.modal-content .welcome_message').text('Sign Up Here!').removeClass('red-text');
      $('#signup-modal').openModal({
        ready:function(){
          $('#new-username').focus();
        },
        complete:resetModal});
    });
    $('#login_form').on('keydown',function(e) {
      if (e.which === 13) {
        e.preventDefault();
        makeRequest('login');
      }
    });
    $('#signup_form').on('keydown',function(e){
      if (e.which === 13) {
        e.preventDefault();
        makeRequest('signup');
      }
    });
  };

  initPage();

}); // end jquery
