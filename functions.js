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

let firstTimeLoad = true;

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
                console.log("switching page");
                window.scrollTo(0,0);
                if (!firstTimeLoad) {
                    document.querySelector(".navbar-toggler").click();
                    console.log("firstTimeLoad is false, toggle menu");
                } else {
                    firstTimeLoad = false;
                    console.log("firstTimeLoad was true, do not toggle menu");
                }
                // document.querySelector('.navbar-collapse').classList = '.navbar-collapse .collapse';
                // document.querySelector('.navbar-collapse').classList = '';
                // $('#navbarSupportedContent').collapse();
                console.log("collapsed!");
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
    if (window.navigation) {
        navigation.addEventListener('navigate', () => {
            setTimeout(() => {
                setPageFromUrl();
            },25);
        });
    } else {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            if (link.href.includes("#")) {
                const url = link.href.split("#")[1].trim();
                console.log(url);
                link.addEventListener('click', () => {
                    navigateToPage(url);
                });
            }
        });
    }
} catch (error) {
    console.log("FATAL ERROR: Could not add EventListener for navigation navigate: " + JSON.stringify(error));
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
    
    try {

        const el = document.querySelector('#galleryimages');

        el.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Laster...</span></div></div>';

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

        setTimeout(() => {

            let html = "";
            html += `<div class="row g-0">`;
            images.forEach((img) => {
                html += `<div class="col-6 col-md-4 galleryimage" style="background-image:url('${img}');" onclick="window.open('${img}', '_blank');"></div>`;
            });
            html += `</div`;

            el.innerHTML = html;

        },250);

    } catch (error) {

        console.log("en feil oppstod, kunne ikke legge til bilder i galleri...");
        document.getElementById('galleryimages').innerHTML = `<div class="alert alert-danger my-3" role="alert">
            Beklager, men en feil har oppstått! :(<br>
            Klarte ikke hente bildene...<br><br>
            Feilmelding: ${JSON.stringify(error)}
        </div>`;

    }
}