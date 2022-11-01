<?php
if (!($database =
  mysqli_connect("containers-us-west-98.railway.app", "root", "vGvnEa3PoKIxzrIjNH6S", "railway", 7363))) {
  echo json('error connecting to sql db', 'server-error');
  exit;
}
