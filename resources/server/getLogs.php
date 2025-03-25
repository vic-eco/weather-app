<?php
$conn = mysqli_connect("", "", "");

if (!$conn) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . mysqli_connect_error()]);
    exit;
}

$response = array();

mysqli_select_db($conn , "") or die ("db will not open" . mysqli_error($conn));
$query = "SELECT * FROM requests WHERE username='' ORDER BY timestamp DESC LIMIT 5";

$result = mysqli_query($conn, $query) or die("Invalid query");

while($row = mysqli_fetch_row($result)) {
    $row_data = array(
        'timestamp' => $row[2],
        'address' => $row[3],
        'region' => $row[4],
        'city' => $row[5],
        'country' => $row[6]
    );
    $data[] = $row_data;
}

header('Content-Type: application/json');

echo json_encode($data);
