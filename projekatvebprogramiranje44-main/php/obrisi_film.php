<?php

include "konekcija_sa_bazom.php";

$id = $_POST["id"];

$slikaUpit = $baza->prepare("SELECT poster FROM filmovi WHERE id = :id");
$slikaUpit->bindValue(":id", $id);
$slikaRez = $slikaUpit->execute();
$slikaRed = $slikaRez->fetchArray(SQLITE3_ASSOC);

if ($slikaRed && $slikaRed["poster"] != "") {
    $putanjaSlike = __DIR__ . "/../uploads/" . $slikaRed["poster"];
    if (file_exists($putanjaSlike)) {
        unlink($putanjaSlike);
    }
}

$upit = $baza->prepare("DELETE FROM filmovi WHERE id = :id");
$upit->bindValue(":id", $id);
$rezultat = $upit->execute();

if ($rezultat) {
    echo "Film uspešno obrisan.";
} else {
    echo "Greška pri brisanju filma.";
}

?>
