const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const healthElement = document.getElementById('health');
let score = 0;
let health = 100;
let fallSpeed = 3; // Initial threat falling speed
let spawnInterval = 2000; // Initial spawn interval in milliseconds

// Countermeasures and threats
const countermeasures = {
    "WAF": ["Sql-Inj", "CSS", "DDOS", "RFI"],
    "Antivirus": ["Malware", "Ransomware", "Trojans", "Worms"],
    "Bot Manager": ["Brute-F", "Scraping", "Zombies", "ATO"],
};


// Threat spawning
function createThreats() {
    setInterval(() => {
        const countermeasureKeys = Object.keys(countermeasures);
        const randomCountermeasure = countermeasureKeys[Math.floor(Math.random() * countermeasureKeys.length)];

        // Ensure that randomCountermeasure is a valid key and countermeasure has items
        if (!countermeasures[randomCountermeasure] || countermeasures[randomCountermeasure].length === 0) {
            return; // Skip this iteration if no valid threat list is found
        }

        const randomThreat = countermeasures[randomCountermeasure][
            Math.floor(Math.random() * countermeasures[randomCountermeasure].length)
        ];

        // Generate random color for threat
        const randomColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

        const threat = document.createElement('div');
        threat.classList.add('threat', randomCountermeasure.replace(" ", "-"));
        threat.style.left = `${Math.random() * (gameContainer.offsetWidth - 60)}px`;
        threat.style.top = '0px';
        threat.style.backgroundColor = randomColor; // Random color
        threat.textContent = randomThreat;

        // Center the font inside the circle
        threat.style.display = 'flex';
        threat.style.alignItems = 'center';
        threat.style.justifyContent = 'center';
        threat.style.fontSize = '0.8em'; // Fit text inside circle

        gameContainer.appendChild(threat);

        // Threat falling logic
        const fallInterval = setInterval(() => {
            const currentTop = parseInt(threat.style.top);
            if (currentTop >= gameContainer.offsetHeight - 60) {
                clearInterval(fallInterval);
                threat.remove();
                updateHealth(-10); // Reduce health if threat reaches the bottom
            } else {
                threat.style.top = `${currentTop + fallSpeed}px`;
            }
        }, 30);

        threat.fallInterval = fallInterval;
    }, spawnInterval);
}


// Increase game speed every 500 points
function increaseGameSpeed() {
    fallSpeed += 1; // Increase threat falling speed
    if (spawnInterval > 500) {
        spawnInterval -= 100; // Decrease spawn interval
    }
}

// Drag and drop bombs (Desktop and Mobile Compatible)
const bombs = document.querySelectorAll('.bomb');

// Load the bomb sound
const bombSound = new Audio('explosion.ogg');
bombs.forEach((bomb) => {
    const initialPosition = {
        left: bomb.style.left,
        top: bomb.style.top,
    };

    bomb.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', bomb.id);
    });

    bomb.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        bomb.style.position = 'absolute';
        bomb.style.zIndex = '1000';

        function moveAt(pageX, pageY) {
            bomb.style.left = `${pageX - bomb.offsetWidth / 2}px`;
            bomb.style.top = `${pageY - bomb.offsetHeight / 2}px`;
        }

        moveAt(touch.pageX, touch.pageY);

        function onTouchMove(event) {
            const touch = event.touches[0];
            moveAt(touch.pageX, touch.pageY);
            event.preventDefault();
        }

        document.addEventListener('touchmove', onTouchMove);

        bomb.addEventListener('touchend', (event) => {
            document.removeEventListener('touchmove', onTouchMove);
            handleBombDrop(bomb, event.changedTouches[0].clientX, event.changedTouches[0].clientY);
            resetBombPosition(bomb, initialPosition);
        });
    });

    // Drop bomb directly on the container (for desktop drag & drop)
    gameContainer.addEventListener('dragover', (e) => e.preventDefault());

    gameContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        const bombId = e.dataTransfer.getData('text/plain');
        const bomb = document.getElementById(bombId);
        handleBombDrop(bomb, e.clientX, e.clientY);
        resetBombPosition(bomb, initialPosition);
    });
});

function resetBombPosition(bomb, initialPosition) {
    bomb.style.position = '';
    bomb.style.left = initialPosition.left;
    bomb.style.top = initialPosition.top;
}

function updateScore(points) {
    score += points;
    scoreElement.textContent = `Score: ${score}`;
}

function updateHealth(amount) {
    health += amount;
    healthElement.textContent = `Health: ${health}`;
    if (health <= 0) {
        alert('Game Over! Your score: ' + score);
        window.location.href("login.html"); // Reload the game
    }
}

function handleBombDrop(bombElement, clientX, clientY) {
    const gameRect = gameContainer.getBoundingClientRect(); // Accurate positioning

    // Calculate explosion position relative to the game container
    const explosionX = clientX - gameRect.left - 60; // Center explosion on drop point
    const explosionY = clientY - gameRect.top - 60;

    // Play the bomb sound effect (ensure it works on mobile)
    bombSound.currentTime = 0; // Reset sound to allow multiple plays
    bombSound.play().catch((err) => console.log("Error playing sound:", err));
    // Create explosion effect at the bomb drop location
    const explosion = document.createElement('div');
    explosion.classList.add('explosion');
    explosion.style.left = `${clientX - gameContainer.offsetLeft - 60}px`; // Adjust explosion position
    explosion.style.top = `${clientY - gameContainer.offsetTop - 60}px`;
    gameContainer.appendChild(explosion);

    // Remove explosion after animation ends
    setTimeout(() => explosion.remove(), 700);

    // Check if any threats are within the explosion radius
    const threats = document.querySelectorAll('.threat');
    threats.forEach((threat) => {
        const threatRect = threat.getBoundingClientRect();
        const explosionRect = {
            left: explosionX + gameRect.left,
            right: explosionX + gameRect.left + 120,
            top: explosionY + gameRect.top,
            bottom: explosionY + gameRect.top + 120,
        };

        if (
            explosionRect.left < threatRect.right &&
            explosionRect.right > threatRect.left &&
            explosionRect.top < threatRect.bottom &&
            explosionRect.bottom > threatRect.top
        ) {
            if (
                (bombElement.id === 'antivirus-bomb' && threat.classList.contains('Antivirus')) ||
                (bombElement.id === 'waf-bomb' && threat.classList.contains('WAF')) ||
                (bombElement.id === 'botmanager-bomb' && threat.classList.contains('Bot-Manager'))
            ) {
                clearInterval(threat.fallInterval);
                threat.remove();

                updateScore(10); // Increment score for neutralizing the threat
            }
        }
    });
}


window.onload = () => {
    const username = localStorage.getItem("username");
    if (username) {
        // Display the username above the score
        document.getElementById("username-display").style.display = "block";
        document.getElementById("username-display-text").textContent = "Username: " + username;
    } else {
        // Redirect to the login page if username is not found
        window.location.href = "login.html";
    }
    createThreats()
};
