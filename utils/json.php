<?php
function json($data = null, $error = null)
{
  $array = array('data' => $data, 'error' => $error); //creates a dictionary of key-value pair
  return json_encode($array); //returns JSON representation of a value
}
