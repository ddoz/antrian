<?php
header("Access-Control-Allow-Origin: *");
$mysqli = new mysqli("localhost","c3kki","databasekki","c3antrian");

if ($mysqli -> connect_errno) {
  echo "Failed to connect to MySQL: " . $mysqli -> connect_error;
  exit();
}

$state = $_POST['state'];

// CREATE SESSION
if($state == 'CREATE_SESSION') {
    $namaSesi = generateRandomString(7);
    $jumlahLoket = $_POST['jumlahLoket'];
    
    //INSERT SESSION BARU
    $mysqli -> query("INSERT INTO sesi (nama_sesi) VALUES ('$namaSesi')");
    //INSERT SESI ANTRIAN
    $mysqli -> query("INSERT INTO sesi_antrian (nama_sesi,nomor_terakhir) VALUES ('$namaSesi','1')");

    for($i=1;$i<=$jumlahLoket;$i++) {
        //INSERT SESI LOKET
        $mysqli -> query("INSERT INTO sesi_loket (nama_sesi,nomor_loket,antrian_nomor) VALUES ('$namaSesi','$i','1')");

    }

    $output = array(
        "namaSesi" => $namaSesi,
        "jumlahLoket" => $jumlahLoket
    );
    echo json_encode($output);
}

// NEXT NUMBER LOKET
if($state == 'NEXT_NUMBER') {
    $loketNo = $_POST['loket'];
    $namaSesi = $_POST['namaSesi'];
    //UPDATE ANTRIAN LOKET DAN LAST ANTRIAN
    $lastNumber = $mysqli -> query("SELECT nomor_terakhir FROM sesi_antrian WHERE nama_sesi = '$namaSesi'");
    $output = array(
        'loket' => $loketNo
    );
    while ($row = $lastNumber -> fetch_row()) {
        $next = (int)$row[0] + 1;
        $mysqli -> query("UPDATE sesi_antrian SET nomor_terakhir = '$next' WHERE nama_sesi = '$namaSesi'");
        $mysqli -> query("UPDATE sesi_loket SET antrian_nomor = '$next' WHERE nama_sesi = '$namaSesi' AND nomor_loket = '$loketNo'");
        $output['next'] = $next;
    }
    echo json_encode($output);
}

// GET LAST NUMBER SESI
if($state == 'LOKET_ANTRIAN') {
    // SELECT LAST NUMBER DARI LOKET
    $loketNo = $_POST['loket'];
    $namaSesi = $_POST['namaSesi'];
    $output = array(
        'number' => '1'
    );
    $lastNumber = $mysqli -> query("SELECT antrian_nomor FROM sesi_loket WHERE nama_sesi = '$namaSesi' and nomor_loket='$loketNo'");
    while ($row = $lastNumber -> fetch_row()) {
        $output['number'] = $row[0];
    }
    echo json_encode($output);
}

$mysqli -> close();


function generateRandomString($length = 7) {
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    $charactersLength = strlen($characters);
    $randomString = '';

    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }

    return $randomString;
}