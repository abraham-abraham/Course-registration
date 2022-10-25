<?php
include('../utils/json.php');
include('../sql/database.php');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-type: application/json");

$params = json_decode(file_get_contents('php://input'), TRUE);
$employmentID = $params['employmentID'];
$courseCode = $params['courseCode'];
// params : {employmentID: string, courseCode: string}

if (!isAdmin($database, $employmentID)) {
  echo json(null, 'unauthorized');
  exit;
}

if (!courseCodeExists($database, $courseCode)) {
  echo (json(null, 'invalid-course-code'));
  exit;
}

$query = "SELECT firstName, lastName, address, 
          dateOfBirth, email, Student.studentID, phoneNumber
          FROM Registered 
          INNER JOIN Student 
          INNER JOIN Person 
          ON (Registered.studentID = Student.studentID AND Student.personID = Person.personID)
          WHERE Registered.courseCode = '$courseCode'";

if (!($result = mysqli_query($database, $query))) {
  echo (json($database->error, 'server-error'));
  exit;
}


$array = [];
while ($row = $result->fetch_assoc()) {
  $array[] = $row;
}

echo json($array, null);

function isAdmin($database, $id)
{
  $findAdmin = "SELECT * FROM Administrator WHERE employmentID = $id";
  $res = mysqli_query($database, $findAdmin);
  return $res->num_rows > 0;
}

function courseCodeExists($database, $courseCode)
{
  $checkCourse = "SELECT * FROM Course WHERE courseCode = '$courseCode'";
  $res = mysqli_query($database, $checkCourse);
  return $res->num_rows > 0;
}
