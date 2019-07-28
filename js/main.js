const currencies = ['USD', 'EUR', 'JPY', 'GBP', 'CHF', 'CAD', 'AUD', 'ZAR']; // Array of currencies to convert to
let base = null; // Base currency, used for converting to other currencies

// Page load function
$(function() {
    // On currency click, display conversion calculator
    $('.currency').on('click', function() {
        base = getBase($(this)); // Get the base currency
        getRates(base, 1); // Get the rates, and display them

        $('#base-amount').val(1); // Places default input value as 1
        // Fades in the body dimmer and results
        $('.body-filter').fadeIn();
        $('.results').fadeIn();
    });

    // On results exit
    $('.result-exit').on('click', function() {
        // Fades out body dimmer and results
        $('.body-filter').fadeOut();
        $('.results').fadeOut();
        base = null; // Sets the base currency to null
    });

    // Updates exchange rates when typing
    $('#base-amount').on('input', function() {
        getRates(base, $('#base-amount').val());
    })
});

// Uses asynchronous javascript to get latest currency exchange rates without page reload
function getRates(base, value) {
    // Returns that ajax request to the api (exchangeratesapi.io)
    return $.ajax({
        url: `https://api.exchangeratesapi.io/latest?base=${base}`, // Gets latest exchange rates for the base currency
        datatype: 'jsonp', // Uses jsonp to ensure there are no cross-origin issues
        type: 'GET' // Declares this is a GET request
    }).done(function(result) {
        displayRates(base, result, value); // Displays the results to the results container
    })
}

// Displays the exchange rates to the results div
function displayRates(base, data, value) {
    const resultDiv = $('.result-data'); // Saves data container
    resultDiv.html(''); // Clears data container

    // Loops through results to find the currencies
    // We defined in the currencies array
    for (let i=0; i < currencies.length; i++) {
        if (base !== currencies[i]) { // Ensures we dont convert base rate to base rate
            const rateValue = data.rates[currencies[i]] * value; // The conversion rate for the specific currency
            const rateToDisplay = parseFloat(rateValue.toFixed(3)); // Allows up to 3 decimal points

            // Appends results to the data container
            resultDiv.append(`<p>${value} ${base} = ${rateToDisplay} ${currencies[i]}</p>`)
        }
    }
}

// Finds the base currency by checking the clicked element's class
// List and checking the currecies array for a match
function getBase(element) {
    for (let i=0; i < currencies.length; i++) { // Loops through every element in currencies array
        if (element.hasClass(currencies[i].toLowerCase())) { // Checks if classes match
            return currencies[i]; // Returns base currency abbreviation
        }
    }
}
