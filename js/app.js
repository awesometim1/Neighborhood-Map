var allMarkers = [JSON.parse(localStorage.rArr)][0];
var markers = [];
var map;
// Initialize the Map
function initMap(){
	var bounds = new google.maps.LatLngBounds();
	var ca = {lat: 34.052235, lng: -118.243683};
	// Index for keeping track of which marker to add click listener to in callback function
	var index = 0;
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 12,
		center: ca
	});
	// If localStorage has the address array, make a marker for each address and add to bounds
	if (localStorage.rArr){
		JSON.parse(localStorage.rArr).forEach(function(el){
			var marker = new google.maps.Marker({
				position: el.position,
				map: map
			});
			bounds.extend(marker.getPosition());
			//Make the ajax request
			foursquareJSON(marker.getPosition().lat(), marker.getPosition().lng(), index);
			markers.push(marker);
			index++;
		});
	}
	// Adjust the map zoom level so that all the markers are showing
	if (!bounds.isEmpty()){
		map.fitBounds(bounds);
	}
}

// Ajax request to the Foursquare API to obtain venue information.
var foursquareJSON = function(lat,lng,index){
	var self = this;

	var url = "https://api.foursquare.com/v2/venues/search?ll=";
	url+=lat+","+lng;
	url+="&client_id=WWPUQU1YXSKSZMYZ3LHTJRGHNIZMVN04AC3WDUZKFHTL3QT0";
	url+="&client_secret=BN0JICWRHSLLR1Z1TFQTW2V2APW2MJ43SVIB30HQW1TB12C2";
	url+="&v=20180323";
	$.ajax({
		type: "GET",
		url: url,
		dataType: "json"
	}).done(function(data){
		let info = data.response.venues[0];
		var content = "<div>" + info.name + "</div>" + "<div>"+ info.location.formattedAddress + "</div>" + "<div>" + info.url + "</div>";
		callback(content,index);
	}).fail(function(data){
		console.log('Error:' + data.status + ' ' + data.statusText);
		var content = '<div>Unable to access FourSquare API</div>';
		callback(content,index);
	});

};

// Callback function for the async requests. Builds the click listeners on the Markers
function callback(cont,ind){
	var marker = markers[ind];
	var infowindow = new google.maps.InfoWindow({
		content: cont
	});
	marker.addListener('click', function(){
		if (marker.getAnimation()) {
			marker.setAnimation(null);
		}
		else {
			marker.setAnimation(google.maps.Animation.BOUNCE);
		}
		if (infowindow.getMap()) {
			infowindow.close();
		}
		else {
			infowindow.open(map, marker);
		}
	});
}

var ListItem = function(marker, index){

	var self = this;

	this.name = ko.observable(marker.name);
	this.index = index;

	this.toggleClick = function(){
		var marker = markers[self.index];
		if (marker.getAnimation()) {
			marker.setAnimation(null);
		}
		else {
			marker.setAnimation(google.maps.Animation.BOUNCE);
		}
	};
};

var ViewModel = function(){

	var self = this;

	this.rList = ko.observableArray([]);

	insMarkers(self.rList);

	// Function to filter the list. Makes use of external functions loadMarkers, insMarkers, and removeMarkers
	this.filterList = function(name){
		var inputBox = document.getElementById("finput").value;
		if (inputBox.length < 1){
			insMarkers(self.rList);
			loadMarkers(self.rList);
		}
		else{
			var delMarkers = [];
			insMarkers(self.rList);
			self.rList().forEach(function(marker){
				if (marker.name().indexOf(inputBox) == -1){
					delMarkers.push(marker);
				}
			});
			removeMarkers(delMarkers, self.rList);
			loadMarkers(indexList(self.rList));
		}

	};

};

// Function to make a list of names from ko.observablearray
var indexList = function(list){
	var indexList = [];
	list().forEach(function(el){
		indexList.push(el.index);
	});
	return indexList;
};

// Function to load the filtered markers into the map and adjust bounds accordingly
var loadMarkers = function(iList){
	var bounds = new google.maps.LatLngBounds();
	for (var i =0; i < markers.length; i++){
		if(iList.length < 1 || iList.includes(i)){
			markers[i].setVisible(true);
			bounds.extend(markers[i].getPosition());
		}
		else{
			markers[i].setVisible(false);
		}
	}
	// Adjust the map zoom level so that all the markers are showing
	if (!bounds.isEmpty()){
		map.fitBounds(bounds);
	}

};

// Function to insert markers into the ko.observablearray
var insMarkers = function(list){
	list.removeAll();
	var index = 0;
	allMarkers.forEach(function(marker){
		list.push(new ListItem(marker,index));
		index++;
	});
};

// Function to remove markers from the ko.observablearray
var removeMarkers = function(mList, rList){
	mList.forEach(function(marker){
		rList.remove(marker);
	});
};

ko.applyBindings(new ViewModel());