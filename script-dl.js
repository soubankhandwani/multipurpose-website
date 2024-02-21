async function downloadVideo() {
    const videoUrl = document.getElementById("videoUrl").value;

    if (videoUrl.trim() === "") {
        alert("Please enter a valid YouTube video URL");
        return;
    }

    // Send the YouTube video URL to the server for downloading
    const response = await fetch("/download", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl }),
    });

    if (response.ok) {
        const result = await response.json();
        document.getElementById("downloadLink").innerHTML = `<a href="${result.downloadLink}" target="_blank">Download Link</a>`;
    } else {
        alert("Error downloading video. Please try again.");
    }
}
