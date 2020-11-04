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
    var button = $('<button type="button" class="btn btn-light btn-lg btn-block text-left" data-toggle="modal" data-target="#modal-container">' + pokemon.name + '</button>');
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
    modalContainer.empty();
    var modalDialog = $('<div class="modal-dialog modal-dialog-centered" role="document"></div>');
    var modalContent = $('<div class="modal-content"></div>')
    var modalBody = $('<div class="modal-body"></div>');
    var modalTitle = $('<h5 class="modal-title">' + title + '</h5>');
    var modalHeader = $('<div class="modal-header"></div>');
    modalHeader.append(modalTitle);
    modalContent.append(modalHeader);
    
    
    var nameElement = $('<h1>' + title + '</h1>');
    var imageElement = $('<img class="modal-img" style="width:50%">');
    imageElement.attr("src", img)
    var heightElement = $('<p>height: ' + height + '</p>');
    
    var contentElement = $('<p></p>');
    if (height > 10) {
      contentElement.html('<br>Wow, that\'s a big Pokemon!');
    }
    
    modalBody.append(imageElement);
    modalBody.append(contentElement);
    modalBody.append(heightElement);
    modalContent.append(modalBody);

    var modalFooter = $('<div class="modal-footer">');
    var modalButton = $('<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>');
    
    modalFooter.append(modalButton);
    modalContent.append(modalFooter);
    modalDialog.append(modalContent);
    modalContainer.append(modalDialog);
  }

  
  return {
    getAll: getAll,
    add: add,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    showModal: showModal
  };
  
})(jQuery, window, document);

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});
