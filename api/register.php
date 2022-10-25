<?php
include('../utils/json.php');
include('../sql/database.php');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-type: application/json");

$params = json_decode(file_get_contents('php://input'), TRUE);

// check if user exists query
$role = $params["role"];
$firstName = $params["firstName"];
$lastName = $params["lastName"];
$address = $params["address"];
$email = $params["email"];
$phoneNumber = $params["phoneNumber"];
$dateOfBirth = $params["dateOfBirth"];

$insertUser = "INSERT INTO Person (firstName, lastName, address, email, phoneNumber, dateOfBirth)
			   VALUES ('$firstName', '$lastName','$address','$email', '$phoneNumber', '$dateOfBirth')";

if (userExists($database, $email)) {
    echo (json(null, 'user-exists'));
    exit;
}

// insert user to PERSON table
if (!($insertUserResult = mysqli_query($database, $insertUser))) {
    echo (json($database->error, 'server-error'));
    exit;
}

$personId = $database->insert_id;

$insertUserInPerson = "";
if ($role === 'administrator') {
    $insertUserInPerson = "INSERT INTO Administrator (personID)
                       VALUES ($personId)";
} else {
    $insertUserInPerson = "INSERT INTO Student (personID)
                       VALUES ($personId)";
}

// calling the query
if (!($insertUserResult = mysqli_query($database, $insertUserInPerson))) {
    echo (json($database->error, 'server-error'));
    exit;
}

echo json($database->insert_id, null);

mysqli_close($database);

function userExists($database, $email)
{
    $checkUser = "SELECT * FROM Person WHERE email = '$email'";
    $res = mysqli_query($database, $checkUser);
    return $res->num_rows > 0;
}
