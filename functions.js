/** Navigation stuff */

let firstTimeLoad = true;

function navigateToPage(page) {

    const pageElements = [
        "forsiden",
        "endelig-gift",
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
                    //document.querySelector(".navbar-toggler").click();

                    const navbarToggler = document.querySelector(".navbar-toggler");
                    const navbarMenu = document.querySelector(".navbar-collapse");

                    // Check if the menu is open before trying to close it
                    if (navbarMenu.classList.contains("show")) {
                        navbarToggler.click();
                        console.log("Nav menu was open, closing it.");
                    }

                    //console.log("firstTimeLoad is false, toggle menu");
                } else {
                    firstTimeLoad = false;
                    //console.log("firstTimeLoad was true, do not toggle menu");
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

    // sendVisitorStats();
}

function setPageFromUrl() {
    const url = window.location.href;
    if (url.includes("forsiden")) {
        navigateToPage("forsiden");
    } else if (url.includes("endelig-gift")) {
        navigateToPage("endelig-gift");
    } else if (url.includes("praktisk-info")) {
        navigateToPage("praktisk-info");
        populateGuestlist();
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
                if (location.href.indexOf("stopNav") !== -1) {
                    console.log("Dont navigate! Fake popstate for gallery.");
                    return;
                }
                setPageFromUrl();
                killModals();
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


/** Populate a gallery with images */

// Keep per-carousel instance + listener so we can clean them up safely
window.__carouselState = window.__carouselState || {};


async function populateGallery() {

    // await populateOneGallery({
    //   url: "https://teknix.no/chakims/gallerywedding",
    //   elSelector: "#galleryimagesWedding",
    //   storageKey: "imagesForCarouselWedding",
    //   galleryName: "wedding"
    // });
  
    // await populateOneGallery({
    //   url: "https://teknix.no/chakims/gallery",
    //   elSelector: "#galleryimages",
    //   storageKey: "imagesForCarousel",
    //   galleryName: "misc"
    // });

    const response = await fetch("https://teknix.no/chakims/gallerywedding", {
        headers: { Authorization: "chakims6969" },
        mode: "cors"
      });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const images = await response.json();

    renderGallery({ images, container: '#galleryimagesWedding', galleryName: 'wedding', wideThreshold: 1.3 });


    console.log('Setting up event listeners for image galleries...');

    // Handle gallery clicks (open modal or delete image)
    document.addEventListener("click", (e) => {
        const galleryEl = e.target.closest(".galleryitem");
        // if (!galleryEl) return;
    
        // Delete button clicked?
        if (e.target.matches("[data-delete]")) {
            e.stopPropagation(); // prevent opening modal
            const img = e.target.getAttribute("data-delete");
            const gallery = galleryEl.getAttribute("data-gallery");
            deleteImage(img, gallery);
            return;
        }
    
        // Open modal
        if (galleryEl) {
            const index = parseInt(galleryEl.getAttribute("data-index"), 10);
            const gallery = galleryEl.getAttribute("data-gallery");
            openModal(index, gallery);
        }
    });
}

async function populateOneGallery({ url, elSelector, storageKey, galleryName }) {
    console.log(`Populating gallery: ${galleryName} from ${url}`);
    const el = document.querySelector(elSelector);
    el.innerHTML = `<div class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Laster...</span>
        </div>
      </div>`;
  
    try {
      const response = await fetch(url, {
        headers: { Authorization: "chakims6969" },
        mode: "cors"
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const images = await response.json();
      localStorage.setItem(storageKey, JSON.stringify(images));
  
    //   let html = '<div class="row g-0">';
    //   images.forEach((img, index) => {
    //     const bg = img.type === "video" ? img.thumb : img.src;
    //     const icon = img.type === "video" ? `<div class="video-overlay"><span class="play-icon">&#9658;</span></div>` : "";
    //     html += `
    //       <div class="col-4 col-sm-3 col-md-2 galleryimage"
    //            style="background-image:url('https://teknix.no/chakims${bg}');"
    //            data-index="${index}" data-gallery="${galleryName}">
    //         ${isAdmin() && isEditMode() ? `<button class="btn btn-dark btn-sm" data-delete="${img.src}">&cross;</button>` : ""}
    //         ${icon}
    //       </div>`;
    //   });
    //   html += `</div><small class="mt-2">Antall bilder: ${images.length}</small>`;

        let html = '<div class="gallery">';
        images.forEach((img, index) => {
        const src = img.type === "video" ? img.thumb : img.src;
        const icon = img.type === "video"
            ? `<div class="video-overlay"><span class="play-icon">&#9658;</span></div>`
            : "";

        // Automatically mark wide images
        const spanClass = (img.width > img.height * 1.3) ? "wide" : ""; 

        html += `
            <div class="galleryitem ${spanClass}" data-index="${index}" data-gallery="${galleryName}">
            <img src="https://teknix.no/chakims${src}" loading="lazy" />
            ${isAdmin() && isEditMode() ? `<button class="btn btn-dark btn-sm" data-delete="${img.src}">&cross;</button>` : ""}
            ${icon}
            </div>`;
        });
        html += `</div><small class="mt-2">Antall bilder: ${images.length}</small>`;


        // 2) After insertion, calculate row spans so items pack row-wise
function computeRowSpan(item, grid) {
  const rowHeight = parseInt(getComputedStyle(grid).getPropertyValue('grid-auto-rows'), 10);
  const gap = parseInt(getComputedStyle(grid).getPropertyValue('gap'), 10);
  const img = item.querySelector('img');

  // Use the image's rendered height
  const h = img?.getBoundingClientRect().height || item.getBoundingClientRect().height;
  const span = Math.ceil((h + gap) / (rowHeight + gap));
  item.style.gridRowEnd = `span ${span}`;
}

function layoutGrid(grid) {
  const items = grid.querySelectorAll('.galleryitem');
  items.forEach(item => computeRowSpan(item, grid));
}

function initMasonryGrid(root = document) {
  const grid = root.querySelector('.gallery');
  if (!grid) return;

  // Run once images have loaded (and also for cached images)
  grid.querySelectorAll('.galleryitem img').forEach(img => {
    const item = img.closest('.galleryitem');
    if (img.complete) {
      computeRowSpan(item, grid);
    } else {
      img.addEventListener('load', () => computeRowSpan(item, grid), { once: true });
    }
  });

  // Fallback pass + resize handling
  requestAnimationFrame(() => layoutGrid(grid));
  window.addEventListener('resize', () => layoutGrid(grid));
}

// Call after you inject the gallery HTML
initMasonryGrid();




  
      el.innerHTML = html;
    } catch (err) {
      console.error("Feil ved henting av bilder:", err);
      el.innerHTML = `
        <div class="alert alert-danger my-3" role="alert">
          Beklager, men en feil har oppstått! :(<br>
          Klarte ikke hente bildene...<br><br>
          Feilmelding: ${err.message}
        </div>`;
    }
}
  


function openModal(startIndex, gallery = "misc") {
    const carouselId = gallery === "wedding" ? "carouselModalWedding" : "carouselModal";
    const modalId    = gallery === "wedding" ? "imageModalWedding"   : "imageModal";
  
    const carouselEl   = document.getElementById(carouselId);
    const carouselInner = carouselEl.querySelector(".carousel-inner");
    const modalEl      = document.getElementById(modalId);
  
    const imagesKey = gallery === "wedding" ? "imagesForCarouselWedding" : "imagesForCarousel";
    const items = JSON.parse(localStorage.getItem(imagesKey)) || [];
    if (!items.length) return;
  
    // --- clean up any previous instance/listener on this carousel ---
    const prevState = window.__carouselState[carouselId];
    if (prevState) {
      try { carouselEl.removeEventListener("slid.bs.carousel", prevState.handler); } catch (_) {}
      try { prevState.instance.dispose(); } catch (_) {}
      window.__carouselState[carouselId] = null;
    }
  
    // modular index helper (supports wrap-around)
    const mod = (i) => (i + items.length) % items.length;
  
    // create one slide element
    const createItem = (index, active = false) => {
      const itemData = items[mod(index)];
  
      const item = document.createElement("div");
      item.className = `carousel-item${active ? " active" : ""}`;
      item.dataset.index = String(mod(index));
  
      if (itemData.type === "video") {
        const v = document.createElement("video");
        v.className = "d-block w-100";
        v.controls = true;
        v.preload = "metadata";
        v.src = `https://teknix.no/chakims${itemData.src}`;
        item.appendChild(v);
      } else {
        const img = document.createElement("img");
        img.className = "d-block w-100";
        img.loading = "lazy";
        img.alt = "Image";
        img.src = `https://teknix.no/chakims${itemData.src}`;
        item.appendChild(img);
      }
      return item;
    };
  
    // initial 3 slides: prev / current / next
    const prevIdx = mod(startIndex - 1);
    const currIdx = mod(startIndex);
    const nextIdx = mod(startIndex + 1);
  
    carouselInner.textContent = "";
    carouselInner.appendChild(createItem(prevIdx, false));
    carouselInner.appendChild(createItem(currIdx,  true));
    carouselInner.appendChild(createItem(nextIdx, false));
  
    // show modal
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  
    // init carousel (wrap enabled so arrows always work)
    const instance = bootstrap.Carousel.getOrCreateInstance(carouselEl, {
      interval: false,
      ride: false,
      wrap: true
    });
  
    // after each slide completes, rebuild neighbors around the new active index
    const handler = () => {
      // pause any playing videos
      carouselInner.querySelectorAll("video").forEach(v => v.pause());
  
      const active = carouselInner.querySelector(".carousel-item.active");
      const currentIndex = Number(active?.dataset.index ?? 0);
  
      const newPrev = mod(currentIndex - 1);
      const newNext = mod(currentIndex + 1);
  
      // rebuild the 3 items
      carouselInner.textContent = "";
      carouselInner.appendChild(createItem(newPrev, false));
      carouselInner.appendChild(createItem(currentIndex, true));
      carouselInner.appendChild(createItem(newNext, false));
  
      // auto-play active video (optional)
      setTimeout(() => {
        const activeVideo = carouselInner.querySelector(".carousel-item.active video");
        if (activeVideo) {
          activeVideo.play();
        }
      }, 100);
    };
  
    carouselEl.addEventListener("slid.bs.carousel", handler);
    handler();
  
    // save state so we can clean up next time
    window.__carouselState[carouselId] = { instance, handler };

    if(location.href.indexOf("stopNav") === -1) {
        history.pushState({ modalOpen: modalId }, '', `#galleri?stopNav=true`);
    }
}

  

function killModals() {
    // Stop all playing videos
    document.querySelectorAll("video").forEach(video => {
        video.pause();
        video.currentTime = 0; // reset to start
    });

    // Close all Bootstrap modals
    const modals = document.querySelectorAll(".modal");
    modals.forEach(modal => {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
            bsModal.hide();
        }
    });

    console.log("Killed all modals and stopped videos.");
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
                <div class="card bg-warning-subtle position-relative">
                    <div class="card-body">
                        <p class="card-text">${entry.greeting}</p>
                        <div class="clearfix">
                            <p class="card-text float-start">
                                <button class="btn btn-danger btn-sm m-0" onclick="likeGreeting('${entry.id}')">
                                    &hearts; ${entry.likes || ''}
                                </button>
                            </p>
                            <p class="card-text text-end float-end">
                                <small class="text-muted">${new Date(entry.id).toLocaleString()}</small>
                            </p>
                        </div>

                        <!-- Admin delete button -->
                        ${isAdmin() && isEditMode() ? `
                            <button class="btn btn-dark btn-sm position-absolute top-0 end-0 m-0" onclick="deleteGreeting('${entry.id}')">&cross;</button>
                        ` : ''}

                        <!-- Reply section -->
                        ${entry.reply ? `
                            <div id="reply-${entry.id}">
                                <div class="p-1 border rounded" style="background:rgba(255,255,255,0.5); font-size:1rem;">
                                    <b>Svar:</b><br>${entry.reply}
                                    ${isAdmin() && isEditMode() ? `
                                        <div class="text-end">
                                            <button class="btn btn-link btn-sm" onclick="editReply('${entry.id}', '${entry.reply.replace(/'/g, "\\'")}')">✎ Rediger</button>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        ` : (isAdmin() && isEditMode() ? `
                            <form class="mt-3" onsubmit="submitReply(event, '${entry.id}')">
                                <div class="input-group">
                                    <input type="text" class="form-control form-control-sm" placeholder="Skriv et svar..." name="reply" required>
                                    <button class="btn btn-primary btn-sm" type="submit">Svar</button>
                                </div>
                            </form>
                        ` : '')}
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

/** Guestbook reply */

function editReply(id, currentReply) {
    const replyDiv = document.getElementById(`reply-${id}`);
    replyDiv.innerHTML = `
        <form onsubmit="submitReply(event, '${id}')">
            <div class="input-group mt-2">
                <input type="text" class="form-control form-control-sm" name="reply" value="${currentReply}" required>
                <button class="btn btn-primary btn-sm" type="submit">Lagre</button>
                <button class="btn btn-secondary btn-sm" type="button" onclick="cancelEditReply('${id}', '${currentReply.replace(/'/g, "\\'")}')">Avbryt</button>
            </div>
        </form>
    `;
}
function cancelEditReply(id, currentReply) {
    const replyDiv = document.getElementById(`reply-${id}`);
    replyDiv.innerHTML = `
        <div class="p-1 border rounded" style="background:rgba(255,255,255,0.5); font-size:1rem;">
            <b>Svar:</b><br>${currentReply}
            ${isAdmin() && isEditMode() ? `
                <div class="text-end">
                    <button class="btn btn-link btn-sm" onclick="editReply('${id}', '${currentReply.replace(/'/g, "\\'")}')">✎ Rediger</button>
                </div>
            ` : ''}
        </div>
    `;
}
function submitReply(e, id) {
    e.preventDefault();
    const form = e.target;
    const replyMsg = form.reply.value.trim();
    if (!replyMsg) return;

    fetch(`https://teknix.no/chakims/greeting/${id}/reply`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'chakims6969' 
        },
        mode: 'cors',
        body: JSON.stringify({ reply: replyMsg })
    })
    .then(res => res.json())
    .then(data => {
        console.log('Reply saved:', data);
        // Refresh guestbook UI or update this card directly
        populateGuestbook(); // if you already have a refresh function
    })
    .catch(err => console.error('Error saving reply:', err));
}





/** Populate the guest list */
function populateGuestlist() {
    const guestList = [
        "Chanett",
        "Kim Eirik",
        "Vito - Kim og Chanetts sønn [BARN]",
        "Janne - Kims søster",
        "Jan Erik - Jannes mann",
        "Erik - Kims bror og forlover",
        "Ingunn - Chanetts mamma",
        "Kjell - Chanetts pappa",
        "Susanne - Chanetts søster",
        "Ayla - Susannes datter [BARN]",
        "Eirik - Susannes sønn",
        "Silje - Eiriks samboer",
        "Oda - Erik og Siljes datter [BABY]",
        "JoInge - Chanetts bror",
        "Fred - Chanetts bror",
        "Wenche - Freds kone",
        "Live - Fred og Wenches datter",
        "Tonje - Fred og Wenches datter",
        "Kjetil - Chanetts bror",
        "Anita - Kjetils kone",
        "Julian - Kjetil/Anitas sønn",
        "Lise - Chanetts søster",
        "Per Anders - Lises mann",
        "Nina - Chanetts søster",
        "Ingrid - Ninas datter",
        "Tone - Ingrids venninne",
        "Mari - Lises datter",
        "Amanda - Chanetts venn",
        "Elin - Amandas kone",
        "Maria - Elins mamma",
        "Ville - Amanda/Elins sønn [BABY]",
        "Elise - Chanetts venn",
        "Emelie - Elises samboer",
        "Tom Erik - Chanetts bestevenn og forlover",
        "Thomas - Tom Eriks kjæreste",
        "Anker - Thomas' sønn [BARN]",
        "Petter - Thomas' sønn [BARN]"
    ];
    const el = document.querySelector('#guestlist');
    el.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Laster...</span></div></div>';
    setTimeout(() => {

        if(isAdmin() || isModerator()) {
            let html = '<ul class="list-group">';
            guestList.forEach(guest => {
                html += `<li class="list-group-item" style="background:rgba(255,255,255,0.3);">${guest}</li>`;
            });
            html += `<li class="list-group-item" style="background:rgba(255,255,255,0.3);"><b>Totalt: ${guestList.length} stk. (${guestList.length-6} stk ekskl barn/baby under 18 år)</b></li>`;
            html += '</ul>';
            el.innerHTML = html;
        } else {
            el.innerHTML = `<span onclick="authenticateModerator()" class="btn btn-primary btn-sm">Klikk for å laste</span>`;
        }
    }, 250);
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

document.querySelector("#manuallyLoadGalleryWedding").addEventListener('click', (e) => {
    e.preventDefault();
    populateGallery();
});

document.querySelector("#manuallyLoadGuestbookEntries").addEventListener('click', (e) => {
    e.preventDefault();
    populateGuestbook();
});

/** Event listener for forms */

document.getElementById('galleryUploadForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const messageDiv = document.getElementById('galleryUploadStatus');
    const fileInput = document.getElementById('inputFile');
    const files = fileInput.files;

    if (files.length === 0) {
        messageDiv.innerHTML = '<div class="alert alert-warning">Ingen filer valgt!</div>';
        return;
    }

    messageDiv.innerHTML = ''; // clear previous

    // Create a progress div for each file
    const progressBars = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progressWrapper = document.createElement('div');
        progressWrapper.className = 'mb-2';
        progressWrapper.innerHTML = `
            <div class="progress">
                <div style="width:30%;">${file.name}</div>
                <div class="progress-bar" role="progressbar" style="width:0%">0%</div>
            </div>
        `;
        messageDiv.appendChild(progressWrapper);
        progressBars.push(progressWrapper.querySelector('.progress-bar'));
    }

    // Upload each file individually to track progress
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('files', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://teknix.no/chakims/gallery');

        xhr.setRequestHeader('Authorization', 'chakims6969');

        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                progressBars[i].style.width = percent + '%';
                progressBars[i].textContent = percent + '%';
            }
        });

        xhr.addEventListener('load', () => {
            progressBars[i].style.width = '100%';
            progressBars[i].textContent = '✅ Ferdig';
            if (i === files.length - 1) {
                populateGallery(); // reload gallery after last file
            }
        });

        xhr.addEventListener('error', () => {
            progressBars[i].classList.add('bg-danger');
            progressBars[i].textContent = '❌ Feil';
        });

        xhr.send(formData);
    }
});


document.getElementById('galleryUploadFormWedding').addEventListener('submit', function(e) {
    e.preventDefault();

    const messageDiv = document.getElementById('galleryUploadStatusWedding');
    const fileInput = document.getElementById('inputFileWedding');
    const files = fileInput.files;

    if (files.length === 0) {
        messageDiv.innerHTML = '<div class="alert alert-warning">Ingen filer valgt!</div>';
        return;
    }

    messageDiv.innerHTML = ''; // clear previous

    // Create a progress div for each file
    const progressBars = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progressWrapper = document.createElement('div');
        progressWrapper.className = 'mb-2';
        progressWrapper.innerHTML = `
            <div class="progress">
                <div style="width:30%;">${file.name}</div>
                <div class="progress-bar" role="progressbar" style="width:0%">0%</div>
            </div>
        `;
        messageDiv.appendChild(progressWrapper);
        progressBars.push(progressWrapper.querySelector('.progress-bar'));
    }

    // Upload each file individually to track progress
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('files', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://teknix.no/chakims/gallerywedding');

        xhr.setRequestHeader('Authorization', 'chakims6969');

        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                progressBars[i].style.width = percent + '%';
                progressBars[i].textContent = percent + '%';
            }
        });

        xhr.addEventListener('load', () => {
            progressBars[i].style.width = '100%';
            progressBars[i].textContent = '✅ Ferdig';
            if (i === files.length - 1) {
                populateGallery(); // reload gallery after last file
            }
        });

        xhr.addEventListener('error', () => {
            progressBars[i].classList.add('bg-danger');
            progressBars[i].textContent = '❌ Feil';
        });

        xhr.send(formData);
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
        messageDiv.innerHTML = `<div class="alert alert-danger">Vennligst skriv en hilsen først 😊</div>`;
        emptyUploadStatusDivs();
    }
});





/** DELETE STUFF */
function deleteGreeting(id) {
    if (confirm("Er du sikker på at du vil slette denne hilsenen?")) {
        try {
            fetch(`https://teknix.no/chakims/greeting/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'chakims6969'
                },
                mode: 'cors'
            }).then(() => {
                populateGuestbook();
            });
        } catch (error) {
            console.error("Error deleting greeting: ", error);
        }
    }
}

/** LIKE GREETING */
function likeGreeting(id) {
    
    try {
        fetch(`https://teknix.no/chakims/greeting/${id}/like`, {
            method: 'POST',
            headers: {
                'Authorization': 'chakims6969'
            },
            mode: 'cors'
        }).then(() => {
            populateGuestbook();
        });
    } catch (error) {
        console.error("Error deleting greeting: ", error);
    }
}

/** DELETE IMAGE */
function deleteImage(filename, gallery = "misc") {
    if (confirm("Er du sikker på at du vil slette dette bildet? Kan ikke angres!")) {
        try {
            const file = filename.split("/").pop();
            const endpoint = gallery === "wedding" ? 'gallerywedding' : 'gallery';
            fetch(`https://teknix.no/chakims/${endpoint}/${file}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'chakims6969'
                },
                mode: 'cors'
            }).then(() => {
                location.reload();
            });
        } catch (error) {
            console.error("Error deleting image: ", error);
        }
    }
    return;
}


/** Admin stuff */
async function authenticateAdmin() {
    if (isAdmin()) {
        console.log("Already authenticated");
        return;
    }
    const prompt = "Skriv inn passordet for å få tilgang til admin-funksjonalitet:";
    const password = window.prompt(prompt);

    try {
        const response = await fetch(`https://teknix.no/chakims/admin`, {
            method: 'POST',
            headers: {
                'Authorization': 'chakims6969',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: password }),
            mode: 'cors'
        });
        
        const result = await response.json();

        if (result.hasOwnProperty('error')) {
            console.error("Error authenticating as admin: ", result.error);
            localStorage.removeItem("admin");
            return;
        }
        if (result.hasOwnProperty('status') && result.status === "OK") {
            localStorage.setItem("admin", "true");
            location.reload();
        }
    } catch (error) {
        console.error("Error authenticating as admin: ", error);
        localStorage.removeItem("admin");
    }
}
function logout() {
    localStorage.removeItem("admin");
    localStorage.removeItem("editMode");
    localStorage.removeItem("moderator");
    location.reload();
}
function authenticateModerator() {
    const prompt = window.prompt("Skriv inn moderator passord:");
    if (prompt === "jøa25") {
        localStorage.setItem("moderator", "true");
        populateGuestlist();
    }
}
function toggleEditMode() {
    const editMode = localStorage.getItem("editMode") === "true";
    if (editMode) {
        localStorage.removeItem("editMode");
        console.log("Edit mode disabled.");
    } else {
        localStorage.setItem("editMode", "true");
        console.log("Edit mode enabled.");
    }
    location.reload();
}
function isAdmin() {
    return localStorage.getItem("admin") === "true";
}
function isEditMode() {
    return localStorage.getItem("editMode") === "true";
}
function isModerator() {
    return localStorage.getItem("moderator") === "true";
}
function showAdminPanel() {
    galleryAdminPanel = document.querySelectorAll(".galleryAdminPanel");
    if (galleryAdminPanel) {
        console.log("Found gallery admin panel elements, showing them if admin...");
        if (isAdmin()) {
            galleryAdminPanel.forEach((panel) => {
                panel.style.display = "block";
            });
        }
    }
}






/** Visitor stats */

async function sendVisitorStats() {
    try {
        // Get user agent details
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        const language = navigator.language;

        // Get screen size
        const screenWidth = screen.width;
        const screenHeight = screen.height;

        // Get IP & Location (using an external API)
        const ipData = await fetch("https://ipapi.co/json/").then(res => res.json());

        const userdata = {
            ip: ipData.ip,
            city: ipData.city,
            region: ipData.region,
            country: ipData.country_name,
            browser: userAgent,
            device: platform,
            language,
            screenSize: `${screenWidth}x${screenHeight}`,
            page: window.location.href
        };

        // Send to backend
        // await fetch("https://teknix.no/chakims/stats", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": "chakims6969"
        //     },
        //     body: JSON.stringify({ userdata })
        // });

        console.log("Visitor stats sent:", userdata);
    } catch (error) {
        console.error("Error sending visitor stats:", error);
    }
}



/** Confetti function and event handler */

function launchConfetti() {
    console.log("Launching confettis!! :D");
    const numConfetti = 50; // Adjust for more/less confetti
    const colors = ["red", "blue", "yellow", "green", "purple", "orange"];
    
    for (let i = 0; i < numConfetti; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.setProperty("--confetti-color", colors[Math.floor(Math.random() * colors.length)]);
        confetti.style.setProperty("--confetti-x", `${(Math.random() - 0.5) * 200}px`);
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDuration = `${Math.random() * 2 + 2}s`; // Random speed
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        //setTimeout(() => confetti.remove(), 3000);
        setTimeout(() => confetti.remove(), (parseFloat(confetti.style.animationDuration) * 1000) + 500);

    }
}

// Example: Run confetti when clicking a button
setTimeout(() => {
    console.log("Enabling confetti!");
    document.querySelectorAll(".confetti-button").forEach((el) => {
        el.addEventListener("click", launchConfetti);
    });

    showAdminPanel();
},100);
