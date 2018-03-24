var allMarkers = [JSON.parse(localStorage.rArr)][0];
var markers = [];
var map;
// Initialize the Map
function initMap(){
	var bounds = new google.maps.LatLngBounds();
	var ca = {lat: 34.052235, lng: -118.243683};
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
			var infowindow = new google.maps.InfoWindow({
				content: el.name
			});
			marker.addListener('click', function(){
				if (marker.getAnimation()) {
					marker.setAnimation(null);
				} 
				else {
					marker.setAnimation(google.maps.Animation.BOUNCE);
				}
				if (infowindow.getMap()) {
					infowindow.close()
				} 
				else {
					infowindow.open(map, marker);
				}
			});
			markers.push(marker);
		});
	}
	// Adjust the map zoom level so that all the markers are showing
	if (!bounds.isEmpty()){
		map.fitBounds(bounds);
	}
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
	}
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
			})
			removeMarkers(delMarkers, self.rList);
			loadMarkers(indexList(self.rList));
		}
		
	}

};

// Function to make a list of names from ko.observablearray
var indexList = function(list){
	var indexList = [];
	list().forEach(function(el){
		indexList.push(el.index);
	})
	return indexList;
}

// Function to load the filtered markers into the map and adjust bounds accordingly
var loadMarkers = function(iList){
	var bounds = new google.maps.LatLngBounds();
	for (var i =0; i < markers.length; i++){
		if(iList.includes(i)){
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
	})
};

// Function to remove markers from the ko.observablearray
var removeMarkers = function(mList, rList){
	mList.forEach(function(marker){
		rList.remove(marker);
	})
};

ko.applyBindings(new ViewModel());