'use strict';

const NYTapiKey = "V654y1J5XOJuWFwqjXzn3Ow6EvqnuUjv"

const NYTsearchURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';


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
  for (let i = 0; i < responseJson.docs.length & i<maxResults ; i++){
    // for each video object in the docs
    //array, add a list item to the results 
    //list with the article title, source, author,
    //description, and image
    $('#NYTresults-list').append(
      `<li><h3><a href="${responseJson.docs[i].web_url}">${responseJson.docs[i].headline.main}</a></h3>
      <p>${responseJson.docs[i].source}</p>
      <p>By ${responseJson.docs[i].byline.original}</p>
      <p>${responseJson.docs[i].snippet}</p>
      <img src='${responseJson.docs[i].multimedia.url}'>
      </li>`
    )};
  //display the results section  
  $('#NYTresults').removeClass('hidden');
};

function NYTgetNews(query, maxResults=10) {
  const params = {
    q: query,
    language: "en",
  };
  const NYTqueryString = NYTformatQueryParams(params)
  const url = NYTsearchURL + '?' + NYTqueryString;

  console.log(url);

  const options = {
    headers: new Headers({
      "Api-Key": NYTapiKey})
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