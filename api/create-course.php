<?php
include('../utils/json.php');
include('../sql/database.php');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-type: application/json");

// values for day and semester
// day: "mon", "tue", "wed", "thu", "fri", "sat", "sun"
// days: day-day-day...ie "mon-thu"
// semester: "summer", "winter", "fall"
// maybe...

// maybe we dont need
// courseTime can be "hh:mm:ss" or "hh:mm"
// start and end date should be "yyyy-mm-dd"
$params = json_decode(file_get_contents('php://input'), TRUE);
$id = $params["id"];
$courseCode = $params["courseCode"];
$title = $params["title"];
$semester = $params["semester"];
$days = $params["days"];
$courseTime = $params["courseTime"];
$instructor = $params["instructor"];
$room = $params["room"];
$startDate = $params["startDate"];
$endDate = $params["endDate"];

$insertCourse = "INSERT INTO Course (courseCode, title, semester, days, time, instructor, room, startDate, endDate)
			     VALUES ('$courseCode', '$title','$semester','$days', '$courseTime', '$instructor', '$room', '$startDate', '$endDate')";

if (!isAdmin($database, $id)) {
  echo json(null, 'unauthorized');
  exit;
}


if (courseExists($database, $courseCode)) {
  echo json(null, 'course-exists');
  exit;
}


if (!($insertUserResult = mysqli_query($database, $insertCourse))) {
  echo json($database->error, 'server-error');
  exit;
}

echo json($courseCode, null);

mysqli_close($database);

function courseExists($database, $courseCode)
{
  $checkCourse = "SELECT * FROM Course WHERE courseCode = '$courseCode'";
  $res = mysqli_query($database, $checkCourse);
  return $res->num_rows > 0;
}

function isAdmin($database, $id)
{
  $findAdmin = "SELECT * FROM Administrator WHERE employmentID = $id";
  $res = mysqli_query($database, $findAdmin);
  return $res->num_rows > 0;
}
