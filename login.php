<?php
if (is_ajax()) {
  if (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists
    login_success();
  }
}
//Function to check if the request is an AJAX request
function is_ajax() {
  return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

function login_success(){
  $return = $_POST;

  //Do what you need to do with the info. The following are some examples.
  //if ($return["favorite_beverage"] == ""){
  //  $return["favorite_beverage"] = "Coke";
  //}
  //$return["favorite_restaurant"] = "McDonald's";
  $return["success"] = true;

  $return["json"] = json_encode($return);
  echo json_encode($return);
}
?>
