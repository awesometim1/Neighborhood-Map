var initialCats = [
	{
		clickCount : 0,
		growthStage : 'Infant',
		name : 'Tabby',
		imgSrc :'img/434164568_fea0ad4013_z.jpg',
		nicknames : ['kitty', 'bitty', 'witty', 'kitten', 'tabby']
	},
	{
		clickCount : 0,
		growthStage : 'Infant',
		name : 'Scaredy',
		imgSrc :'img/22252709_010df3379e_z.jpg',
		nicknames : ['Casper', 'scaredycat']
	},
	{
		clickCount : 0,
		growthStage : 'Infant',
		name : 'Shadow',
		imgSrc :'img/1413379559_412a540d29_z.jpg',
		nicknames : ['Shooby', 'Shady']
	},

]


var Cat = function(data){

	this.clickCount = ko.observable(data.clickCount);
	this.name = ko.observable(data.name);
	this.nicknames = ko.observableArray(data.nicknames);
	this.imgSrc = ko.observable(data.imgSrc);
	this.growthStage = ko.observable(data.growthStage);

	this.checkGrowth = function(){
		if (this.clickCount() <10){
			this.growthStage('Infant')
		}
		else if (this.clickCount() < 50){
			this.growthStage('Child')
		}
		else if (this.clickCount() < 75){
			this.growthStage('Teen');
		}
		else if (this.clickCount() < 100){
			this.growthStage('Adult');
		}

	}
}
var ViewModel = function(){

	var self = this;

	this.catList = ko.observableArray([]);

	initialCats.forEach(function(catItem){
		self.catList.push( new Cat(catItem));
	})
	this.currentCat = ko.observable(this.catList()[0]);

	this.setCat = function(clickedCat){
		console.log("HI");
		self.currentCat(clickedCat);
	}
	this.incrementCounter = function(){
		this.clickCount(this.clickCount() + 1);
		this.checkGrowth();
	}
	
}

ko.applyBindings(new ViewModel());