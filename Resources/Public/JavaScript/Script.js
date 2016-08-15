/***************************************************************
 *  Copyright (C) 2016 punkt.de GmbH
 *  Authors: Christoph Heidenreich
 *
 *  This script is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 ***************************************************************/

jQuery(document).ready(function() {
	var $ = jQuery;

	function replaceContentWith(html) {
		$('#replace-container').replaceWith(html);
	}

	function setMenuActiveStateForId(id) {
		$('#menu li').removeClass('active');
		$('#' + id).parent().addClass('active');
	}

	function setCurrentPage(replacementHtml, activeLinkId) {
		replaceContentWith(replacementHtml);
		setMenuActiveStateForId(activeLinkId);
	}



	//--------------------------------------------------------------------------
	// handle history.back functionality in event
	// replace html and set active menu to restore dynamic made changes on page
	//--------------------------------------------------------------------------
	window.addEventListener('popstate', function(event) {
		if (event.state !== null && event.state !== undefined) {
			setCurrentPage(event.state.html, event.state.activeLinkId);
		}
	});



	//--------------------------------------------------------------------------
	// replace content on click and remember the changes in browser history
	//--------------------------------------------------------------------------
	$('#menu a').each(function() {
		$(this).click(function() {
			var activeLinkId = $(this).attr('id');

			$.ajax({
				method: "GET",
				url: $(this).data('url'),
				dataType: "HTML"
			})
			.done(function(html) {
				var dataObject = {
					html: html,
					activeLinkId: activeLinkId
				};

				// this will add a new entry for the browser history like it would happen if you
				// click on a hyperlink on the page with additional information we can use for our likes
				history.pushState(dataObject, null, window.location);

				setCurrentPage(html, activeLinkId);
			});
		});
	});



	//--------------------------------------------------------------------------
	// handling of first load of the page and
	// jumping back from some other url for example with the impress link
	//--------------------------------------------------------------------------
	if (history.state === null || history.state === undefined) {
		// store current page state in the current history
		var dataObject = {
			html: jQuery('#replace-container').wrap('<pseudo/>').parent().html(),
			activeLinkId: ''
		};

		// this replaces the current browser history entry with information (html and current active menu id)
		// we use in your popstate event to handle the state of the page on history navigation
		history.replaceState(dataObject, null, window.location);
	} else {
		// set the page state by given information from the history state
		setCurrentPage(history.state.html, history.state.activeLinkId);
	}

});
