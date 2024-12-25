let captchaText = "";
let canvas = document.getElementById("captcha");
let context = canvas.getContext("2d");

canvas.width = 250;
canvas.height = 60;
let attemptCount = 0;
let canVerify = true; // To allow or disallow verification

function generateCaptcha() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    captchaText = "";
    for (let i = 0; i < 8; i++) {
        captchaText += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawCaptcha(captchaText); // Draw new CAPTCHA
    document.getElementById("wait-message").style.display = "none"; // Hide wait message
    attemptCount = 0; // Reset attempt count
    canVerify = true; // Enable verification
    document.getElementById("status").textContent = "";
}

function drawCaptcha(text) {
    const chars = text.split('');
    for (let i = 0; i < chars.length; i++) {
        const angle = (Math.random() - 0.5) * 60; // Random rotation angle
        const x = 30 * i + 20;
        const y = 35 + Math.random() * 10;

        context.save();
        context.translate(x, y);
        context.rotate(angle * Math.PI / 180);
        context.font = "28px 'Courier New', 'Segoe UI', sans-serif"; // More stylish font
        context.fillStyle = "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")";
        context.fillText(chars[i], 0, 0);
        context.restore();
    }

    addNoise(); // Add noise
}

function addNoise() {
    for (let i = 0; i < 7; i++) {
        context.beginPath();
        context.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        context.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        context.strokeStyle = "rgba(0, 0, 0, 0.1)";
        context.lineWidth = 1.5;
        context.stroke();
    }

    for (let i = 0; i < 30; i++) {
        context.beginPath();
        context.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
        context.fillStyle = "rgba(0, 0, 0, 0.1)";
        context.fill();
    }
}

function verifyCaptcha() {
    if (!canVerify) return; // Disable verification if waiting time is active
    const userInput = document.getElementById("captcha-input").value;

    if (userInput === captchaText) {
        document.getElementById("status").textContent = "CAPTCHA Verified!";
        document.getElementById("status").style.color = "#4CAF50"; // Green
        attemptCount = 0;
        canVerify = true; // Allow next verification
    } else {
        attemptCount++;
        if (attemptCount >= 8) { // Allow 8 attempts before showing "Try Again Later"
            document.getElementById("status").textContent = "Try Again Later!";
            document.getElementById("status").style.color = "#ff6347"; // Red
            document.getElementById("wait-message").style.display = "block"; // Show wait message
            canVerify = false; // Disable further verification attempts
            setTimeout(() => {
                generateCaptcha();
            }, 120000); // Wait 2 minutes before allowing the next attempt
        } else {
            document.getElementById("status").textContent = "Incorrect! Try Again.";
            document.getElementById("status").style.color = "#ff6347"; // Red
        }
    }
}

// Generate initial CAPTCHA
generateCaptcha();
