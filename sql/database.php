<?php
if (!($database = mysqli_connect("localhost", "root", ""))) {
  echo json('error connecting to sql db', 'server-error');
  exit;
}

if (!mysqli_select_db($database, "Assignment1")) {
  echo json($database->error, 'server-error');
  exit;
}
