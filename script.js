let studentName = '';
let studentId = '';

// Login form handling
document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    studentName = document.getElementById("student-name").value;
    studentId = document.getElementById("student-id").value;

    document.getElementById("login-container").style.display = "none";
    document.getElementById("exam-container").style.display = "block";

    startCameraRecording();
    startScreenRecording();
});

// Camera recording
let cameraRecorder, cameraChunks = [];

function startCameraRecording() {
    const video = document.getElementById("camera-feed");

    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
            cameraRecorder = new MediaRecorder(stream);

            cameraRecorder.ondataavailable = (e) => cameraChunks.push(e.data);
            cameraRecorder.onstop = () => saveRecording(cameraChunks, `${studentName}_${studentId}_webcam.webm`);

            cameraRecorder.start();
        })
        .catch((error) => {
            alert("Camera access is required for this exam. Reload the page and allow access.");
        });
}

// Screen recording
let screenRecorder, screenChunks = [];

function startScreenRecording() {
    navigator.mediaDevices.getDisplayMedia({ video: true })
        .then((stream) => {
            screenRecorder = new MediaRecorder(stream);

            screenRecorder.ondataavailable = (e) => screenChunks.push(e.data);
            screenRecorder.onstop = () => saveRecording(screenChunks, `${studentName}_${studentId}_screen.webm`);

            screenRecorder.start();
        })
        .catch((error) => {
            alert("Screen recording is required for this exam. Reload the page and allow access.");
        });
}

// Save recordings
function saveRecording(chunks, filename) {
    const blob = new Blob(chunks, { type: "video/webm" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Submit button handling
document.getElementById("submit").addEventListener("click", () => {
    alert("Exam submitted successfully!");

    // Stop recordings
    if (cameraRecorder && cameraRecorder.state === "recording") {
        cameraRecorder.stop();
    }
    if (screenRecorder && screenRecorder.state === "recording") {
        screenRecorder.stop();
    }
});
