var liArr = [];
var map;
var infowindow;
// Initialize the Map
function initMap(){

	var bounds = new google.maps.LatLngBounds();
	var ca = {lat: 34.052235, lng: -118.243683};
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 12,
		center: ca
	});
	//Initialize infowindow
	infowindow = new google.maps.InfoWindow({
		content: "Empty"
	});
	// If localStorage has the address array, make a marker for each address and add to bounds
	if (localStorage.rArr){
		JSON.parse(localStorage.rArr).forEach(function(el){
			var marker = new google.maps.Marker({
				position: el.position,
				map: map
			});
			bounds.extend(marker.getPosition());
			//Make a ListItem object for each marker and store the marker object to it
			liArr.push(new ListItem(el, marker));
		});
	}
	// Adjust the map zoom level so that all the markers are showing
	if (!bounds.isEmpty()){
		map.fitBounds(bounds);
	}
	loadMarkers(liArr);
}

// Ajax request to the Foursquare API to obtain venue information.
var foursquareJSON = function(lat,lng,liObj){

	var content = "";
	var url = "https://api.foursquare.com/v2/venues/search?ll=";
	url+=lat+","+lng;
	url+="&client_id=WWPUQU1YXSKSZMYZ3LHTJRGHNIZMVN04AC3WDUZKFHTL3QT0";
	url+="&client_secret=BN0JICWRHSLLR1Z1TFQTW2V2APW2MJ43SVIB30HQW1TB12C2";
	url+="&v=20180323";
	//ajax call to get the data and send it to a callback function
	$.ajax({
		type: "GET",
		url: url,
		dataType: "json"
	}).done(function(data){
		let info = data.response.venues[0];
		content = "<div>" + info.name + "</div>" + "<div>"+ info.location.formattedAddress + "</div>" + "<div>" + info.url + "</div>";
		callback(content,liObj);
	}).fail(function(data){
		console.log('Error:' + data.status + ' ' + data.statusText);
		content = '<div>Unable to access FourSquare API</div>';
		callback(content,liObj);
	});

};

// Callback function for the async requests. Sets content for ListItem Object and opens infowindow accordingly
function callback(cont,liObj){

	liObj.content = cont;
	infowindow.setContent(liObj.content);
	infowindow.open(map, liObj.marker);
}

var ListItem = function(marker, mObj){

	var self = this;

	self.name = ko.observable(marker.name);
	self.marker = mObj;
	self.content = "";

	//Add click listener to the marker doing two things: 1. open infowindow 2. set animation
	self.marker.addListener('click', function(){
		if (self.content.length < 1){
			foursquareJSON(self.marker.getPosition().lat(), self.marker.getPosition().lng(), self);
		}
		else{
			infowindow.setContent(self.content);
			infowindow.open(map, self.marker);
		}
		let marker = self.marker;
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function(){
			marker.setAnimation(null);
		}, 500);
	});


};

ListItem.prototype.toggleClick = function() {

	var self = this;

	google.maps.event.trigger(self.marker, 'click')

};

var ViewModel = function(){

	var self = this;

	self.vmList = ko.observableArray([]);

	self.textVal = ko.observable("");

	self.textVal.subscribe(function(){
		self.filterList();
	})

	// Function to filter the list. Makes use of external functions loadMarkers, insMarkers, and removeMarkers
	self.filterList = function(){
		let textVal = self.textVal();
		insList(self.vmList);
		if (textVal.length > 0){
			for (var i = self.vmList().length-1; i >= 0; i--){
				if (self.vmList()[i].name().toLowerCase().indexOf(textVal.toLowerCase()) < 0){
					self.vmList.remove(self.vmList()[i]);
				}
			}
		}
		loadMarkers(self.vmList);

	};

};

//Instantiate Markers
var insList = function(list){

	list.removeAll();
	liArr.forEach(function(li){
		list.push(li);
	});
};


// Function to load the filtered markers into the map and adjust bounds accordingly
function loadMarkers(list){

	var bounds = new google.maps.LatLngBounds();
	liArr.forEach(function(el){
		if (list.indexOf(el) >= 0){
			el.marker.setVisible(true);
			bounds.extend(el.marker.getPosition());
		}
		else {
			el.marker.setVisible(false);
		}
	});
	// Adjust the map zoom level so that all the markers are showing
	if (!bounds.isEmpty()){
		map.fitBounds(bounds);
	}
	if(app.viewModel.vmList().length < 1){
		if(app.viewModel.textVal().length < 1){
			insList(app.viewModel.vmList);
		}
	}

}
//Google maps api error handler
function googleError(){
			alert("Google Map API could not be loaded.")
		}

var app = { viewModel: new ViewModel() };
ko.applyBindings(app.viewModel);