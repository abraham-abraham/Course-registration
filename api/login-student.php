<?php
include('../utils/json.php'); //json function -> encoded JSON
include('../sql/database.php'); //connect DB

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-type: application/json");

$params = json_decode(file_get_contents('php://input'), TRUE);
$studentID = $params["studentID"];

// build SELECT query
$query = "SELECT studentID FROM student WHERE studentID = $studentID";

if (!($result = mysqli_query($database, $query))) {
    echo (json($database->error, 'server-error'));
    exit;
}

$myArray = [];
while ($row = $result->fetch_assoc()) {
    $myArray[] = $row;
}

echo json($myArray, null);

mysqli_close($database);
