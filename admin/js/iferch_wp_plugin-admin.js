(function ($) {
	'use strict';

	/**
	 * All of the code for your admin-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */
})(jQuery);

const url = 'https://www.iferch.com/api/v1';
let apiKey = '';
let serviceId = '';

let platlng = new Object();
let dlatlng = new Object();
let vehicleTypeSelect = null;
let packageTypeSelect = null;
let selectedVehicleType = 0;
let selectedPackageType = 0;
let pickupAdded = false;
let dropOffAdded = false;
let selectedRecipientCountryCode = '233';
let selectedPickupCountryCode = '233';
let pickupPhone = '';
let recipientPhone = '';
let iti_pickup = null;
let iti_recipient = null;
let is_iferch_single = false;
let is_iferch_multi = false;
let iferch_ajax_loader = null;
let iferch_message_box = null;
let time = 3000;
let selectedTime = null;
let recipientName = '';
let deliveryMessage = '';
let packageDetails = '';
let pickupMessage = '';
let pickupTimeValid = false;
let is_upcoming = false;
let is_history = false;
let first_run = true;
let is_ongoing = false;
let is_multi_delivery = false;
let iferch_multi_modal_body = null;
let multi_recipient_name = new Object();
let multi_mobile_number = new Object();
let multi_package_type_id = new Object();
let multi_delivery_ins = new Object();
const multi_delivery_drop_off = [];
const multi_delivery_drop_off_for_estimate = [];
let multi_delivery_form_save_btn = null;
let is_edit_form = false;
let payby = 'Sender';
let totalAmtMulti = 0;

document.addEventListener('DOMContentLoaded', function () {
	iferch_ajax_loader = document.getElementById('iferch-ajax-loader');
	iferch_message_box = document.getElementById('iferch-message-box');

	if (document.getElementById('iferch-single')) {
		is_iferch_single = true;
	}

	if (document.getElementById('iferch-upcoming')) {
		is_upcoming = true;
	}

	if (document.getElementById('iferch-history')) {
		is_history = true;
	}

	if (document.getElementById('iferch-ongoing')) {
		is_ongoing = true;
	}

	if (document.getElementById('iferch-multi')) {
		is_multi_delivery = true;
	}

	if (is_iferch_single) {
		callIFerchSingleDeliveryOnLoad();
	}

	if (is_multi_delivery) {
		document
			.getElementById('open-iferch-multi-modal')
			.addEventListener('click', (evt) => {
				multi_delivery_form_save_btn.disabled = true;
				showMultiDeliveryModal();
			});

		document
			.getElementById('iferch-multi-close-btn')
			.addEventListener('click', (evt) => {
				hideMultiDeliveryModal();
			});

		document
			.getElementById('iferch-close-tbn')
			.addEventListener('click', (evt) => {
				resetMultiDeliveryFormFields();
				hideMultiDeliveryModal();
			});

		document
			.getElementById('iferch-multi-form')
			.addEventListener('submit', (evt) => {
				evt.preventDefault();
				//
				getInputFormMultiModal();
			});

		vehicleTypeSelect = document.getElementById('iferch-vehicletype');

		vehicleTypeSelect.addEventListener('change', (evt) => {
			selectedVehicleType = evt.target.value;

			if (pickupAdded && dropOffAdded && selectedVehicleType != 0) {
				estimateFareMulti();
			}
		});

		iferch_multi_modal_body = document.getElementById(
			'iferch-multi-modal-body'
		);
		multi_delivery_form_save_btn = document.getElementById(
			'iferch-multi-save-btn'
		);
		multi_delivery_form_save_btn.disabled = true;

		document.getElementById('iferch-show-only-when').hidden = true;
		document.getElementById('payment-box-2').hidden = true;

		document.getElementById('multi-form-submit').hidden = true;

		document.getElementById('iferch-receiver-box').hidden = true;
	}
});

document.addEventListener('readystatechange', (event) => {
	// if (event.target.readyState === "interactive") {

	// }

	if (event.target.readyState === 'complete') {
		if (is_iferch_single) {
			callIFerchSingleDeliveryOnComplete();
		}

		if (is_upcoming) {
			callIferchUpcomingOnComplete();
		}

		if (is_history) {
			fetchHistory(1);
		}

		if (is_ongoing) {
			fetchOngoing();
		}

		if (is_multi_delivery) {
			callIFerchMultiDeliveryOnComplete();
		}
	}
});

function showMultiDeliveryModal() {
	$('#iferch-multi-myModal').modal('show');
}

function hideMultiDeliveryModal() {
	$('#iferch-multi-myModal').modal('hide');
}

function autocomplete(inp, type) {
	/*the autocomplete function takes two arguments,
	the text field element and an array of possible autocompleted values:*/
	var currentFocus;

	/*execute a function when someone writes in the text field:*/
	inp.addEventListener('input', async function (e) {
		var a,
			b,
			i,
			val = this.value;

		if (type == 'pickup') {
			pickup_changed = true;
		} else if (type == 'destination') {
			destination_changed = true;
		}

		/*close any already open lists of autocompleted values*/
		closeAllLists();

		if (!val) {
			return false;
		}

		const arr = await searchLocation(val.trim());

		currentFocus = -1;
		/*create a DIV element that will contain the items (values):*/
		a = document.createElement('DIV');
		a.setAttribute('id', this.id + 'iferch-autocomplete-list');
		a.setAttribute('class', 'iferch-autocomplete-items');
		/*append the DIV element as a child of the autocomplete container:*/
		this.parentNode.appendChild(a);
		/*for each item in the array...*/
		for (i = 0; i < arr.length; i++) {
			/*check if the item starts with the same letters as the text field value:*/
			if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				/*create a DIV element for each matching element:*/
				b = document.createElement('DIV');
				/*make the matching letters bold:*/
				b.innerHTML = '<strong>' + arr[i].substr(0, val.length) + '</strong>';
				b.innerHTML += arr[i].substr(val.length);
				/*insert a input field that will hold the current array item's value:*/
				b.innerHTML += "<input  type='hidden' value='" + arr[i] + "'>";

				/*execute a function when someone clicks on the item value (DIV element):*/
				b.addEventListener('click', async function (e) {
					latlng = await fetchCoordinates(e.target.textContent);

					if (type == 'pickup') {
						platlng = latlng;
						pickupAdded = true;
					} else if (type == 'destination') {
						dlatlng = latlng;
						dropOffAdded = true;

						if (multi_delivery_form_save_btn != null)
							multi_delivery_form_save_btn.disabled = false;
					}

					if (pickupAdded && dropOffAdded && !is_multi_delivery) {
						estimateFare();
					}

					if (
						pickupAdded &&
						dropOffAdded &&
						is_multi_delivery &&
						multi_delivery_drop_off_for_estimate.length > 1
					) {
						estimateFareMulti();
					}

					/*insert the value for the autocomplete text field:*/
					inp.value = this.getElementsByTagName('input')[0].value;
					/*close the list of autocompleted values,
					(or any other open lists of autocompleted values:*/

					closeAllLists();
				});
				a.appendChild(b);
			}
		}
	});
	/*execute a function presses a key on the keyboard:*/
	inp.addEventListener('keydown', function (e) {
		var x = document.getElementById(this.id + 'iferch-autocomplete-list');
		if (x) x = x.getElementsByTagName('div');
		if (e.keyCode == 40) {
			/*If the arrow DOWN key is pressed,
			increase the currentFocus variable:*/
			currentFocus++;
			/*and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 38) {
			//up
			/*If the arrow UP key is pressed,
			decrease the currentFocus variable:*/
			currentFocus--;
			/*and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 13) {
			/*If the ENTER key is pressed, prevent the form from being submitted,*/
			e.preventDefault();
			if (currentFocus > -1) {
				/*and simulate a click on the "active" item:*/
				if (x) x[currentFocus].click();
			}
		}
	});

	function addActive(x) {
		/*a function to classify an item as "active":*/
		if (!x) return false;
		/*start by removing the "active" class on all items:*/
		removeActive(x);
		if (currentFocus >= x.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = x.length - 1;
		/*add class "autocomplete-active":*/
		x[currentFocus].classList.add('iferch-autocomplete-active');
	}

	function removeActive(x) {
		/*a function to remove the "active" class from all autocomplete items:*/
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove('iferch-autocomplete-active');
		}
	}

	function closeAllLists(elmnt) {
		/*close all autocomplete lists in the document,
		except the one passed as an argument:*/
		var x = document.getElementsByClassName('iferch-autocomplete-items');
		for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != inp) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}
	/*execute a function when someone clicks in the document:*/
	document.addEventListener('click', function (e) {
		closeAllLists(e.target);
	});
}

function searchLocation(keyword) {
	serviceId = document.getElementById('iferch_serviceId').value;
	apiKey = document.getElementById('iferch_apikey').value;

	const options = {
		headers: {
			'Content-Type': 'application/json',
			ApiKey: apiKey,
			serviceId: serviceId,
		},
		method: 'GET',
	};

	const word = keyword; //replaceAll(keyword, " ", "^");

	return new Promise((resolve, reject) => {
		fetch(`${url}/suggestions?query=${word}`, options)
			.then((res) => res.json())
			.then((data) => {
				resolve(data);
			})
			.catch((err) => {
				showErrorMessage('Unable to get suggestions');
				setTimeout(() => {
					hideErrorMessage();
				}, time);
				reject(err);
			});
	});
}

function fetchCoordinates(address) {
	serviceId = document.getElementById('iferch_serviceId').value;
	apiKey = document.getElementById('iferch_apikey').value;

	const options = {
		headers: {
			'Content-Type': 'application/json',
			ApiKey: apiKey,
			serviceId: serviceId,
		},
		method: 'GET',
	};
	const word = address; //replaceAll(address, " ", "^");
	return new Promise((resolve, reject) => {
		fetch(`${url}/precise?query=${word}`, options)
			.then((res) => res.json())
			.then((data) => {
				if (data.status == 200) {
					resolve(data.location);
				} else {
					showErrorMessage(data.message);
					setTimeout(() => {
						hideErrorMessage();
					}, time);

					reject(data.message);
				}
			})
			.catch((err) => {
				showErrorMessage('An error occurred');
				setTimeout(() => {
					hideErrorMessage();
				}, time);

				reject(err);
			});
	});
}

function getVehicleTypes() {
	serviceId = document.getElementById('iferch_serviceId').value;
	apiKey = document.getElementById('iferch_apikey').value;

	const options = {
		headers: {
			'Content-Type': 'application/json',
			ApiKey: apiKey,
			serviceId: serviceId,
		},
		method: 'GET',
	};

	showLoader();
	fetch(`${url}/vehicletypes`, options)
		.then((res) => res.json())
		.then((data) => {
			hideLoader();
			if (data.status == 200) {
				const vehicles = data.vehicles;

				let str = `<option value="0">Select vehicle type</option>`;

				vehicles.forEach((one) => {
					str += `<option value="${one.vehicleId}">${one.vehicleType}</option>`;
				});
				vehicleTypeSelect.innerHTML = str;
			} else {
				showErrorMessage(data.message);
				setTimeout(() => {
					hideErrorMessage();
				}, time);
			}
		})
		.catch((err) => {
			hideLoader();
			showErrorMessage('Could not get vehicle types');
			setTimeout(() => {
				hideErrorMessage();
			}, time);
		});
}

function getPackageTypes() {
	serviceId = document.getElementById('iferch_serviceId').value;
	apiKey = document.getElementById('iferch_apikey').value;

	const options = {
		headers: {
			'Content-Type': 'application/json',
			ApiKey: apiKey,
			serviceId: serviceId,
		},
		method: 'GET',
	};

	fetch(`${url}/packagetype`, options)
		.then((res) => res.json())
		.then((data) => {
			if (data.status == 200) {
				const packages = data.packages;

				let str = `<option value="0">Select package type</option>`;

				packages.forEach((one) => {
					str += `<option value="${one.packageTypeId}">${one.packageName}</option>`;
				});
				packageTypeSelect.innerHTML = str;
			} else {
				showErrorMessage(data.message);
				setTimeout(() => {
					hideErrorMessage();
				}, time);
			}
		})
		.catch((err) => {
			showErrorMessage('Unable to get package types');
			setTimeout(() => {
				hideErrorMessage();
			}, time);
		});
}

function estimateFare() {
	serviceId = document.getElementById('iferch_serviceId').value;
	apiKey = document.getElementById('iferch_apikey').value;

	const FromLatLong = platlng.lat + ',' + platlng.lng;
	const ToLatLong = dlatlng.lat + ',' + dlatlng.lng;

	const body = {
		vehicleId: selectedVehicleType,
		fromLatLong: FromLatLong,
		toLatLong: ToLatLong,
	};

	const options = {
		headers: {
			'Content-Type': 'application/json',
			ApiKey: apiKey,
			serviceId: serviceId,
		},
		method: 'POST',
		body: JSON.stringify(body),
	};
	fetch(`${url}/estimatefare`, options)
		.then((res) => res.json())
		.then((data) => {
			if (data.status == 200) {
				const est = data.estimateArr;
				let str = '';
				for (let item of est) {
					str += `<li class="iferch-li">
						<span>${item.key}</span>
						<span>${item.value}</span>
					 </li>`;
				}

				document.getElementById('iferch-ul').innerHTML = str;
			} else {
				showErrorMessage(data.message);
				setTimeout(() => {
					hideErrorMessage();
				}, time);
			}
		})
		.catch((err) => {
			showErrorMessage('Unable to get fare estimate');
			setTimeout(() => {
				hideErrorMessage();
			}, time);
		});
}

function makeSingleDelivery() {
	if (!validateInputs()) {
		return;
	}

	serviceId = document.getElementById('iferch_serviceId').value;
	apiKey = document.getElementById('iferch_apikey').value;

	const body = {
		destinationAddress: dlatlng.formatted_address,
		destinationLatitude: dlatlng.lat,
		destinationLongitude: dlatlng.lng,
		pickUpAddress: platlng.formatted_address,
		pickUpLatitude: platlng.lat,
		pickUpLongitude: platlng.lng,
		vehicleId: selectedVehicleType,
		deliveryType: 'SINGLE',
		packageTypeId: selectedPackageType,
		pickupPhoneCode: selectedPickupCountryCode,
		pickupPhoneNumber: pickupPhone,
		receiverPhoneCode: selectedRecipientCountryCode,
		deliveryInstructions: deliveryMessage,
		packageDetails: packageDetails,
		pickUpInstructions: pickupMessage,
		receiverMobile: recipientPhone,
		receiverName: recipientName,
		scheduleDate: selectedTime,
	};

	const options = {
		headers: {
			'Content-Type': 'application/json',
			ApiKey: apiKey,
			serviceId: serviceId,
		},
		method: 'POST',
		body: JSON.stringify(body),
	};

	showLoader();
	fetch(`${url}/createshipment`, options)
		.then((res) => res.json())
		.then((data) => {
			hideLoader();
			if (data.status == 200) {
				showSuccessMessage(data.message);

				setTimeout(() => {
					hideSuccessMessage();
					window.location.reload();
				}, time);
			} else {
				showErrorMessage(data.message);
				setTimeout(() => {
					hideErrorMessage();
				}, time);
			}
		})
		.catch((err) => {
			hideLoader();
			showErrorMessage('Unable to complete request at the moment');
			setTimeout(() => {
				hideErrorMessage();
			}, time);
		});
}

function callIFerchSingleDeliveryOnComplete() {
	jQuery('#iferch-datetimepicker').datetimepicker({
		inline: true,
		step: 1,
		format: 'Y-m-d H:i',
		onChangeDateTime: function (dp, $input) {
			document.getElementById('iferch-invalid-time').innerText = '';

			const now = new Date();
			const settime = new Date($input.val());
			selectedTime = $input.val();

			const diff = getDifferenceInHours(now, settime);
			pickupTimeValid = true;

			if (diff < 1) {
				document.getElementById('iferch-invalid-time').innerText =
					'Date must be at least one(1) hour ahead of current time';
				selectedTime = null;
				pickupTimeValid = false;
				return;
			}
		},
	});

	const recipientInput = document.querySelector(
		'#iferch-single-phone-recipient'
	);
	iti_recipient = window.intlTelInput(recipientInput, {
		separateDialCode: true,
		initialCountry: 'GH',
		nationalMode: true,
	});

	recipientInput.addEventListener('countrychange', function (event) {
		const countryData = iti_recipient.getSelectedCountryData();
		selectedCountryCode = countryData.dialCode;
		let intlNumber = iti_recipient.getNumber(
			intlTelInputUtils.numberType.MOBILE
		);

		selectedPickupCountryCode = countryData.dialCode;
		recipientPhone = intlNumber.split(countryData.dialCode)[1];
	});

	const pickupInput = document.querySelector('#iferch-single-phone-pickup');
	iti_pickup = window.intlTelInput(pickupInput, {
		separateDialCode: true,
		initialCountry: 'GH',
		nationalMode: true,
	});

	pickupInput.addEventListener('countrychange', function (event) {
		const countryData = iti_pickup.getSelectedCountryData();

		selectedCountryCode = countryData.dialCode;
		let intlNumber = iti_pickup.getNumber(intlTelInputUtils.numberType.MOBILE);

		selectedRecipientCountryCode = countryData.dialCode;
		pickupPhone = intlNumber.split(countryData.dialCode)[1];
	});

	document
		.getElementById('iferch-recipient-name')
		.addEventListener('input', (evt) => {
			recipientName = evt.target.value;
		});

	document
		.getElementById('iferch-pickup-message')
		.addEventListener('input', (evt) => {
			pickupMessage = evt.target.value;
		});

	document
		.getElementById('iferch-delivery-message')
		.addEventListener('input', (evt) => {
			deliveryMessage = evt.target.value;
		});

	document
		.getElementById('iferch-package-details')
		.addEventListener('input', (evt) => {
			packageDetails = evt.target.value;
		});

	document
		.getElementById('iferch-make-single-delivery')
		.addEventListener('click', (evt) => {
			makeSingleDelivery();
		});
}

function callIFerchSingleDeliveryOnLoad() {
	autocomplete(document.getElementById('iferch-myInput'), 'pickup');
	autocomplete(document.getElementById('iferch-myInput2'), 'destination');

	vehicleTypeSelect = document.getElementById('iferch-vehicletype');
	packageTypeSelect = document.getElementById('iferch-packagetype');

	vehicleTypeSelect.addEventListener('change', (evt) => {
		selectedVehicleType = evt.target.value;

		if (pickupAdded && dropOffAdded && selectedVehicleType != 0) {
			estimateFare();
		}
	});

	packageTypeSelect.addEventListener('change', (evt) => {
		selectedPackageType = evt.target.value;
	});

	getVehicleTypes();

	getPackageTypes();
}

function callIferchUpcomingOnComplete() {
	fetchUpComingDeliveries();
}

function callIFerchMultiDeliveryOnComplete() {
	jQuery('#iferch-datetimepicker').datetimepicker({
		inline: true,
		step: 1,
		format: 'Y-m-d H:i',
		onChangeDateTime: function (dp, $input) {
			document.getElementById('iferch-invalid-time').innerText = '';

			const now = new Date();
			const settime = new Date($input.val());
			selectedTime = $input.val();

			const diff = getDifferenceInHours(now, settime);
			pickupTimeValid = true;

			if (diff < 1) {
				document.getElementById('iferch-invalid-time').innerText =
					'Date must be at least one(1) hour ahead of current time';
				selectedTime = null;
				pickupTimeValid = false;
				return;
			}
		},
	});

	autocomplete(document.getElementById('iferch-myInput'), 'pickup');
	fetchMultiFormFields();
	getVehicleTypes();
}

function showLoader() {
	iferch_ajax_loader.classList.add('iferch-show-loader');
	iferch_ajax_loader.classList.remove('iferch-hide-loader');
}

function hideLoader() {
	iferch_ajax_loader.classList.add('iferch-hide-loader');
	iferch_ajax_loader.classList.remove('iferch-show-loader');
}

function showErrorMessage(message) {
	iferch_message_box.classList.add(
		'iferch-show-message',
		'iferch-message-box-error'
	);
	iferch_message_box.classList.remove('iferch-hide-message');
	iferch_message_box.innerText = message;
}

function showErrorMessage2(message) {
	iferch_message_box.classList.add(
		'iferch-show-message',
		'iferch-message-box-error'
	);
	iferch_message_box.classList.remove('iferch-hide-message');
	iferch_message_box.innerText = message;

	setTimeout(() => {
		hideErrorMessage();
	}, time);
}

function hideErrorMessage() {
	iferch_message_box.classList.add('iferch-hide-message');
	iferch_message_box.classList.remove(
		'iferch-show-message',
		'iferch-message-box-error'
	);
	iferch_message_box.innerText = '';
}

function showSuccessMessage(message) {
	iferch_message_box.classList.add(
		'iferch-show-message',
		'iferch-message-box-success'
	);
	iferch_message_box.classList.remove('iferch-hide-message');
	iferch_message_box.innerText = message;
}

function showSuccessMessage2(message) {
	iferch_message_box.classList.add(
		'iferch-show-message',
		'iferch-message-box-success'
	);
	iferch_message_box.classList.remove('iferch-hide-message');
	iferch_message_box.innerText = message;

	setTimeout(() => {
		hideSuccessMessage();
	}, time);
}

function hideSuccessMessage() {
	iferch_message_box.classList.add('iferch-hide-message');
	iferch_message_box.classList.remove(
		'iferch-show-message',
		'iferch-message-box-success'
	);
	iferch_message_box.innerText = '';
}

function getDifferenceInHours(date1, date2) {
	const diffInMs = date2 - date1;
	return diffInMs / (1000 * 60 * 60);
}

function validateInputs() {
	let intlNumber = iti_recipient.getNumber(intlTelInputUtils.numberType.MOBILE);
	recipientPhone = intlNumber.split(selectedRecipientCountryCode)[1];

	let intlNumber2 = iti_pickup.getNumber(intlTelInputUtils.numberType.MOBILE);
	pickupPhone = intlNumber2.split(selectedPickupCountryCode)[1];

	if (selectedPackageType == 0) {
		showErrorMessage2('Select package type');
		return false;
	}

	if (recipientName == '') {
		showErrorMessage2('Enter recipient name');
		return false;
	}

	if (recipientPhone == '' || !iti_recipient.isValidNumber()) {
		showErrorMessage2('Enter a valid recipient phone number');
		return false;
	}

	if (pickupPhone == '' || !iti_pickup.isValidNumber()) {
		showErrorMessage2('Enter a valid pickup phone number');
		return false;
	}

	if (pickupMessage == '') {
		showErrorMessage2('Enter pickup message');
		return false;
	}

	if (deliveryMessage == '') {
		showErrorMessage2('Enter delivery message');
		return false;
	}

	if (packageDetails == '') {
		showErrorMessage2('Enter package details');
		return false;
	}

	if (selectedVehicleType == 0) {
		showErrorMessage2('Select vehicle type');
		return false;
	}

	if (!pickupAdded) {
		showErrorMessage2('Enter pickup location');
		return false;
	}

	if (!dropOffAdded) {
		showErrorMessage2('Enter drop off location');
		return false;
	}

	if (!pickupTimeValid) {
		showErrorMessage2(
			'Date must be at least one(1) hour ahead of current time'
		);
		return false;
	}

	return true;
}

function fetchUpComingDeliveries() {
	serviceId = document.getElementById('iferch_serviceId').value;
	apiKey = document.getElementById('iferch_apikey').value;

	const options = {
		headers: {
			'Content-Type': 'application/json',
			ApiKey: apiKey,
			serviceId: serviceId,
		},
		method: 'GET',
	};

	showLoader();
	fetch(`${url}/upcomingshipment`, options)
		.then((res) => res.json())
		.then((data) => {
			hideLoader();
			if (data.status == 200) {
				let str = ``;
				const tbody = document.getElementById('upcoming-table-body');
				const bookings = data.bookings;

				for (const booking of bookings) {
					let strd = ``;
					// str = ``;
					if (booking.deliveryType == 'MULTI') {
						const dests = booking.Destination;
						strd = ``;
						for (const dest of dests) {
							strd += `<li class="iferch-li iferch-small-text-in-table">${dest}</li>`;
						}
					} else {
						strd = `<li class="iferch-li iferch-small-text-in-table">${booking.Destination}</li>`;
					}

					str += `<tr>
								<th scope="row">${booking.bookingNo} </th>
								<td> ${booking.bookingDate} </td>
								<td>${booking.deliveryType}</td>
								<td>${booking.pickUp}</td>
								<td>${strd}</td>
                    		</tr>`;
				}

				if (bookings.length == 0) {
					str = ` <tr>
								<th class="text-center" colspan="5">No data available</th>
					 		</tr>`;
				}
				tbody.innerHTML = str;
			} else {
				showErrorMessage(data.message);
				setTimeout(() => {
					hideErrorMessage();
				}, time);
			}
		})
		.catch((err) => {
			hideLoader();
			showErrorMessage('Unable to get upcoming deliveries');
			setTimeout(() => {
				hideErrorMessage();
			}, time);
		});
}

function setupPagination(numPages) {
	let pageParts = $('.paginate');
	// let numPages = 100;
	let perPage = 10;

	pageParts.slice(perPage).hide();

	$('#page-nav').pagination({
		items: numPages,
		itemsOnPage: perPage,
		cssStyle: 'light-theme',

		onPageClick: function (pageNum) {
			// Which page parts do we show?
			let start = perPage * (pageNum - 1);
			let end = start + perPage;

			pageParts.hide().slice(start, end).show();
			fetchHistory(pageNum);
		},
	});
}

function fetchHistory(page) {
	serviceId = document.getElementById('iferch_serviceId').value;
	apiKey = document.getElementById('iferch_apikey').value;

	const options = {
		headers: {
			'Content-Type': 'application/json',
			ApiKey: apiKey,
			serviceId: serviceId,
		},
		method: 'GET',
	};

	showLoader();
	fetch(`${url}/shipmenthistory?page=${page}`, options)
		.then((res) => res.json())
		.then((data) => {
			hideLoader();
			const history = data.history;
			let str = ``;
			const tbody = document.getElementById('history-table-body');
			for (const hist of history) {
				let cl = '';
				if (hist.tripStatus == 'Finished') {
					cl = 'badge iferch-badge-success';
				} else if (hist.tripStatus == 'On Going Trip') {
					cl = 'badge iferch-badge-primary';
				} else {
					cl = 'badge iferch-badge-secondary';
				}
				str += ` <tr>
				<th scope="row">${hist.bookingNo}</th>
				<td>${hist.requestDate}</td>
				<td>${hist.deliveryType}</td>
				<td>${hist.pickupAddress}</td>
				<td>${hist.dropOffAddress}</td>
				<td>GH¢ ${parseFloat(hist.totalFare).toFixed(2)}</td>
				<td> <span class="${cl}"> ${hist.tripStatus}</span> </td>
			</tr>`;
			}

			if (history.length == 0) {
				str = ` <tr>
				<th class="text-center" colspan="7">No data available</th>
			 </tr>`;
			}

			tbody.innerHTML = str;

			if (first_run) {
				first_run = false;
				setupPagination(data.totalPages);
			}
		})
		.catch((err) => {
			hideLoader();
			showErrorMessage('Unable to get delivery history');
			setTimeout(() => {
				hideErrorMessage();
			}, time);
		});
}

function fetchOngoing() {
	serviceId = document.getElementById('iferch_serviceId').value;
	apiKey = document.getElementById('iferch_apikey').value;

	const options = {
		headers: {
			'Content-Type': 'application/json',
			ApiKey: apiKey,
			serviceId: serviceId,
		},
		method: 'GET',
	};

	showLoader();
	fetch(`${url}/ongoingshipment`, options)
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			hideLoader();
			if (data.status == 200) {
				let str = ``;
				const tbody = document.getElementById('ongoing-table-body');
				const bookings = data.ongoing;

				for (const booking of bookings) {
					let cl = '';
					if (booking.tripStatus == 'Arriving') {
						cl = 'badge iferch-badge-primary';
					} else if (booking.tripStatus == 'On Going Trip') {
						cl = 'badge iferch-badge-success';
					} else {
						cl = 'badge iferch-badge-secondary';
					}

					let strd = ``;
					if (booking.deliveryType == 'MULTI') {
						const dests = booking.Destination;

						for (const dest of dests) {
							strd += `<li class="iferch-li iferch-small-text-in-table">${dest}</li>`;
						}
					} else {
						strd = `<li class="iferch-li iferch-small-text-in-table">${booking.Destination}</li>`;
					}

					str += `<tr>
                        <th scope="row">${booking.rideNo} </th>
                        <td>${booking.deliveryType}</td>
                        <td>${booking.pickUp}</td>
                        <td>${strd}</td>
						<td> <span class="${cl}"> ${booking.tripStatus} </span> </td>
                    </tr>`;
				}

				if (bookings.length == 0) {
					str = ` <tr>
						<th class="text-center" colspan="5">No data available</th>
					 </tr>`;
				}
				tbody.innerHTML = str;
			} else {
				showErrorMessage(data.message);
				setTimeout(() => {
					hideErrorMessage();
				}, time);
			}
		})
		.catch((err) => {
			hideLoader();
			showErrorMessage('Unable to get ongoing delivery');
			setTimeout(() => {
				hideErrorMessage();
			}, time);
		});
}

function fetchMultiFormFields() {
	serviceId = document.getElementById('iferch_serviceId').value;
	apiKey = document.getElementById('iferch_apikey').value;

	const options = {
		headers: {
			'Content-Type': 'application/json',
			ApiKey: apiKey,
			serviceId: serviceId,
		},
		method: 'GET',
	};

	showLoader();
	fetch(`${url}/multideliveryfields`, options)
		.then((res) => res.json())
		.then((data) => {
			hideLoader();
			if (data.status == 200) {
				const fields = data.fields;
				fields.forEach((one, index) => {
					if (one.inputType == 'text' || one.inputType == 'number') {
						const element = document.createElement('INPUT');
						element.setAttribute('type', one.inputType);
						element.setAttribute('placeholder', one.description);

						if (one.required == 'yes') {
							element.setAttribute('required', true);
						}

						element.setAttribute(
							'class',
							'col-md-12 mt-3 form-control iferch-formitem'
						);

						element.setAttribute('deliveryFieldId', one.deliveryFieldId);

						element.addEventListener('input', (evt) => {
							if (one.inputType == 'number') {
								multi_mobile_number[one.deliveryFieldId] = evt.target.value;
							}

							if (one.inputType == 'text') {
								multi_recipient_name[one.deliveryFieldId] = evt.target.value;
							}
						});

						iferch_multi_modal_body.appendChild(element);
					} else if (one.inputType == 'textarea') {
						const element = document.createElement('TEXTAREA');
						element.setAttribute('deliveryFieldId', one.deliveryFieldId);
						element.setAttribute('placeholder', one.description);
						// if (one.required == 'yes') {
						// }
						element.setAttribute('required', true);
						element.setAttribute(
							'class',
							'col-md-12 mt-3 form-control iferch-formitem'
						);

						element.addEventListener('input', (evt) => {
							multi_delivery_ins[one.deliveryFieldId] = evt.target.value;
						});

						iferch_multi_modal_body.appendChild(element);
					} else if (one.inputType == 'select') {
						const element = document.createElement('SELECT');
						element.setAttribute('deliveryFieldId', one.deliveryFieldId);
						element.setAttribute('placeholder', one.description);
						if (one.required == 'yes') {
							element.setAttribute('required', true);
						}
						element.setAttribute(
							'class',
							'col-md-12 mt-3 form-control iferch-formitem '
						);
						element.setAttribute('isSelect', true);

						const options = one.Options;

						let str = ``;
						options.forEach((opt, index) => {
							if (index == 0) {
								multi_package_type_id[one.deliveryFieldId] = opt.packageTypeId;
							}
							str += `<option value="${opt.packageTypeId}">${opt.packageName}</option>`;
						});

						element.innerHTML = str;

						element.addEventListener('change', (evt) => {
							multi_package_type_id[one.deliveryFieldId] = evt.target.value;
						});

						iferch_multi_modal_body.appendChild(element);
					}
				});

				// ? == add search input ===
				const element = document.createElement('INPUT');
				element.setAttribute('id', 'iferch-myInput2');
				element.setAttribute('type', 'text');
				element.setAttribute('class', 'form-control mt-3');
				element.setAttribute('placeholder', 'search drop off location');
				const div = document.createElement('DIV');
				div.style.position = "relative";
            	div.appendChild(element)
				iferch_multi_modal_body.appendChild(div);
				autocomplete(document.getElementById('iferch-myInput2'), 'destination');
			} else {
				showErrorMessage(data.message);
				setTimeout(() => {
					hideErrorMessage();
				}, time);
			}
		})
		.catch((err) => {
			hideLoader();
			showErrorMessage('Unable to get form fields');
			setTimeout(() => {
				hideErrorMessage();
			}, time);
		});
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
	let R = 6371; // Radius of the earth in km
	let dLat = deg2rad(lat2 - lat1); // deg2rad below
	let dLon = deg2rad(lon2 - lon1);
	let a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) *
			Math.cos(deg2rad(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	let d = R * c; // Distance in km
	return d;
}

function deg2rad(deg) {
	return deg * (Math.PI / 180);
}

function getInputFormMultiModal() {
	const name = Object.keys(multi_recipient_name)[0];
	const nameVal = Object.values(multi_recipient_name)[0];

	const mobile = Object.keys(multi_mobile_number)[0];
	const mobileVal = Object.values(multi_mobile_number)[0];

	const del = Object.keys(multi_delivery_ins)[0];
	const delVal = Object.values(multi_delivery_ins)[0];

	const pack = Object.keys(multi_package_type_id)[0];
	const packVal = Object.values(multi_package_type_id)[0];

	const oneDropOff = {
		ePaymentByReceiver: 'No',
		vReceiverLatitude: dlatlng.lat,
		vReceiverLongitude: dlatlng.lng,
		vReceiverAddress: dlatlng.formatted_address,
	};

	oneDropOff[name] = nameVal;
	oneDropOff[mobile] = mobileVal;
	oneDropOff[del] = delVal;
	oneDropOff[pack] = packVal;

	multi_delivery_drop_off.push(oneDropOff);

	multi_delivery_drop_off_for_estimate.push({
		lat: dlatlng.lat,
		lng: dlatlng.lng,
	});

	hideMultiDeliveryModal();

	addDropOff();

	resetMultiDeliveryFormFields();

	if (pickupAdded && multi_delivery_drop_off_for_estimate.length > 1) {
		estimateFareMulti();
	}
}

function estimateFareMulti() {
	document.getElementById('multi-form-submit').hidden = false;

	serviceId = document.getElementById('iferch_serviceId').value;
	apiKey = document.getElementById('iferch_apikey').value;

	const body = {
		vehicleId: selectedVehicleType,
		startLat: platlng.lat,
		startLng: platlng.lng,
		destinationArr: multi_delivery_drop_off_for_estimate,
	};

	const options = {
		headers: {
			'Content-Type': 'application/json',
			ApiKey: apiKey,
			serviceId: serviceId,
		},
		method: 'POST',
		body: JSON.stringify(body),
	};

	showLoader();

	fetch(`${url}/estimatemultifare`, options)
		.then((res) => res.json())
		.then((data) => {
			hideLoader();

			const estimateArr = data.estimateArr;
			let str = '';
			for (let item of estimateArr) {
				const keys = Object.keys(item);
				const values = Object.values(item);

				if (keys[0] != 'eDisplaySeperator') {
					str += `<li class="iferch-li">
						<span>${keys[0]}</span>
						<span>${values[0]}</span>
					</li>`;

					totalAmtMulti = values[0].split(' ')[1];
				}
			}

			document.getElementById('iferch-ul').innerHTML = str;
		})
		.catch((err) => {
			hideLoader();
			showErrorMessage('Unable to get fare estimate');
			setTimeout(() => {
				hideErrorMessage();
			}, time);
		});
}

function resetMultiDeliveryFormFields() {
	const classList = document.getElementsByClassName('iferch-formitem');

	for (let i = 0; i < classList.length; ++i) {
		if (classList[i].getAttribute('isselect') == 'true') {
			classList[i].selectedIndex = 0;
		} else {
			classList[i].value = '';
		}
	}

	document.getElementById('iferch-myInput2').value = '';
}

function addDropOff() {
	const drop = document.getElementById('iferch-drop-off');

	let str = ``;

	multi_delivery_drop_off.forEach((dest, i) => {
		str += `<li class="iferch-droff-list">
			<span>${dest.vReceiverAddress}</span>
			<div>
			<i class="fa fa-pencil-square-o text-primary iferch-margin-10 iferch-pointer" onclick="editDropOff(${i})"></i>
			<i class="fa fa-trash-o text-danger iferch-pointer" onclick="removeDropOff(${i})"></i>
			</div>
		</li>`;
	});

	drop.innerHTML = str;
	setReceiverListRadio();

	if (multi_delivery_drop_off.length < 2) {
		document.getElementById('payment-box-2').hidden = true;
		return;
	}
	document.getElementById('payment-box-2').hidden = false;
}

function removeDropOff(index) {
	const drop = document.getElementById('iferch-drop-off');

	multi_delivery_drop_off.splice(index, 1);

	let str = ``;
	let i = 0;
	for (dest of multi_delivery_drop_off) {
		str += `<li class="iferch-droff-list">
			<span>${dest.vReceiverAddress}</span>
			<div>
			<i class="fa fa-pencil-square-o text-primary iferch-margin-10 iferch-pointer" onclick="editDropOff(${i})"></i>
			<i class="fa fa-trash-o text-danger iferch-pointer" onclick="removeDropOff(${i})"></i>
			</div>
		</li>`;

		++i;
	}

	drop.innerHTML = str;
	setReceiverListRadio();

	if (multi_delivery_drop_off.length < 2) {
		document.getElementById('payment-box-2').hidden = true;
		return;
	}
	document.getElementById('payment-box-2').hidden = false;
}

function editDropOff(index) {
	is_edit_form = true;
	const classList = document.getElementsByClassName('iferch-formitem');

	const formData = multi_delivery_drop_off[index];

	const keys = Object.keys(formData);

	for (const key of keys) {
		for (let i = 0; i < classList.length; ++i) {
			if (classList[i].getAttribute('deliveryFieldId') == key) {
				if (classList[i].getAttribute('isselect') == 'true') {
					classList[i].value = formData[key];
				} else {
					classList[i].value = formData[key];
				}
			}
		}
	}

	document.getElementById('iferch-myInput2').value =
		formData['vReceiverAddress'];

	showMultiDeliveryModal();
}

function onSender() {
	payby = 'Sender';

	for (let i = 0; i < multi_delivery_drop_off.length; ++i) {
		multi_delivery_drop_off[i].ePaymentByReceiver = 'No';
	}
	const box = document.getElementById('iferch-receiver-box');
	box.classList.add('iferch-hide');
	box.classList.remove('iferch-show');

	document.getElementById('iferch-show-only-when').hidden = true;
}

function onReceiver() {
	payby = 'Receiver';

	const box = document.getElementById('iferch-receiver-box');

	box.hidden = false;
	box.classList.add('iferch-show');
	box.classList.remove('iferch-hide');

	setReceiverListRadio();

	document.getElementById('iferch-show-only-when').hidden = true;
}

function onIndividual() {
	payby = 'Individual';

	for (let i = 0; i < multi_delivery_drop_off.length; ++i) {
		multi_delivery_drop_off[i].ePaymentByReceiver = 'Yes';
	}

	let amt = parseFloat(totalAmtMulti);
	document.getElementById('iferch-amt').innerText = (
		amt / multi_delivery_drop_off.length
	).toFixed(2);

	const box = document.getElementById('iferch-receiver-box');
	box.classList.add('iferch-hide');
	box.classList.remove('iferch-show');

	document.getElementById('iferch-show-only-when').hidden = false;
}

function setReceiverListRadio() {
	const box = document.getElementById('iferch-receiver-box');

	let str = ``;
	multi_delivery_drop_off.forEach((one, i) => {
		str += `<div class="col-md-12">
					<input type="radio" name="payment-mode-sub" id="paybyreceiver-sub--${i}" onchange="onOneRecipient(${i})">
					<label for="paybyreceiver-sub--${i}" class="ferch-label">${one['2']}</label>
				</div>`;
	});

	box.innerHTML = str;
}

function onOneRecipient(index) {

	for (let i = 0; i < multi_delivery_drop_off.length; ++i) {
		multi_delivery_drop_off[i].ePaymentByReceiver = 'No';
	}

	multi_delivery_drop_off[index].ePaymentByReceiver = 'Yes';
}

function makeMultiDelivery() {

	if(!validateMulti()){
		return
	}

	serviceId = document.getElementById('iferch_serviceId').value;
	apiKey = document.getElementById('iferch_apikey').value;

	const body = {
		pickUpAddress: platlng.formatted_address,
		pickUpLatitude: platlng.lat,
		pickUpLongitude: platlng.lng,
		vehicleId: selectedVehicleType,
		deliveryType: 'MULTI',
		scheduleDate: selectedTime,
		payby: payby,
		destinations: multi_delivery_drop_off
	};

	const options = {
		headers: {
			'Content-Type': 'application/json',
			ApiKey: apiKey,
			serviceId: serviceId,
		},
		method: 'POST',
		body: JSON.stringify(body),
	};

	showLoader();

	fetch(`${url}/createshipment`, options)
	.then(res => res.json())
	.then(data => {
		hideLoader();
		if (data.status == 200) {
			showSuccessMessage(data.message);

			setTimeout(() => {
				hideSuccessMessage();
				window.location.reload();
			}, time);
		} else {
			showErrorMessage(data.message);
			setTimeout(() => {
				hideErrorMessage();
			}, time);
		}
	})
	.catch(err => {
		hideLoader();
		showErrorMessage('Unable to complete request at the moment');
		setTimeout(() => {
			hideErrorMessage();
		}, time);
	})
}

function validateMulti(){
	if(!pickupTimeValid){
		showErrorMessage2('Date must be at least one(1) hour ahead of current time');
		return false;
	}

	if(platlng.lat == undefined){
		showErrorMessage2('Provide pickup location');
		return false;
	}

	if(multi_delivery_drop_off.length < 2){
		showErrorMessage2('Provide more than one drop off location');
		return false;
	}

	if(selectedVehicleType == 0){
		showErrorMessage2('Select vehicle type');
		return false;
	}

	return true
}









