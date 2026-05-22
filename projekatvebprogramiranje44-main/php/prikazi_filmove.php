<?php

include "konekcija_sa_bazom.php";

$rezultat = $baza->query("
SELECT *
FROM filmovi
ORDER BY id DESC
");

$filmovi = array();

while ($red = $rezultat->fetchArray(SQLITE3_ASSOC)) {
    $filmovi[] = $red;
}

echo json_encode($filmovi, JSON_UNESCAPED_UNICODE);

?>