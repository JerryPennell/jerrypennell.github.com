/*
Jerry Pennell
Advanced Visual Frameworks
week 2 
Term 1212   
*/

$(function(){

    getOnlineFeed('http://www.engadget.com/rss.xml');
    //getOnlineFeed('http://www.comic-con.org/rss/cci.xml');

/*
  My list of feeds I would like to use

  getOnlineFeed('http://www.engadget.com/rss.xml');
  getOnlineFeed('http://www.fremont.k12.ca.us/site/RSS.aspx?DomainID=1&ModuleInstanceID=4613&PageID=1');
  getOnlineFeed('http://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=atom&topic=h');
  getOnlineFeed('http://www.appbank.net/feed');
  getOnlineFeed('http://japanese.engadget.com/rss.xml');
  getOnlineFeed('http://www.bebit.co.jp/index.xml');
  getOnlineFeed('http://www.ntt.com/rss/release.rdf?link_id=ostop_service_rss');
  getOnlineFeed('http://feeds.feedburner.com/gapsis');
  getOnlineFeed('http://octoba.net/feed');
  getOfflineFeed('google_news_jsonp.js');
*/
});
/* Javascript functions */
 listEntries = function(json) {
  if (!json.responseData.feed.entries) return false;          //Call out the json information
  $('#widgetTitle').text(json.responseData.feed.title);
  var articleLength =json.responseData.feed.entries.length;
  articleLength = (articleLength > maxLength) ? maxLength : articleLength;
  
  //loop through the contents and parse out the article information
  for (var i = 1; i <= articleLength ; i++) {
    var entry = json.responseData.feed.entries[i-1];
    $('#link' + i).text(entry.title);
    $('#articleHeader' + i).text(entry.title);
    $('#openButton' + i).attr('href', entry.link);
    $('#articleContent' + i).append(entry.content);
    console.log("RSS feed items using XML - "+entry.title);     //Which list am I pulling
  }
  
  //Navigation based on number of articles
  
  $('#article1 .prevButton').remove();
  $('#article' + articleLength + ' .nextButton').remove();
  if (articleLength < maxLength) {
    for (i = articleLength + 1; i <= maxLength; i++) {
      $('#list' + i).remove();
      $('#article' + i).remove();
    }
  }
};
 
 //Let's grab that list of articles using the google RSS reader api
 
 getOnlineFeed = function(url) {
  var script = document.createElement('script');
  script.setAttribute('src', 'http://ajax.googleapis.com/ajax/services/feed/load?callback=listEntries&hl=ja&output=json-in-script&q='
                      + encodeURIComponent(url)
                      + '&v=1.0&num=' + maxLength);
  script.setAttribute('type', 'text/javascript');
  document.documentElement.firstChild.appendChild(script);
};

  //Sets the link source for the url
  
 getOfflineFeed = function(url) {
  var script = document.createElement('script');
  script.setAttribute('src', url);
  script.setAttribute('type', 'text/javascript');
  document.documentElement.firstChild.appendChild(script);
};

