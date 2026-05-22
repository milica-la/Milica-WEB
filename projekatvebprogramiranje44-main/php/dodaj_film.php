<?php

include "konekcija_sa_bazom.php";

$naziv = $_POST["naziv"];
$zanr = $_POST["zanr"];
$trajanje = $_POST["trajanje"];
$godina = $_POST["godina"];
$glavniGlumci = $_POST["glavni_glumci"];
$producent = $_POST["producent"];
$izdavackaKuca = $_POST["izdavacka_kuca"];
$ocena = $_POST["ocena"];

$nazivPostera = "";

if (isset($_FILES["poster"]) && $_FILES["poster"]["error"] == 0) {
    $folder = __DIR__ . "/../uploads/";

    if (!file_exists($folder)) {
        mkdir($folder, 0777, true);
    }

    $originalniNaziv = $_FILES["poster"]["name"];
    $privremenaPutanja = $_FILES["poster"]["tmp_name"];

    $ekstenzija = pathinfo($originalniNaziv, PATHINFO_EXTENSION);

    $nazivPostera = time() . "_" . rand(1000, 9999) . "." . $ekstenzija;

    $novaPutanja = $folder . $nazivPostera;

    move_uploaded_file($privremenaPutanja, $novaPutanja);
}

$upit = $baza->prepare("
INSERT INTO filmovi
(
    naziv,
    zanr,
    trajanje,
    godina,
    glavni_glumci,
    producent,
    izdavacka_kuca,
    ocena,
    poster
)
VALUES
(
    :naziv,
    :zanr,
    :trajanje,
    :godina,
    :glavni_glumci,
    :producent,
    :izdavacka_kuca,
    :ocena,
    :poster
)
");

$upit->bindValue(":naziv", $naziv);
$upit->bindValue(":zanr", $zanr);
$upit->bindValue(":trajanje", $trajanje);
$upit->bindValue(":godina", $godina);
$upit->bindValue(":glavni_glumci", $glavniGlumci);
$upit->bindValue(":producent", $producent);
$upit->bindValue(":izdavacka_kuca", $izdavackaKuca);
$upit->bindValue(":ocena", $ocena);
$upit->bindValue(":poster", $nazivPostera);

$rezultat = $upit->execute();

if ($rezultat) {
    echo "Film uspešno dodat.";
} else {
    echo "Greška pri dodavanju filma.";
}

?>