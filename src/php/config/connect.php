<?php

$server_name = 'localhost';
$user_name = 'root';
$password = '';
$db_name = 'crud';

$connect = mysqli_connect($server_name, $user_name, $password, $db_name);

if (!$connect) {
  die("Error connect dataBase");
}