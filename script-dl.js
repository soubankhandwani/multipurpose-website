// Function to handle downloading a YouTube video
async function downloadVideo() {
    // Get the YouTube video URL from the input field
    const videoUrl = document.getElementById("videoUrl").value;

    // Check if the URL is empty or contains only spaces
    if (videoUrl.trim() === "") {
        // Show an alert if the URL is not valid
        alert("Please enter a valid YouTube video URL");
        return; // Stop the function execution
    }

    // Send the YouTube video URL to the server for downloading
    const response = await fetch("/download", {
        method: "POST", // Use the POST method to send data
        headers: {
            "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify({ videoUrl }), // Convert the data to JSON format
    });

    // Check if the response from the server is successful
    if (response.ok) {
        // Parse the response body as JSON
        const result = await response.json();
        // Display the download link on the page
        document.getElementById("downloadLink").innerHTML = `<a href="${result.downloadLink}" target="_blank">Download Link</a>`;
    } else {
        // Show an alert if there's an error downloading the video
        alert("Error downloading video. Please try again.");
    }
}
