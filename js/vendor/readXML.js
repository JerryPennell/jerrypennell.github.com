
// Start function when DOM has completely loaded 
$(document).ready(function(){ 

	// Open the comics.xml file
	$.get("data/comics.xml",{},function(xml){
      	
		// Build an HTML string
		myHTMLOutput = '';
	 	myHTMLOutput += '<table width="98%" border="1" cellpadding="0" cellspacing="0">';
	  	myHTMLOutput += '<th>Date</th><th>Publisher</th><th>Title</th><th>Comments</th><th>Issue</th>';
	  	
		// Run the function for each student tag in the XML file
		$('comic',xml).each(function(i) {
			date = $(this).find("date").text();
			publisher = $(this).find("publisher").text();
			title = $(this).find("title").text();
			comments = $(this).find("comments").text();
			issue = $(this).find("issue").text();
			comicPost = $(this).find("date").attr("post"); 
			
			// Build row HTML data and store in string
			mydata = BuildComicHTML(date,publisher,title,comments,issue);
			myHTMLOutput = myHTMLOutput + mydata;
		});
		myHTMLOutput += '</table>';
		
		// Update the DIV called Content Area with the HTML string
		$("#ContentArea").append(myHTMLOutput);
	});
});
 
 
 
 function BuildComicHTML(date,publisher,title,comments,issue){
	
	// Check to see if their is a "post" attribute in the name field
	if ((comicPost) != undefined){
		comicPostHTML = "<strong>(" + comicPost + ")</strong>";
	}
	else
	{
		comicPostHTML = "";
	}
	
	// Build HTML string and return
	output = '';
	output += '<tr>';
	output += '<td>'+ date + comicPostHTML + '</td>';
	output += '<td>'+ publisher +'</td>';
	output += '<td>'+ title +'</td>';
	output += '<td>'+ comments +'</td>';
	output += '<td>'+ issue +'</td>';
	output += '</tr>';
	return output;
}
	 