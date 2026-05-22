<?php

include "konekcija_sa_bazom.php";

$id = $_POST["id"];
$naziv = $_POST["naziv"];
$zanr = $_POST["zanr"];
$trajanje = $_POST["trajanje"];
$godina = $_POST["godina"];
$glavniGlumci = $_POST["glavni_glumci"];
$producent = $_POST["producent"];
$izdavackaKuca = $_POST["izdavacka_kuca"];
$ocena = $_POST["ocena"];

$staraSlikaUpit = $baza->prepare("SELECT poster FROM filmovi WHERE id = :id");
$staraSlikaUpit->bindValue(":id", $id);
$staraSlikaRez = $staraSlikaUpit->execute();
$staraSlikaRed = $staraSlikaRez->fetchArray(SQLITE3_ASSOC);
$nazivPostera = $staraSlikaRed["poster"];

if (isset($_FILES["poster"]) && $_FILES["poster"]["error"] == 0) {
    $folder = __DIR__ . "/../uploads/";

    if (!file_exists($folder)) {
        mkdir($folder, 0777, true);
    }

    $originalniNaziv = $_FILES["poster"]["name"];
    $privremenaPutanja = $_FILES["poster"]["tmp_name"];

    $ekstenzija = pathinfo($originalniNaziv, PATHINFO_EXTENSION);

    $noviNaziv = time() . "_" . rand(1000, 9999) . "." . $ekstenzija;
    $novaPutanja = $folder . $noviNaziv;

    move_uploaded_file($privremenaPutanja, $novaPutanja);
    $nazivPostera = $noviNaziv;
}

$upit = $baza->prepare("
UPDATE filmovi SET
    naziv = :naziv,
    zanr = :zanr,
    trajanje = :trajanje,
    godina = :godina,
    glavni_glumci = :glavni_glumci,
    producent = :producent,
    izdavacka_kuca = :izdavacka_kuca,
    ocena = :ocena,
    poster = :poster
WHERE id = :id
");

$upit->bindValue(":id", $id);
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
    echo "Film uspešno izmenjen.";
} else {
    echo "Greška pri izmeni filma.";
}

?>
