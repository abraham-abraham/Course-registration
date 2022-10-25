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

if (isAlreadyRegistered($database, $courseCode, $studentID)) {
    echo (json(null, 'already-registered'));
    exit;
}

$registeredCount = registeredCount($database, $studentID);

if ($registeredCount >= 5) {
    echo (json(null, 'register-limit-reached'));
    exit;
}

if (!validateRegistrationDate($database, $courseCode)) {
    echo (json(null, 'register-deadline-passed'));
    exit;
}

// build SELECT query
$query = "INSERT INTO Registered (studentID, courseCode) 
          VALUES('$studentID','$courseCode')";

if (!($result = mysqli_query($database, $query))) {
    echo (json($database->error, 'server-error'));
    exit;
}

$response = array('courseCode' => $courseCode, 'studentID' => $studentID, 'nRegistered' => ($registeredCount + 1));

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

function registeredCount($database, $studentID)
{
    $getRegiseredCourse = "SELECT * FROM Registered WHERE studentID = $studentID";
    $res = mysqli_query($database, $getRegiseredCourse);
    return $res->num_rows;
}

function canRegister($startDate)
{
    $now = strtotime(date("Y-m-d H:i:s")); // converting to seconds
    $start = strtotime($startDate);
    $oneWeek = 60 * 60 * 24 * 8;
    $deadline = $start + $oneWeek;
    return $now <= $deadline;
}

function validateRegistrationDate($database, $courseCode)
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
    return canRegister($course['startDate']);
}

function isAlreadyRegistered($database, $courseCode, $studentID)
{
    $checkStudent = "SELECT * FROM Registered WHERE studentID = $studentID AND courseCode = '$courseCode'";
    $res = mysqli_query($database, $checkStudent);
    return $res->num_rows > 0;
}
