/*
Chris's Photo Explorer: app.js
Chris Slaight, 2015
JavaScript/jQuery/AJAX logic to search, retrieve and display posts from Instagram JSON objects
*/

var currentAuthToken; //Global variable to hold current Auth Token from IG API

//On document load
$(document).ready(function(){

	var returnedURL = window.location.href; //Var to store the current URL
	currentAuthToken = getAuthCodeFromURL(returnedURL); //Strip out Auth Token from URL (function below)
	
	console.log("Instagram Access Token is: " + currentAuthToken); //Debug: display current Token value
	
	$('#submit-date-range').submit(function(event){
		event.preventDefault(); //Prevent page refresh onsubmit
		var selectedDate = $('#photo-datepicker').datepicker("getDate"); //Get date value from date picker
		var tomorrow = new Date(selectedDate.getTime() + 24*60*60*1000); //Create second var to hold selected date + 1 day

		var selectedDateUNIX = selectedDate / 1000; //Convert selected date to UNIX time
		var tomorrowUNIX = tomorrow / 1000; //Convert tomorrow date to UNIX time

		//Debug code to display current selected timestamp information
		console.log("Selected Date " + selectedDate);
		console.log("Date tomorrow " + tomorrow);
		console.log("Selected Date UNIX " + selectedDateUNIX);
		console.log("Date tomorrow UNIX " + tomorrowUNIX);

		getPhotoJSON(currentAuthToken,selectedDateUNIX,tomorrowUNIX); //Pass auth token and dates to getPhotoJSON function
	});

});

//Function that takes the URL parameter, strips out and returns the authorization token
function getAuthCodeFromURL(variable)
{
    var begin = variable.indexOf('=') + 1;
    var end = variable.length;
    var accessToken = variable.substring(begin, end);
    return accessToken;
}


//Function that takes auth token and timestamps to update the DOM with returned photos
function getPhotoJSON(currentToken, minStamp, maxStamp) {
	//Define request object with AJAX call parameters
	var request = {access_token: currentToken,
		min_timestamp: minStamp,
		max_timestamp: maxStamp,
		count: 20};
	
	//AJAX call to Instagram API endpoint
	var result = $.ajax({
		url: "https://api.instagram.com/v1/users/self/media/recent",
		data: request,
		dataType: "jsonp",
		type: "GET",
		}) //Once this call is finished, execute the following
	.done(function(result){
		var html = ''; //Define HTML variable to hold photo div elements
		if(result.data.length == 0) //If no photos are returned
		{
			$('.no-photos').show(); //Show no-photos div
		}
		else //Otherwise
		{
			$('.no-photos').hide(); //Hide no-photos div
		} //Next, iterate through result set
		$.each(result.data, function(i, item){
			console.log(item); //Debug: output JSON object to console
			html += '<div class="photo">'; //Begin photo div
			html += '<a href="' + item.link + '" target="newtab"><img src =' + item.images.thumbnail.url + '></a>'; //Thumbnail link to IG page
			html += '<p class="caption">Click image to view in Instagram.</p>'; //Caption under thumbnail
			html += '<p>' + item.caption.text + '</p>'; //Display photo caption text
			html += '<p>' + item.likes.count + ' likes.</p>'; //Display number of likes for photo
			html += '</div>'; //Close div
		});
		$('.photo-container').html(html); //Update the DOM photo-container class to include these elements
	})
}