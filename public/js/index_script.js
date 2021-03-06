"use strict";
$(function(){

  function loadPokemonData(el) {
    var $card = $(el);
    var id = $card.attr('pokemon-id');
    $.getJSON('/pokemon/'+id)
      .done(function(data) {
        $card.children('.card-image').children().attr('src', 'http://www.pokestadium.com/sprites/green/'+data.img_name+'.png');
        $card.children('.card-action').children('span').text(data.poke_name);
      });
  };



  function deleteTeam(el) {
    var id = $(this).parent().parent().children('input').val();
    $.ajax({
      'url' : '/' + id,
      'method' : 'DELETE'
    }).always(function(response){
      if (response.deleted) {
        $('div[team-id="'+id+'"]').remove();
        $('#modal-delete').closeModal();
      } else {
        alert('Internal server error. Please log-in again.');
      }
    })
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
    $('.delete_button').on('click', function(e) {
      e.preventDefault();
      var id = $(this).attr('team-id');
      $('#team-to-delete').val(id);
      $('#modal-delete').openModal();
    })
    $('.display_poke').each(function(ind,el){
      loadPokemonData(el);
    });
    $('#final-delete').on('click', deleteTeam)
    $('.button-collapse').sideNav();
  };

  initPage();

});
