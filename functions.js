/** Navigation stuff */

let firstTimeLoad = true;

function navigateToPage(page) {

    const pageElements = [
        "forsiden",
        "praktisk-info",
        "program",
        "kart",
        "reisetips",
        "galleri",
        "gjestebok"
    ];

    for (let i = 0; i < pageElements.length; i++) {
        if (pageElements[i] === page) {
            try {
                document.getElementById(page).style.display = 'block';
                console.log(`Switching page to ${page}`);
                window.scrollTo(0, 0);
                if (!firstTimeLoad) {
                    document.querySelector(".navbar-toggler").click();
                    console.log("firstTimeLoad is false, toggle menu");
                } else {
                    firstTimeLoad = false;
                    console.log("firstTimeLoad was true, do not toggle menu");
                }
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
    } else if (url.includes("gjestebok")) {
        navigateToPage("gjestebok");
        populateGuestbook();
    } else {
        navigateToPage("forsiden");
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("Chakims bryllup v1.0 :)");
    setPageFromUrl();
});

try {
    if (window.navigation) {
        navigation.addEventListener('navigate', () => {
            setTimeout(() => {
                setPageFromUrl();
            }, 25);
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


/** Randomize array items 
 * EDIT: Not used anymore!
*/

function shuffleArray(array) {
    for (var i = array.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


/** Populate the gallery with all uploaded images */
async function populateGallery() {
    try {
        const el = document.querySelector('#galleryimages');

        el.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Laster...</span></div></div>';

        const response = await fetch('https://teknix.no/chakims/gallery', {
            method: 'GET',
            headers: {
                'Authorization': 'chakims6969'
            },
            mode: 'cors'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const images = data || [];

        let html = '<div class="row g-0">';
        images.forEach((img) => {
            const imgsrc = `https://teknix.no/chakims${img}`;
            html += `<div class="col-6 col-md-4 galleryimage" style="background-image:url('${imgsrc}');" onclick="window.open('${imgsrc}', '_blank');"></div>`;
        });
        html += '</div><small>Antall bilder: ' + images.length + '</small>';

        el.innerHTML = html;
    } catch (error) {
        console.error("Feil ved henting av bilder:", error);
        document.getElementById('galleryimages').innerHTML = `
            <div class="alert alert-danger my-3" role="alert">
                Beklager, men en feil har oppstått! :(<br>
                Klarte ikke hente bildene...<br><br>
                Feilmelding: ${error.message}
            </div>`;
    }
}


/** Populate the gallery with all uploaded images */

function populateGallery2() {

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

        }, 250);

    } catch (error) {

        console.log("en feil oppstod, kunne ikke legge til bilder i galleri...");
        document.getElementById('galleryimages').innerHTML = `<div class="alert alert-danger my-3" role="alert">
            Beklager, men en feil har oppstått! :(<br>
            Klarte ikke hente bildene...<br><br>
            Feilmelding: ${JSON.stringify(error)}
        </div>`;

    }
}

/** Populate the guestbook with all greetings */

async function populateGuestbook() {


    try {
        const el = document.querySelector('#guestbookentries');

        // Show loading spinner
        el.innerHTML = `<div class="text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Laster...</span>
            </div>
        </div>`;

        // Fetch greetings from the server
        const response = await fetch('https://teknix.no/chakims/greetings', {
            method: 'GET',
            headers: {
                'Authorization': 'chakims6969'
            },
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Generate HTML for the greetings
        let html = `<div class="row">`;
        data.greetings.forEach(entry => {
            html += `<div class="col-md-6 col-lg-4 my-3">
                <div class="card bg-warning-subtle">
                    <div class="card-body">
                        <p class="card-text">${entry.greeting}</p>
                        <p class="card-text text-end"><small class="text-muted">${new Date(entry.id).toLocaleString()}</small></p>
                    </div>
                </div>
            </div>`;
        });
        html += `</div>`;

        el.innerHTML = html;

    } catch (error) {
        console.error("Error fetching greetings:", error);
        document.getElementById('guestbookentries').innerHTML = `<div class="alert alert-danger my-3" role="alert">
            Beklager, men en feil har oppstått! :(<br>
            Klarte ikke hente innlegg for gjesteboken...<br><br>
            Feilmelding: ${error.message}
        </div>`;
    }
}



function emptyUploadStatusDivs() {
    setTimeout(() => {
        try {
            document.getElementById('galleryUploadStatus').innerHTML = '';
            document.getElementById('guestbookSendStatus').innerHTML = '';
        } catch (error) {
            console.error("Error emptying upload status divs:", error);
        }
    }, 3000);
}


/** Event listeners for loading gallery and guestbook 
 * For some reason, they wont load automatically on iphone/safari.
*/

document.querySelector("#manuallyLoadGallery").addEventListener('click', (e) => {
    e.preventDefault();
    populateGallery();
});

document.querySelector("#manuallyLoadGuestbookEntries").addEventListener('click', (e) => {
    e.preventDefault();
    populateGuestbook();
});

/** Event listener for forms */

document.getElementById('galleryUploadForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    console.log("Submitting gallery POST...");

    const messageDiv = document.getElementById('galleryUploadStatus');
    const fileInput = document.getElementById('inputFile');

    const files = fileInput.files;

    if (files.length === 0) {
        messageDiv.innerHTML = '<div class="alert alert-warning">Ingen filer valgt!</div>';
        return;
    }

    messageDiv.innerHTML = `<div class="alert alert-info">Laster opp bilder, vennligst vent...</div>`;

    const formData = new FormData();

    // Append multiple files
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]); // 'files' should match the backend field name
    }

    try {
        const response = await fetch('https://teknix.no/chakims/gallery', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': 'chakims6969'
            },
            mode: 'cors'
        });

        const result = await response.json();
        messageDiv.innerHTML = `<div class="alert alert-success">Vellykket &check;</div>`;
        populateGallery();
        emptyUploadStatusDivs();
        console.log('Uploaded Files:', result.files);
    } catch (error) {
        console.error('Error uploading files:', error);
        messageDiv.innerHTML = `<div class="alert alert-danger">En feil oppstod, kunne ikke laste opp bilde &cross;</div>`;
        emptyUploadStatusDivs();
    }
});

document.getElementById('guestbookForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const messageDiv = document.getElementById('guestbookSendStatus');
    const greeting = document.getElementById('inputHilsen').value;

    if (greeting) {
        try {
            const response = await fetch('https://teknix.no/chakims/greeting', {
                method: 'POST',
                body: JSON.stringify({ greeting: greeting }),
                headers: {
                    'Authorization': 'chakims6969',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });

            const result = await response.json();
            messageDiv.innerHTML = `<div class="alert alert-success">Vellykket &check;</div>`;
            populateGuestbook();
            emptyUploadStatusDivs();
        } catch (error) {
            console.error('Error uploading files:', error);
            messageDiv.innerHTML = `<div class="alert alert-danger">En feil oppstod, kunne ikke laste opp hilsen &cross;</div>`;
            emptyUploadStatusDivs();
        }
    } else {
        messageDiv.innerHTML = `<div class="alert alert-danger">Vennligst skriv en hilsen først :)</div>`;
        emptyUploadStatusDivs();
    }
});