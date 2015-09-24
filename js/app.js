var currentAuthToken;

$(document).ready(function(){

	var returnedURL = window.location.href;
	currentAuthToken = getAuthCodeFromURL(returnedURL);
	var minTimeStamp;
	var maxTimeStamp;

	console.log("Instagram Access Token is: " + currentAuthToken);
	/*
	$('#log-out-link').on('click tap', function() {
		currentAuthToken = "";
		logOutOfIG();
		window.location.replace("login.html");
	});
	*/

	$('#submit-date-range').submit(function(event){
		event.preventDefault();
		console.log("Button works!");

		//console.log("Min date is " + $('#min-datepicker').datepicker("getDate") / 1000);
		//minTimeStamp = $('#min-datepicker').datepicker("getDate") / 1000;
		//console.log("Max date is " + $('#max-datepicker').datepicker("getDate") / 1000);
		//maxTimeStamp = $('#max-datepicker').datepicker("getDate") / 1000;
		/*
		var selectedDate = $('#photo-datepicker').datepicker("getDate");
		var yesterday = new Date(selectedDate.getTime() - 24*60*60*1000);

		var selectedDateUNIX = selectedDate / 1000;
		var yesterdayUNIX = yesterday / 1000;

		console.log("Selected Date " + selectedDate);
		console.log("Date before " + yesterday);

		console.log("Selected Date UNIX " + selectedDateUNIX);
		console.log("Date before UNIX " + yesterdayUNIX);
		*/
		var selectedDate = $('#photo-datepicker').datepicker("getDate");
		var tomorrow = new Date(selectedDate.getTime() + 24*60*60*1000);

		var selectedDateUNIX = selectedDate / 1000;
		var tomorrowUNIX = tomorrow / 1000;

		console.log("Selected Date " + selectedDate);
		console.log("Date tomorrow " + tomorrow);

		console.log("Selected Date UNIX " + selectedDateUNIX);
		console.log("Date tomorrow UNIX " + tomorrowUNIX);


		getPhotoJSON(currentAuthToken,selectedDateUNIX,tomorrowUNIX);
	});

});

/*
function logOutOfIG() {
	$.get('http://instagram.com/accounts/logout/');
}
*/

function getAuthCodeFromURL(variable)
{
    var begin = variable.indexOf('=') + 1;
    var end = variable.length;
    var accessToken = variable.substring(begin, end);
    return accessToken;
}

function getPhotoJSON(currentToken, minStamp, maxStamp) {
	var request = {access_token: currentToken,
		min_timestamp: minStamp,
		max_timestamp: maxStamp,
		count: 20};
	
	var result = $.ajax({
		url: "https://api.instagram.com/v1/users/self/media/recent",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		//var searchResults = showSearchResults(request.tagged, result.items.length);

		//$('.search-results').html(searchResults);

		var html = '';
		if(result.data.length == 0)
		{
			$('.no-photos').show();
		}
		else
		{
			$('.no-photos').hide();
		}
		$.each(result.data, function(i, item){
			console.log(item);
			html += '<div class="photo">';
			html += '<a href="' + item.link + '" target="newtab"><img src =' + item.images.thumbnail.url + '></a>';
			html += '<p class="caption">Click image to view in Instagram.</p>';
			html += '<p>' + item.caption.text + '</p>';
			html += '<p>' + item.likes.count + ' likes.</p>';
			html += '</div>';
		});
		//html += '<a href="' + result.pagination.next_url + '">Next Result Set</a>';
		$('.photo-container').html(html);
	})
}