// functions.js

// document.getElementById('rsvpForm').addEventListener('submit', function(event) {
//     event.preventDefault();

//     const name = document.getElementById('name').value;
//     const attending = document.getElementById('attending').value;
//     const guests = document.getElementById('guests').value;
//     const messageDiv = document.getElementById('rsvpMessage');

//     if (attending === 'yes') {
//         messageDiv.innerHTML = `<p>Thank you, ${name}! We look forward to seeing you and ${guests} guest(s) at our wedding!</p>`;
//     } else {
//         messageDiv.innerHTML = `<p>Thank you, ${name}, for letting us know. We'll miss you!</p>`;
//     }

//     document.getElementById('rsvpForm').reset();
// });

function navigateToPage(page) {

    const pageElements = [
        "forsiden",
        "praktisk-info",
        "program",
        "kart",
        "reisetips",
        "galleri"
    ];

    for (let i = 0; i < pageElements.length; i++) {
        if (pageElements[i] === page) {
            try {
                document.getElementById(page).style.display = 'block';
                window.scrollTo(0,0);
            } catch (e) {
                // eat exception
            }
        } else {
            try {
                document.getElementById(pageElements[i]).style.display = 'none';
            } catch (e) {
                // eat exception
            }
        }
    }
}

function setPageFromUrl() {
    const url = window.location.href;
    if (url.includes("forsiden")) {
        navigateToPage("forsiden");
    } else if (url.includes("praktisk-info")) {
        navigateToPage("praktisk-info");
    } else if (url.includes("program")) {
        navigateToPage("program");
    } else if (url.includes("kart")) {
        navigateToPage("kart");
    } else if (url.includes("reisetips")) {
        navigateToPage("reisetips");
    } else if (url.includes("galleri")) {
        navigateToPage("galleri");
        populateGallery();
    } else {
        navigateToPage("forsiden");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("Chakims bryllup v1.0 :)");
    setPageFromUrl();
});

try {
    navigation.addEventListener('navigate', () => {
        setTimeout(() => {
            setPageFromUrl();
        },25);
    });
} catch (error) {
    log("FATAL ERROR: Could not add EventListener for navigation navigate: " + JSON.stringify(error));
}

function shuffleArray(array) {
    for (var i = array.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function populateGallery() {
    const el = document.querySelector('#galleryimages');
    const images = [
        "resources/20240804_155628.jpg",
        "resources/20240807_122934.jpg",
        "resources/20241015_130714.jpg",
        "resources/20241016_154143.jpg",
        "resources/20241016_154556.jpg",
        "resources/for_evigt.jpg",
        "resources/Screenshot_20250301_224253_Photos.jpg",
        "resources/Screenshot_20250301_224312_Photos.jpg",
        "resources/Snapchat-686363600.jpg",
        "resources/Snapchat-776564614~2.jpg",
        "resources/Snapchat-1069945376.jpg",
        "resources/Snapchat-1183172171.jpg",
        "resources/Snapchat-1208917324.jpg",
        "resources/Snapchat-1479250926.jpg",
        "resources/Snapchat-1496764530.jpg",
        "resources/Snapchat-1655512974.jpg",
        "resources/Snapchat-1661067433.jpg"
    ];

    const imagesToShow = shuffleArray(images);

    let html = "";
    html += `<div class="row g-0">`;
    imagesToShow.forEach((img) => {
        html += `<div class="col-6 col-md-4 galleryimage" style="background-image:url('${img}');" onclick="location.href='${img}';"></div>`;
    });
    html += `</div`;

    el.innerHTML = html;
}