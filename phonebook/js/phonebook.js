
function maybe(str, possibility) {
	possibility = possibility || 0.3;
	if (Math.random() < possibility) {
		return str;
	} else {
		return '';
	}
}

var NUM_LISTINGS = 8000;
var listings = [];

function populateListings() {
	for (var i = 0; i < NUM_LISTINGS; i++) {
		if (Math.random() < 0.7) {
			listings.push({
				class: 'listing', 
				last: faker.name.lastName(),
				first: faker.name.firstName(),
				address: faker.address.streetAddress() + ' ' + maybe(faker.address.zipCode()),
				tel: faker.phone.phoneNumberFormat().substr(4, 10)
			});
		} else {
			listings.push({
				last: faker.name.lastName(),
				class: 'listing-indented', 
				first: faker.name.firstName() + maybe(' & ' + faker.name.firstName()),
				tel: faker.phone.phoneNumberFormat().substr(4, 10),
				address: maybe(faker.address.streetAddress()),
				indented: true
			});
		}
	}

	listings = listings.sort(function(l1, l2) {
		return l1.last.localeCompare(l2.last);
	});
}

populateListings();


function updateDepth(book, newPage) {

	var page = book.turn('page'),
		pages = book.turn('pages'),
		depthWidth = 16*Math.min(1, page*2/pages);

		newPage = newPage || page;

	if (newPage>3)
		$('.sj-book .p2 .depth').css({
			width: depthWidth,
			left: 20 - depthWidth
		});
	else
		$('.sj-book .p2 .depth').css({width: 0});

		depthWidth = 16*Math.min(1, (pages-page)*2/pages);

	if (newPage<pages-3)
		$('.sj-book .p111 .depth').css({
			width: depthWidth,
			right: 20 - depthWidth
		});
	else
		$('.sj-book .p111 .depth').css({width: 0});

}

function generateHTML(page) {
	var result = $.Deferred();
	var start = (8000 / 112) * page;
	var pageListings = listings.slice(start, start + 162);

	var i = 0;
	var end;
	while (!end) {
		if (pageListings[pageListings.length - i] && pageListings[pageListings.length - i].last) {
			end = pageListings[pageListings.length - i].last.substr(0, 3);
		} else {
			i++;
		}
	}

	var starter;
	i = 0;
	while(!starter) {
		if (pageListings[i] && pageListings[i].last) {
			starter = pageListings[i];
		} else {
			i++;
		}
	}

	var context = {
		listings: pageListings,
		pageInfo: {
			number: page,
			letter: starter.last.substr(0, 1),
			range: starter.last.substr(0, 3) + '-' + end
		}
	};

	var source   = $("#entry-template").html();
	var template = Handlebars.compile(source);

	var html = template(context);
	setTimeout(function() {
		result.resolve(html);
	}, 0);

	return result;

}


function loadPage(page) {

	generateHTML(page).done(function(pageHtml) {
		$('.sj-book .p' + page).html(pageHtml);
	});

}

function addPage(page, book) {

	var id, pages = book.turn('pages');

	if (!book.turn('hasPage', page)) {

		var element = $('<div />', {
			class: 'own-size'
		}).html('<div class="loader"></div>');

		if (book.turn('addPage', element, page)) {
			loadPage(page);
		}

	}
}
