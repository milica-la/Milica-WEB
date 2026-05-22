var filmovi = [];

var btnDodajFilm = document.getElementById("btnDodajFilm");
var btnPrikaziFilmove = document.getElementById("btnPrikaziFilmove");
var btnPrimeni = document.getElementById("btnPrimeni");
var btnSacuvajIzmene = document.getElementById("btnSacuvajIzmene");

var formaSekcija = document.getElementById("formaSekcija");
var filmoviSekcija = document.getElementById("filmoviSekcija");

var movieForm = document.getElementById("movieForm");
var editForm = document.getElementById("editForm");

var nazivInput = document.getElementById("naziv");
var zanrInput = document.getElementById("zanr");
var trajanjeInput = document.getElementById("trajanje");
var godinaInput = document.getElementById("godina");
var ocenaInput = document.getElementById("ocena");
var glumciInput = document.getElementById("glumci");
var producentInput = document.getElementById("producent");
var izdavacInput = document.getElementById("izdavackaKuca");

var filterZanr = document.getElementById("filterZanr");
var sortiranje = document.getElementById("sortiranje");

var moviesContainer = document.getElementById("moviesContainer");
var brojFilmova = document.getElementById("brojFilmova");

var modalUredi = new bootstrap.Modal(document.getElementById("modalUredi"));

btnDodajFilm.addEventListener("click", prikaziFormu);
btnPrikaziFilmove.addEventListener("click", prikaziFilmove);
btnPrimeni.addEventListener("click", prikaziKarticeFilmova);
movieForm.addEventListener("submit", dodajFilm);
btnSacuvajIzmene.addEventListener("click", sacuvajIzmene);

function prikaziFormu() {
    formaSekcija.classList.remove("d-none");
    filmoviSekcija.classList.add("d-none");
}

function dodajFilm(e) {
    e.preventDefault();

    var naziv = nazivInput.value.trim();
    var zanr = zanrInput.value.trim();
    var trajanje = parseInt(trajanjeInput.value);
    var godina = parseInt(godinaInput.value);
    var ocena = parseFloat(ocenaInput.value);
    var glumci = glumciInput.value.trim();
    var producent = producentInput.value.trim();
    var izdavac = izdavacInput.value.trim();

    if (
        naziv === "" ||
        zanr === "" ||
        isNaN(trajanje) ||
        isNaN(godina) ||
        isNaN(ocena) ||
        trajanje <= 0 ||
        godina < 1888 ||
        ocena < 1 ||
        ocena > 10
    ) {
        alert("Popuni sva polja ispravno i unesi validne vrednosti.");
        return;
    }

    var podaci = new FormData(movieForm);

    var zahtev = new XMLHttpRequest();
    zahtev.open("POST", "php/dodaj_film.php", true);

    zahtev.onload = function() {
        alert(zahtev.responseText);
        movieForm.reset();
        prikaziFilmove();
    };

    zahtev.send(podaci);
}

function prikaziFilmove() {
    formaSekcija.classList.add("d-none");
    filmoviSekcija.classList.remove("d-none");

    var zahtev = new XMLHttpRequest();
    zahtev.open("GET", "php/prikazi_filmove.php", true);

    zahtev.onload = function() {
        try {
            filmovi = JSON.parse(zahtev.responseText);
        } catch (error) {
            filmovi = [];
        }
        prikaziKarticeFilmova();
    };

    zahtev.send();
}

function prikaziKarticeFilmova() {
    moviesContainer.innerHTML = "";

    var listaZaPrikaz = filmovi.slice();
    var zanrFilter = filterZanr.value;

    if (zanrFilter !== "Sve") {
        listaZaPrikaz = listaZaPrikaz.filter(function(film) {
            return film.zanr === zanrFilter;
        });
    }

    if (sortiranje.value === "az") {
        listaZaPrikaz.sort(function(a, b) {
            return a.zanr.localeCompare(b.zanr, "sr", { sensitivity: "base" });
        });
    }

    if (sortiranje.value === "za") {
        listaZaPrikaz.sort(function(a, b) {
            return b.zanr.localeCompare(a.zanr, "sr", { sensitivity: "base" });
        });
    }

    brojFilmova.textContent = listaZaPrikaz.length + " filmova";

    if (listaZaPrikaz.length === 0) {
        moviesContainer.innerHTML =
            '<div class="col-12">' +
            '<div class="empty-box p-5 text-center">' +
            '<h4 class="mb-2">Nema filmova za prikaz</h4>' +
            '<p class="text-muted mb-0">Dodaj film ili promeni filter.</p>' +
            "</div>" +
            "</div>";
        return;
    }

    listaZaPrikaz.forEach(function(film) {
        var linija = getGenreLineClass(film.zanr);
        var badge = getGenreBadgeClass(film.zanr);

        var posterHTML = "";
        if (film.poster && film.poster !== "") {
            posterHTML =
                '<img src="uploads/' +
                film.poster +
                '" class="card-img-top poster-img" alt="Poster filma">';
        }

        var kartica = document.createElement("div");
        kartica.className = "col-12 col-md-6 col-xl-4";
        kartica.innerHTML =
            '<div class="card movie-card">' +
            posterHTML +
            '<div class="card-top-line ' + linija + '"></div>' +
            '<div class="card-body p-4">' +
            '<div class="d-flex justify-content-between align-items-start mb-3">' +
            '<div>' +
            '<h4 class="card-title mb-2">' + film.naziv + '</h4>' +
            '<span class="badge ' + badge + '">' + film.zanr + '</span>' +
            '</div>' +
            '<div class="text-end text-muted">' + film.godina + '</div>' +
            '</div>' +
            '<div class="info-line"><strong>Trajanje:</strong> ' + film.trajanje + ' min</div>' +
            '<div class="info-line"><strong>Ocena:</strong> ' + parseFloat(film.ocena).toFixed(1) + '/10</div>' +
            '<div class="info-line"><strong>Producent:</strong> ' + film.producent + '</div>' +
            '<div class="info-line"><strong>Izdavač:</strong> ' + film.izdavacka_kuca + '</div>' +
            '<div class="mt-3"><strong>Glavni glumci:</strong><p class="text-muted mb-0">' + film.glavni_glumci + '</p></div>' +
            '<div class="d-flex gap-2 mt-4">' +
            '<button class="btn btn-sm btn-outline-primary btn-uredi">Uredi</button>' +
            '<button class="btn btn-sm btn-outline-danger btn-obrisi">Obriši</button>' +
            '</div>' +
            '</div>' +
            '</div>';

        var btnUredi = kartica.querySelector(".btn-uredi");
        var btnObrisi = kartica.querySelector(".btn-obrisi");

        btnUredi.addEventListener("click", function() {
            otvoriUrediModal(film);
        });

        btnObrisi.addEventListener("click", function() {
            obrisiFilm(film.id, film.naziv);
        });

        moviesContainer.appendChild(kartica);
    });
}

function getGenreLineClass(zanr) {
    var key = zanr.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return "line-" + key;
}

function getGenreBadgeClass(zanr) {
    switch (zanr) {
        case "Akcija":
            return "text-bg-danger";
        case "Drama":
            return "text-bg-primary";
        case "Komedija":
            return "text-bg-warning text-dark";
        case "Triler":
            return "text-bg-info text-dark";
        case "SF":
            return "text-bg-success";
        case "Horor":
            return "text-bg-dark";
        case "Animirani":
            return "text-bg-secondary";
        case "Dokumentarni":
            return "text-bg-success";
        default:
            return "text-bg-primary";
    }
}

function otvoriUrediModal(film) {
    document.getElementById("editId").value = film.id;
    document.getElementById("editNaziv").value = film.naziv;
    document.getElementById("editZanr").value = film.zanr;
    document.getElementById("editTrajanje").value = film.trajanje;
    document.getElementById("editGodina").value = film.godina;
    document.getElementById("editOcena").value = film.ocena;
    document.getElementById("editGlumci").value = film.glavni_glumci;
    document.getElementById("editProducent").value = film.producent;
    document.getElementById("editIzdavackaKuca").value = film.izdavacka_kuca;
    document.getElementById("editPoster").value = "";
    modalUredi.show();
}

function sacuvajIzmene() {
    var naziv = document.getElementById("editNaziv").value.trim();
    var zanr = document.getElementById("editZanr").value.trim();
    var trajanje = parseInt(document.getElementById("editTrajanje").value);
    var godina = parseInt(document.getElementById("editGodina").value);
    var ocena = parseFloat(document.getElementById("editOcena").value);

    if (
        naziv === "" ||
        zanr === "" ||
        isNaN(trajanje) ||
        isNaN(godina) ||
        isNaN(ocena) ||
        trajanje <= 0 ||
        godina < 1888 ||
        ocena < 1 ||
        ocena > 10
    ) {
        alert("Popuni sva polja ispravno i unesi validne vrednosti.");
        return;
    }

    var podaci = new FormData(editForm);
    var zahtev = new XMLHttpRequest();
    zahtev.open("POST", "php/uredi_film.php", true);

    zahtev.onload = function() {
        alert(zahtev.responseText);
        modalUredi.hide();
        prikaziFilmove();
    };

    zahtev.send(podaci);
}

function obrisiFilm(id, naziv) {
    if (!confirm("Da li sigurno želiš da obrišeš film \"" + naziv + "\"?")) {
        return;
    }

    var podaci = new FormData();
    podaci.append("id", id);

    var zahtev = new XMLHttpRequest();
    zahtev.open("POST", "php/obrisi_film.php", true);

    zahtev.onload = function() {
        alert(zahtev.responseText);
        prikaziFilmove();
    };

    zahtev.send(podaci);
}