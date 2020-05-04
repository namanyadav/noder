const users = require('./users');
const events = require('./events');
const eventsData = require('../com/rsvp/data/events');
const path = require('path');
const usersData = require('../data/users');

const constructorMethod = (app) => {
	app.use('/users', users);
	app.use('/events', events);
	app.get('/changePassword', (req, res) => {
		res.render('changePassword', 
		{
			userID: req.query.id
		  });
	});
	app.get('/signup', (req, res) => {
		res.render('signup');
	});
	app.get('/forgotPassword', (req, res) => {
		res.render('forgotPassword');
	});
	app.get('/login', (req, res) => {
		res.render('login');
	});
	app.get('/', async (req, res) => {
		// let eventList = await eventsData.getAll();
		let cats = eventsData.cats;
		let event1 = { organizer: 'sergio', title: 'Heist of the royal mint of Spain', category: cats.music, isPaid: false, cost: 0, sDate: 'April 15, 2020 9:05 AM',
			eDate: 'April 16, 2020 9:05 AM', desc: 'desf', capacity: 74, pricing: 'free', stAddr: '123 Jack St', state: 'NJ', country: 'US'};
		let event2 = { organizer: 'berlin', title: 'Printing money at the royal mint', category: cats.foodndrinks, isPaid: true, cost: 10, sDate: 'April 15, 2020 9:05 AM',
			eDate: 'May 12, 2020 2:05 AM', desc: 'desf asdf', capacity: 10, pricing: 'paid', stAddr: '123 Jack St', state: 'NJ', country: 'US'};
		let event3 = { organizer: 'denver', title: 'Stealing money from Bank of Spain', category: cats.artsnculture, isPaid: false, cost: 100, sDate: 'April 15, 2020 9:05 AM',
			eDate: 'June 1, 2020 3:05 PM', desc: 'lorem ipsum', capacity: 100, pricing: 'paid', stAddr: '123 Jack St', state: 'NJ', country: 'US'};
		let event4 = { organizer: 'salva', title: 'Plannig for the heist', category: cats.sportsnwellness, isPaid: false, cost: 0, sDate: 'April 15, 2020 9:05 AM',
			eDate: 'April 26, 2020 4:05 PM', desc: 'desf', capacity: 34, pricing: 'free', stAddr: '123 Jack St', state: 'NJ', country: 'US'};
		let event5 = { organizer: 'rio', title: 'Bogotta site training', category: cats.artsnculture, isPaid: true, cost: 30, sDate: 'April 15, 2020 9:05 AM',
			eDate: 'April 22, 2020 5:05 AM', desc: 'desf', capacity: 734, pricing: 'paid', stAddr: '123 Jack St', state: 'NJ', country: 'US'};
		let event6 = { organizer: 'sergio', title: 'Museum visit and planning', category: cats.sportsnwellness, isPaid: false, cost: 0, sDate: 'April 15, 2020 9:05 AM',
			eDate: 'April 21, 2020 6:05 PM', desc: 'desf', capacity: 746, pricing: 'free', stAddr: '123 Jack St', state: 'NJ', country: 'US'};
		let event7 = { organizer: 'sergio', title: 'Setup broadcast mechanism', category: cats.music, isPaid: false, cost: 0, sDate: 'April 15, 2020 9:05 AM',
			eDate: 'May 10, 2020 9:50 AM', desc: 'desf', capacity: 7, pricing: 'free', stAddr: '123 Jack St', state: 'NJ', country: 'US'};
		let event8 = { organizer: 'tokyo', title: 'Setup supply chain', category: cats.sportsnwellness, isPaid: true, cost: 20, sDate: 'April 15, 2020 9:05 AM',
			eDate: 'June 2, 2020 10:05 AM', desc: 'desf', capacity: 200, pricing: 'paid', stAddr: '123 Jack St', state: 'NJ', country: 'US'};
		let event9 = { organizer: 'sergio', title: 'Heist of the royal mint of Spain', category: cats.foodndrinks, isPaid: false, cost: 0, sDate: 'April 15, 2020 9:05 AM',
			eDate: 'June 3, 2020 9:05 AM', desc: 'desf', capacity: 30, pricing: 'free', stAddr: '123 Jack St', state: 'NJ', country: 'US'};
		let event10 = { organizer: 'salva', title: 'Heist of the royal mint of Spain', category: cats.music, isPaid: false, cost: 0, sDate: 'April 15, 2020 9:05 AM',
			eDate: 'May 6, 2020 11:05 PM', desc: 'desf', capacity: 24, pricing: 'free', stAddr: '123 Jack St', state: 'NJ', country: 'US'};
		let eventList = {event1, event2, event3, event4, event5, event6, event7, event8, event9, event10}

		let user = req.session ? req.session.user : undefined;
		user && console.log(`userin session: ${user.email}`)
		// let catEventList = await eventsData.getEventsOfCategories([eventsData.cats.music, eventsData.cats.artsnculture]);
		res.render('home', {eventList: eventList, isSearch: true, loggedInUser: user, catLabels: eventsData.cat_labels})
		// res.sendFile('/public/html/index.html')
	});
	app.get('/search', async (req, res) => {
		let cats = req.query.cats;
		let catList = [];
		if(cats) {
			cats = cats.trim();
			cats = cats.replace('[','').replace(']','');
			catList = cats.split(',')
		}
		// console.log(catList);
		let eventList = await eventsData.getEventsOfCategories(catList);
		// console.log(eventList);
		// res.json(eventList);
		res.render('partials/home_event_panel', {eventList: eventList, isSearch:true})
	});

	app.get('/search/events', async (req, res) =>{
		let squery = req.query.squery;
		let event = await eventsData.searchEvents(squery)
		console.log(event)
		res.json(event)
	})

	app.get('/details', async (req, res) => {
		//console.log(req.body.title)
		let user = req.session ? req.session.user : undefined;
		try{
			const data = await eventsData.getEvent(req.query.id);
	
		res.render('details',{
			event: data,
			userId: user._id
		  });
		}
		catch (e) {
			res.status(400).json({error: e});
		}
	});
	app.get('/details/ticket.pdf', async (req, res) => {
		console.log("userId:"+req.query.userId)
		try{
			const data = await eventsData.getEvent(req.query.id);
			const userData = await usersData.getUser(req.query.userId);
		res.render('ticket',{
			event: data,
			user: userData,
			isTicket:true
		  });
		}
		catch (e) {
			res.status(400).json({error: e});
		}
	});
	app.use("*", (req, res) => {
		res.status(404).json({ error: "Not found" });
	  });

};

module.exports = constructorMethod;