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

function populateGuestbook() {

    try {

        const el = document.querySelector('#guestbookentries');

        el.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Laster...</span></div></div>';

        const entries = [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis metus lectus, ultrices nec est quis, pretium commodo tellus. Vivamus posuere vulputate tempor. Donec pulvinar at velit sed mattis. Nulla facilisi. Praesent placerat, nulla ut laoreet molestie, augue turpis placerat augue, vel pretium lectus leo bibendum augue. Maecenas molestie augue quis vulputate luctus. Quisque non est sit amet nisl blandit blandit at vel sem. Maecenas dapibus, arcu sit amet vulputate blandit, metus neque hendrerit mi, semper varius lorem dolor vel elit. Vestibulum ultricies sodales suscipit. Vivamus consectetur nisi vel nunc varius mollis. Ut nulla neque, pretium vitae suscipit et, tincidunt non mauris. Aenean nisl sapien, consequat eget mauris nec, accumsan dictum nisi. Curabitur et erat sed magna efficitur sollicitudin convallis id lorem. Maecenas faucibus, urna eu accumsan bibendum, nulla lacus elementum metus, consequat egestas diam metus eget diam. Pellentesque malesuada sem eget risus iaculis malesuada.",
            "Sed erat elit, porttitor quis nunc et, semper pretium sapien. Vestibulum placerat nisi eget libero sagittis fermentum. Nulla luctus mattis justo ut molestie. Aliquam elementum risus ut sem imperdiet efficitur. Maecenas in felis lacinia, dignissim eros vitae, vulputate tellus. Proin quis nisl non sapien cursus aliquet. Integer dictum nec leo non eleifend. Proin vitae magna lobortis, consequat erat eget, dapibus nibh. Donec imperdiet pretium lectus ac viverra. Aenean massa dui, molestie vitae consequat vel, pulvinar id velit.",
            "Praesent sed nisl sit amet eros ultrices lacinia ut in nunc. Suspendisse bibendum bibendum dapibus. Sed semper dictum quam, non ornare augue congue quis. Donec semper ex non dolor luctus pellentesque. Nam dapibus cursus eros ac euismod. Aliquam pretium diam facilisis mauris rhoncus faucibus. Nam vel accumsan orci. Vivamus in velit eu odio ullamcorper efficitur. Proin sodales tristique metus, a volutpat lacus mattis quis. Cras faucibus malesuada felis, a sodales lorem rhoncus lobortis.",
            "Maecenas et quam odio. Phasellus sodales dui quis metus suscipit, quis elementum nibh feugiat. Nulla nec orci vel lectus elementum scelerisque. Sed a facilisis enim, non imperdiet ligula. Sed vulputate, sem a fringilla malesuada, ante nulla viverra ligula, vel lobortis nisi tellus sed urna. Morbi purus dui, dignissim id nunc eu, semper eleifend diam. Aliquam tristique massa non iaculis scelerisque. Nam scelerisque magna non auctor sollicitudin. Ut id risus in justo tincidunt dignissim quis sed libero. Etiam non nisi vestibulum, sagittis nunc eget, gravida dolor. Nunc sed sollicitudin purus, eu placerat nisi.",
            "Cras iaculis ultricies condimentum. Maecenas at tempus augue, sit amet ultrices libero. Fusce volutpat mi nec egestas pharetra. Phasellus maximus dignissim libero in maximus. Quisque ligula risus, consequat in magna eu, condimentum pulvinar nibh. Morbi gravida sem risus, vitae fermentum mauris porta vitae. Nam scelerisque gravida feugiat. Duis semper vulputate tortor nec vulputate. Aenean porta diam in feugiat consectetur. Aliquam felis lacus, vulputate at nulla a, vehicula condimentum dolor. Vestibulum tincidunt tellus et blandit ornare."
        ];

        setTimeout(() => {
            let html = "";
            html += `<div class="row">`;
            entries.forEach((entry) => {
                html += `<div class="col-md-6 col-lg-4 my-3">
                    <div class="card bg-warning-subtle">
                        <div class="card-body">
                            <p class="card-text">${entry}</p>
                        </div>
                    </div>
                </div>`;
            });
            html += `</div`;
            el.innerHTML = html;
        }, 250);

    } catch (error) {

        console.log("en feil oppstod, kunne ikke legge til bilder i galleri...");
        document.getElementById('guestbookentries').innerHTML = `<div class="alert alert-danger my-3" role="alert">
            Beklager, men en feil har oppstått! :(<br>
            Klarte ikke hente innlegg for gjesteboken...<br><br>
            Feilmelding: ${JSON.stringify(error)}
        </div>`;

    }
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

    const messageDiv = document.getElementById('galleryUploadMessage');
    const fileInput = document.getElementById('inputFile');

    const files = fileInput.files;

    if (files.length === 0) {
        messageDiv.innerHTML = '<p>Ingen filer valgt!</p>';
        return;
    }

    const formData = new FormData();

    // Append multiple files
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]); // 'files' should match the backend field name
    }

    try {
        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        messageDiv.innerHTML = result.message;
        console.log('Uploaded Files:', result.files);
    } catch (error) {
        console.error('Error uploading files:', error);
        messageDiv.innerHTML = 'Failed to upload files';
    }
});

document.getElementById('guestbookForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const greeting = document.getElementById('inputHilsen').value;
    const messageDiv = document.getElementById('guestbookMessage');

    if (greeting) {
        messageDiv.innerHTML = `<p>Tusen takk, din melding vil straks dukke opp i gjesteboken :)</p>`;
    } else {
        messageDiv.innerHTML = `<p>Beklager, det ser ut som at meldingen din er tom... vennligst prøv igjen.</p>`;
    }
});