<?php

include "konekcija_sa_bazom.php";

$sql = "
CREATE TABLE IF NOT EXISTS filmovi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    naziv TEXT,
    zanr TEXT,
    trajanje INTEGER,
    godina INTEGER,
    glavni_glumci TEXT,
    producent TEXT,
    izdavacka_kuca TEXT,
    ocena REAL,
    poster TEXT
)
";

$baza->exec($sql);

echo "Baza i tabela su uspešno kreirane.<br>";
echo "Putanja baze: " . $putanja;

?>