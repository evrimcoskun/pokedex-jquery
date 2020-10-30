var pokemonRepository = (function($, window, document) {
  var pokemonList = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
  var modalContainer = $('#modal-container');
  
  function getAll() {
    return pokemonList;
  }
  
  function add(pokemon) {
    pokemonList.push(pokemon);
  }
  
  function addListItem(pokemon) {
    var pokemonList = $('.pokemon-list');
    var listItem = $('<li></li>');
    var button = $('<button class="button-class">' + pokemon.name + '</button>');
    listItem.append(button);
    pokemonList.append(listItem);
    button.on('click', function() {
      showDetails(pokemon)
    })
  }
  
  function loadList() {
    return $.ajax(apiUrl, {dataType: 'json'}).then(function(json) {
      var results = json.results;
      results.forEach(function (item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function(error) {
      console.error(error);
    });
  }
  
  function loadDetails(pokemon) {
    var url = pokemon.detailsUrl;
    return $.ajax(url, {dataType: 'json'}).then(function(details) {
      pokemon.imageUrl = details.sprites.front_default;
      pokemon.height = details.height;
    }).catch(function(error) {
      console.error(error);
    });
  }
  
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function() {
      showModal(pokemon.name, pokemon.height, pokemon.imageUrl)
    });
  }
  
  function showModal(title, height, img) {

    // Clear all existing modal content
    modalContainer.html('');

    var modal = $('<div class="modal"></div>');

    // Add the new modal content
    var closeButtonElement = $('<button class="modal-close">&times;</button>');
    closeButtonElement.on('click', hideModal);
    
    var textContainerElement = $('<div class="modal-text"></div>');
    
    var titleElement = $('<h1>' + title + '</h1>');
    
    var contentElement = $('<p></p>');
    if (height > 10) {
      contentElement.html('height: ' + height + '<br>Wow, that\'s a big Pokemon!');
    } else {
      contentElement.text('height: ' + height);
    }
    
    var imgElement = $('<img src="' + img + '" />')
    
    textContainerElement.append(titleElement);
    textContainerElement.append(contentElement);
    
    
    modal.append(closeButtonElement);
    modal.append(imgElement);
    modal.append(textContainerElement);
    modalContainer.append(modal);

    modalContainer.addClass('is-visible');
  }
  
  function hideModal() {
    modalContainer.removeClass('is-visible');
  }
  
  $(window).on('keydown', function(e) {
    if (e.key === 'Escape' && modalContainer.hasClass('is-visible')) {
      hideModal();  
    }
  });
  
  modalContainer.on('click', function(e) {
    var target = $(e.target);
    if (target.html() === modalContainer.html()) {
      hideModal();
    }
  });
  
  return {
    getAll: getAll,
    add: add,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    showModal: showModal,
    hideModal: hideModal
  };
  
})(jQuery, window, document);

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});
