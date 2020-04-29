"use strict";
// Create API session token
const token = {
    "token_type": "Bearer",
    "expires_in": 3600,
};
const app = document.getElementById('main'); // Set app
const submitBtn = document.getElementById('submit'); // Set submit button
var selectedType, userLocale;
var errors = 0; // Number of errors for unit testing
try {
    getToken(); // Get access_token property for token
} catch (error) {
    errorHandler(true, error);
}

// Get access_token property for token
function getToken() {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                token.access_token = JSON.parse(this.response).access_token; // Assign access_token
                getTypes(); // Get animal types
            } catch (error) {
                errorHandler(true, error);
            }
        }
    }
    httpRequest.open("POST", "https://api.petfinder.com/v2/oauth2/token", true);
    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    httpRequest.send("grant_type=client_credentials&client_id=" + clientID + "&client_secret=" + clientSecret);
}

// Call API to get initial animal types
function getTypes() {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                listTypes(JSON.parse(this.response).types); // List animal types as radio buttons
            } catch (error) {
                errorHandler(true, error);
            }
        }
    }
    httpRequest.open("GET", "https://api.petfinder.com/v2/types", true);
    httpRequest.setRequestHeader('Authorization', 'Bearer ' + token.access_token);
    httpRequest.send();
}

// List animal types as drop down menu
function listTypes(types) {
    let typeSelect = document.createElement('select');
    typeSelect.id = 'type-select';
    document.getElementById('type-container').appendChild(typeSelect);
    for (var i = 0; i < types.length; i++) {
        let typeOption = document.createElement('option');
        typeOption.textContent = types[i].name;
        typeOption.setAttribute('value', types[i].name.toLowerCase().replace(/(& |,)/g, '').replace(/(\s)/g, '-'));
        typeSelect.appendChild(typeOption);
    }
    document.body.removeChild(document.getElementById('main-loader'));
    app.classList.remove('hidden'); // Remove hidden class from app after all radio buttons have been created
}

// Perform an animal search
function search(newSearch) {
    // Remove non-numbers from Zip code input
    let localeInput = document.getElementById('locale').value.replace(/\D/gi, '');
    // Get type of animal from type drop down
    let type = document.getElementById('type-select').value;
    // If a type has been selected, call API with search query
    if (type.length > 0 && localeInput.length == 5) {
        var status;
        if (newSearch) {
            clear('animals'); // Clear animal list if user has changed search parameters since last search
            selectedType = type; // Assign current animal selection to selectedType variable
            userLocale = localeInput; // Assign current user locale to userLocale variable
            // Let user know search is being performed
            status = document.createElement('h3');
            status.textContent = "Fetching...";
            document.getElementById('animals').appendChild(status);
            submitBtn.classList.add('disabled');
        } else {
            status = document.createElement('img');
            status.classList.add('loader');
            status.src = "img/loading.gif";
            document.getElementById('animals').appendChild(status);
        }
        // Perform query on API
        let httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                try {
                    document.getElementById('animals').removeChild(status);
                    listAnimals(JSON.parse(this.response).animals, type); // List results of animal search
                    submitBtn.classList.remove('disabled');
                } catch (error) {
                    errorHandler(true, error);
                }
            }
        }
        // Assign query parameters to API call
        let params = "?type=" + selectedType; // Set animal type
        let pageNum = new Number();
        if (newSearch) {
            pageNum = 1;
        } else {
            pageNum = getPageNum();
        }
        // If more listings are available, show them
        if (Number.isInteger(pageNum)) {
            params += "&location=" + userLocale + "&distance=25&page=" + pageNum + "&limit=20&sort=distance"; // Assign location parameter if user filled out location
            httpRequest.open("GET", "https://api.petfinder.com/v2/animals" + params, true);
            httpRequest.setRequestHeader('Authorization', 'Bearer ' + token.access_token);
            httpRequest.send();
        } else {
            // Alert user that all listings have been shown
            document.getElementById('animals').removeChild(status);
            status = document.createElement('h3');
            status.innerHTML = "It looks like that's all we can find!<br><span>Perform A New Search</span>";
            document.getElementById('animals').appendChild(status);
            status.addEventListener('click', goToTop);
        }
    } else {
        let message = "Please ";
        if (localeInput.length < 5) {
            message += "enter a valid zip code";
        }
        if (type.length == 0 && localeInput.length < 5) {
            message += " and ";
        }
        if (!type.length > 0) {
            message += "select the type of pet you're looking for.";
        }
        alert(message); // Show alert if no animal type has been selected
    }
}

// Show list of animal results
function listAnimals(animals, type) {
    app.classList.add('active-search');
    if (animals.length > 0) {
        for (var i = 0; i < animals.length; i++) {
            try {
                // Create animal listing
                let animal = document.createElement('a');
                animal.classList.add('animal');
                // Make listing click out to full profile
                animal.setAttribute('href', animals[i].url);
                animal.setAttribute('target', "_blank");
                document.getElementById('animals').appendChild(animal);
                // Create thumbnail
                let thumbnail = document.createElement('div');
                thumbnail.classList.add('thumbnail');
                let imgSize = new String();
                if (window.innerWidth < 1024) {
                    imgSize = 'small';
                } else {
                    imgSize = 'large';
                }
                try {
                    // If animal photo is available show it as a thumbnail
                    if (animals[i].photos.length > 0) {
                        thumbnail.style.backgroundImage = "url('" + animals[i].photos[0][imgSize] + "')";
                    } else {
                        thumbnail.classList.add('blank'); // Add blank thumbnail to listings with no photos
                    }
                } catch (error) {
                    errorHandler(false, error);
                }
                animal.appendChild(thumbnail);
                // Append animal info
                let info = document.createElement('p');
                info.classList.add('info');
                animal.appendChild(info);
                // Set animal name
                let name = document.createElement('span');
                name.textContent = animals[i].name;
                name.classList.add('name');
                info.appendChild(name);
                info.innerHTML += "<br>";
                // Set animal age,  breed, and distance from the user
                let byline = document.createElement('span');
                byline.classList.add('byline');
                let distance = new String();
                if (animals[i].distance < 1) {
                    distance = animals[i].distance.toFixed(1);
                } else {
                    distance = animals[i].distance.toFixed(0);
                }
                byline.innerHTML = animals[i].age + " <br>" + animals[i].breeds.primary + "<br>" + distance + " miles away";
                info.appendChild(byline);
            } catch (error) {
                errorHandler(false, error);
            }
        }
        window.addEventListener('scroll', autoLoad);
    } else {
        let status = document.createElement('h3');
        status.textContent = "It doesn't look like we can find any animals that match your search.";
        document.getElementById('animals').appendChild(status);
    }

}

// Check where user is on page
function autoLoad() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        window.removeEventListener('scroll', autoLoad); // Prevent multiple API calls at once
        search(false); // Add more listings when user arrives at the bottom of a page
    }
}

// Hide/show scroll to top button
window.addEventListener('scroll', function () {
    if (window.scrollY > window.innerHeight) {
        document.getElementById('top').classList.add('show');
    } else {
        document.getElementById('top').classList.remove('show');
    }
});

// Error handler
function errorHandler(fatal, error) {
    errors++;
    if (fatal) {
        clear('main');
        clear('main-loader');
        let errorMessage = document.createElement('h1');
        errorMessage.textContent = "We're sorry, but it looks like something's wrong at the moment. Please try again later.";
        app.appendChild(errorMessage);
        app.classList.remove('hidden');
    }
    let errorLog = new String();
    console.log("%cError Log", "font-weight:bold")
    console.log("Number of errors: " + errors + "\r\n" + "Stack:\r\n" + error.stack);
}

// Determine which page number to use for API lookup
function getPageNum() {
    return (document.querySelectorAll('.animal').length / 20) + 1;
}

// Go to the top of the page
function goToTop() {
    document.getElementById('top').classList.remove('show');
    window.scrollTo(0, 0);
}

// Clear any child elements
function clear(element) {
    let emptyElement = document.getElementById(element);
    while (emptyElement.firstChild) {
        emptyElement.removeChild(emptyElement.firstChild);
    }
}
