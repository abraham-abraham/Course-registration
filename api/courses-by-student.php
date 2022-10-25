<?php
include('../utils/json.php');
include('../sql/database.php');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-type: application/json");

$params = json_decode(file_get_contents('php://input'), TRUE);
$employmentID = $params['employmentID'];
$studentID = $params['studentID'];
// params : {employmentID: string, studentID: string}

if (!isAdmin($database, $employmentID)) {
  echo json(null, 'unauthorized');
  exit;
}

if (!studentExists($database, $studentID)) {
  echo (json(null, 'invalid-student-id'));
  exit;
}

$query = "SELECT Course.courseCode, days, endDate, 
          instructor, room, semester, startDate, time, title
          FROM Registered 
          INNER JOIN Course 
          ON Registered.courseCode = Course.courseCode
          WHERE Registered.studentID = $studentID";

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

function studentExists($database, $studentID)
{
  $checkStudent = "SELECT * FROM Student WHERE studentID = $studentID";
  $res = mysqli_query($database, $checkStudent);
  return $res->num_rows > 0;
}
