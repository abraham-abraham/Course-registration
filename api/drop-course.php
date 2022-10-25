<?php
include('../utils/json.php');
include('../sql/database.php');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-type: application/json");

$params = json_decode(file_get_contents('php://input'), TRUE);
$courseCode = $params['courseCode'];
$studentID = $params['studentID'];

if (!studentExists($database, $studentID)) {
  echo (json(null, 'invalid-student-id'));
  exit;
}

if (!courseExists($database, $courseCode)) {
  echo (json(null, 'invalid-course-code'));
  exit;
}

if (!isAlreadyRegistered($database, $courseCode, $studentID)) {
  echo (json(null, 'not-registered'));
  exit;
}

if (!validateDropDate($database, $courseCode)) {
  echo (json(null, 'drop-deadline-passed'));
  exit;
}

$registeredCount = registeredCount($database, $studentID);

$query = "DELETE FROM Registered 
          WHERE studentID = $studentID AND courseCode = '$courseCode'";

if (!($result = mysqli_query($database, $query))) {
  echo (json($database->error, 'server-error'));
  exit;
}

$response = array('courseCode' => $courseCode, 'studentID' => $studentID, 'nRegistered' => ($registeredCount - 1));

echo json($response, null);

mysqli_close($database);

function courseExists($database, $courseCode)
{
  $checkCourse = "SELECT * FROM Course WHERE courseCode = '$courseCode'";
  $res = mysqli_query($database, $checkCourse);
  return $res->num_rows > 0;
}

function studentExists($database, $studentID)
{
  $checkStudent = "SELECT * FROM Student WHERE studentID = $studentID";
  $res = mysqli_query($database, $checkStudent);
  return $res->num_rows > 0;
}

function canDrop($endDate)
{
  
  $now = strtotime(date("Y-m-d H:i:s")); // converting to seconds
  $end = strtotime($endDate);
  return $now <= ($end + (60 * 60 * 24));
}

function validateDropDate($database, $courseCode)
{
  $getCourse = "SELECT * FROM Course where courseCode = '$courseCode'";
  $res = mysqli_query($database, $getCourse);
  if ($res->num_rows !== 1) {
    echo (json('Impossible scenario has occurred!', 'server-error'));
    exit;
  }
  $rows = array();
  while ($r = mysqli_fetch_assoc($res)) {
    $rows[] = $r;
  }
  $course = $rows[0];
  return canDrop($course['endDate']);
}

function isAlreadyRegistered($database, $courseCode, $studentID)
{
  $checkStudent = "SELECT * FROM Registered WHERE studentID = $studentID AND courseCode = '$courseCode'";
  $res = mysqli_query($database, $checkStudent);
  return $res->num_rows > 0;
}

function registeredCount($database, $studentID)
{
  $getRegiseredCourse = "SELECT * FROM Registered WHERE studentID = $studentID";
  $res = mysqli_query($database, $getRegiseredCourse);
  return $res->num_rows;
}
