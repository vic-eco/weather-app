<?php
header("Content-Type: application/json");

$conn = mysqli_connect("", "", "", "");

if (!$conn) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . mysqli_connect_error()]);
    exit;
}

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid or missing JSON data"]);
    exit;
}

$region = $data['region'] ?? null;
$city = $data['city'] ?? null;
$address = $data['address'] ?? null;
$country = $data['country'] ?? null;
$username = "";
$timestamp = time();

if (!$region || !$city || !$address || !$country) {
    http_response_code(422);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

//We use a statement instead of querying the db directly to protect from SQL injections.
$query = "INSERT INTO requests (username, region, city, timestamp, address, country) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = mysqli_prepare($conn, $query);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . mysqli_error($conn)]);
    exit;
}

mysqli_stmt_bind_param($stmt, "sssiss", $username, $region, $city, $timestamp, $address, $country);

if (mysqli_stmt_execute($stmt)) {
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "Data stored successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to store data: " . mysqli_stmt_error($stmt)]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
