'use strict';

const NYTapiKey = "V654y1J5XOJuWFwqjXzn3Ow6EvqnuUjv";

const NYTsearchURL = 'https://cors-anywhere.herokuapp.com/https://api.nytimes.com/svc/search/v2/articlesearch.json';


function NYTformatQueryParams(params) {
  const NYTqueryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return NYTqueryItems.join('&');
}

function NYTdisplayResults(responseJson, maxResults) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#NYTresults-list').empty();
  // iterate through the docs array, stopping at the max number of results
  for (let i = 0; i < responseJson.response.docs.length & i<maxResults ; i++){
    // for each video object in the docs
    //array, add a list item to the results 
    //list with the article title, source, author,
    //description, and image
    $('#NYTresults-list').append(
      `<li><h3><a href="${responseJson.response.docs[i].web_url}">${responseJson.response.docs[i].headline.main}</a></h3>
      <p>${responseJson.response.docs[i].source}</p>
      <p>By ${responseJson.response.docs[i].byline.original}</p>
      <p>${responseJson.response.docs[i].snippet}</p>
      </li>`
    )};
  //display the results section  
  $('#NYTresults').removeClass('hidden');
};

function NYTgetNews(query, maxResults=11) {
  const params = {
    q: query,
    "api-key": NYTapiKey,
    language: "en",
  };
  const NYTqueryString = NYTformatQueryParams(params)
  const url = NYTsearchURL + '?' + NYTqueryString;

  console.log(url);

  const options = {
    //headers: new Headers({
      //"Authorization": NYTapiKey})
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => NYTdisplayResults(responseJson, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function NYTwatchForm() {
  $('form').submit(event => {
    event.preventDefault();
    console.log("NYTWatchForm")
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    NYTgetNews(searchTerm, maxResults);
  });
}

$(NYTwatchForm);