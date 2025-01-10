const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const healthElement = document.getElementById('health');
let score = 0;
let health = 100;

// Threat spawning
function createThreats() {
    setInterval(() => {
        const threatType = ['malware', 'phishing', 'ddos'][Math.floor(Math.random() * 3)];
        const threat = document.createElement('div');
        threat.classList.add('threat', threatType);
        threat.style.left = `${Math.random() * (gameContainer.offsetWidth - 60)}px`; // Random position
        threat.style.top = '0px';
        threat.textContent = threatType.charAt(0).toUpperCase() + threatType.slice(1);
        gameContainer.appendChild(threat);

        // Move the threat downward
        const fallInterval = setInterval(() => {
            const currentTop = parseInt(threat.style.top);
            if (currentTop >= gameContainer.offsetHeight - 60) {
                clearInterval(fallInterval);
                threat.remove(); // Remove threat if it reaches the bottom
                updateHealth(-10); // Reduce health if threat is missed
            } else {
                threat.style.top = `${currentTop + 3}px`; // Slower falling speed
            }
        }, 30);

        threat.fallInterval = fallInterval;
    }, 1500); // Threat spawns every 1 second
}

// Update health
function updateHealth(amount) {
    health += amount;
    healthElement.textContent = `Health: ${health}`;
    if (health <= 0) {
        alert('Game Over! Your score: ' + score);
        window.location.reload(); // Reload the game
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

    // Desktop: Handle dragstart
    bomb.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', bomb.id);
    });

    // Mobile: Handle touchstart
    bomb.addEventListener('touchstart', (e) => {
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
        }

        document.addEventListener('touchmove', onTouchMove);

        bomb.addEventListener('touchend', (event) => {
            document.removeEventListener('touchmove', onTouchMove);
            handleBombDrop(
                bomb,
                event.changedTouches[0].clientX,
                event.changedTouches[0].clientY
            );
            resetBombPosition(bomb, initialPosition);
        });
    });

    // Handle bomb drop (Desktop)
    gameContainer.addEventListener('dragover', (e) => e.preventDefault());

    gameContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        const bombId = e.dataTransfer.getData('text/plain');
        const bomb = document.getElementById(bombId);
        handleBombDrop(bomb, e.clientX, e.clientY);
        resetBombPosition(bomb, initialPosition);
    });
});

// Reset bomb position after drop
function resetBombPosition(bomb, initialPosition) {
    bomb.style.position = '';
    bomb.style.left = initialPosition.left;
    bomb.style.top = initialPosition.top;
}

// Handle bomb drop logic
function handleBombDrop(bomb, clientX, clientY) {
    const gameRect = gameContainer.getBoundingClientRect(); // Accurate positioning

    // Calculate explosion position relative to the game container
    const explosionX = clientX - gameRect.left - 60; // Center explosion on drop point
    const explosionY = clientY - gameRect.top - 60;

    // Play the bomb sound effect
    bombSound.currentTime = 0; // Reset the sound to allow multiple plays
    bombSound.play();

    // Create explosion effect
    const explosion = document.createElement('div');
    explosion.classList.add('explosion');
    explosion.style.left = `${explosionX}px`;
    explosion.style.top = `${explosionY}px`;
    gameContainer.appendChild(explosion);

    setTimeout(() => explosion.remove(), 700);

    // Check for threats in the explosion range
    const threats = Array.from(document.getElementsByClassName('threat'));
    threats.forEach((threat) => {
        const threatRect = threat.getBoundingClientRect();

        // Ensure explosionRect matches the gameContainer's coordinate space
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
                (bomb.id === 'antivirus-bomb' && threat.classList.contains('malware')) ||
                (bomb.id === 'phishing-bomb' && threat.classList.contains('phishing')) ||
                (bomb.id === 'firewall-bomb' && threat.classList.contains('ddos'))
            ) {
                score += 10;
                scoreElement.textContent = `Score: ${score}`;

                clearInterval(threat.fallInterval);
                threat.remove();
            }
        }
    });
}

// Start the game
window.onload = () => {
    createThreats();
};
