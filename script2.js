document.addEventListener("DOMContentLoaded", function () {
  // Get the canvas and its context
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  //SPACESHIP CODE
  const spaceshipSprite = new Image();

  function drawSpaceship() {
    ctx.save(); // Save the current canvas state
    ctx.translate(spaceship.x, spaceship.y); // Move the origin to the spaceship's position
    ctx.rotate(spaceship.angle); // Rotate the spaceship
    ctx.drawImage(
      spaceshipSprite,
      -spaceship.width / 2,
      -spaceship.height / 2,
      spaceship.width,
      spaceship.height
    ); // Draw the spaceship sprite
    ctx.restore(); // Restore the canvas state
  }

  spaceshipSprite.src =
    "_img/commondatastorage.googleapis.com/codeskulptor_assets/lathrop/ship1.png";

  // Define spaceship properties
  const spaceship = {
    x: canvas.width / 2, // Initial x-coordinate (centered)
    y: canvas.height / 2, // Initial y-coordinate (centered)
    width: 37, // Width of the spaceship
    height: 36, // Height of the spaceship
    angle: 0, // Initial angle (in radians) - facing upward
    speed: 0, // Adjust the speed as needed
    acceleration: 0.05, // Acceleration rate (pixels per frame squared)
    deceleration: 0.02, // Deceleration rate (pixels per frame squared)
    maxSpeed: 2, // Maximum speed (pixels per frame)
  };

  let accelerating = false; // Track if the up arrow key is currently pressed
  let rotatingLeft = false; // left
  let rotatingRight = false; // right

  // Function to update spaceship position and rotation
  function updateSpaceship() {
    // Update speed (accelerate when up arrow key is pressed)
    if (accelerating) {
      spaceshipSprite.src =
        "_img/commondatastorage.googleapis.com/codeskulptor_assets/lathrop/ship2.png";
      // Accelerate forward when the up arrow key is pressed
      if (spaceship.speed < spaceship.maxSpeed) {
        spaceship.speed += spaceship.acceleration;
      }
    } else {
      spaceshipSprite.src =
        "_img/commondatastorage.googleapis.com/codeskulptor_assets/lathrop/ship1.png";
      // Decelerate when the up arrow key is released
      if (spaceship.speed > 0) {
        spaceship.speed -= spaceship.deceleration;
      }
    }
    spaceship.x += Math.cos(spaceship.angle) * spaceship.speed;
    spaceship.y += Math.sin(spaceship.angle) * spaceship.speed;

    // Wrap the spaceship around the canvas
    if (spaceship.x > canvas.width) spaceship.x = 0;
    if (spaceship.x < 0) spaceship.x = canvas.width;
    if (spaceship.y > canvas.height) spaceship.y = 0;
    if (spaceship.y < 0) spaceship.y = canvas.height;

    // Rotate the spaceship
    if (rotatingLeft) {
      // Rotate left
      spaceship.angle -= 0.05; // Adjust the rotation speed as needed
    }
    if (rotatingRight) {
      // Rotate right
      spaceship.angle += 0.05; // Adjust the rotation speed as needed
    }
  }

  //ASTEROID CODE
  const asteroidSprite = new Image();

  // Function to draw asteroids on the canvas
  function drawAsteroids() {
    asteroids.forEach((asteroid) => {
      const asteroidWidth = asteroidSprite.width * 0.3; // Adjust the scaling factor as needed
      const asteroidHeight = asteroidSprite.height * 0.3; // Adjust the scaling factor as needed

      ctx.drawImage(
        asteroidSprite,
        asteroid.x,
        asteroid.y,
        asteroidWidth,
        asteroidHeight
      );
    });
  }

  asteroidSprite.src =
    "_img/commondatastorage.googleapis.com/codeskulptor_assets/lathrop/asteroid_blue.png";

  // Function to generate a random position for an asteroid
  function generateRandomAsteroidPosition() {
    const asteroid = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
    };

    // Check the distance from the spaceship
    const distance = Math.sqrt(
      (asteroid.x - spaceship.x) ** 2 + (asteroid.y - spaceship.y) ** 2
    );

    // Ensure the asteroid doesn't spawn within 10px of the spaceship
    if (distance < 10) {
      return generateRandomAsteroidPosition(); // Regenerate position
    }

    return asteroid;
  }

  // Array to store asteroid objects
  const asteroids = [];

  let asteroidCount = 0;
  const maxAsteroids = 13;

  // Function to create a new asteroid and add it to the array
  function createAsteroid() {
    if (asteroidCount < maxAsteroids) {
      const asteroid = generateRandomAsteroidPosition();
      asteroids.push(asteroid);
      asteroidCount++;
    }
  }

  // Function to start spawning asteroids at a specific interval
  function startAsteroidSpawner(interval) {
    setInterval(() => {
      createAsteroid();
    }, interval);
  }

  // Call this function to start spawning asteroids every 2000 milliseconds (2 seconds)
  startAsteroidSpawner(1000); // Adjust the interval as needed

  //EXPLOSION CODE
  const explosionSpriteSheet = new Image();

  explosionSpriteSheet.src =
    "_img/commondatastorage.googleapis.com/codeskulptor_assets/lathrop/explosion_alpha.png";

  const explosion = {
    x: 0,
    y: 0,
    frameWidth: 128, // Width of each frame in the sprite sheet
    frameHeight: 128, // Height of each frame in the sprite sheet
    frameIndex: 0, // Current frame index
    numFrames: 24, // Total number of frames in the sprite sheet
    frameRate: 30, // Frames per second for the explosion animation
    timer: 0, // Timer to control frame switching
    isActive: false, // Flag to indicate if the explosion is active
  };

  function startExplosion(x, y) {
    explosion.x = x;
    explosion.y = y;
    explosion.frameIndex = 0;
    explosion.timer = 0;
    explosion.isActive = true;
  }

  // Function to update the explosion animation
  function updateExplosion() {
    if (explosion.isActive) {
      explosion.timer++;

      if (explosion.timer >= 60 / explosion.frameRate) {
        explosion.frameIndex++;

        if (explosion.frameIndex >= explosion.numFrames) {
          // Animation is complete
          explosion.isActive = false;
        }

        explosion.timer = 0;
      }
    }
  }

  function drawExplosion() {
    if (explosion.isActive) {
      ctx.drawImage(
        explosionSpriteSheet,
        explosion.frameIndex * explosion.frameWidth,
        0,
        explosion.frameWidth,
        explosion.frameHeight,
        explosion.x - explosion.frameWidth / 2,
        explosion.y - explosion.frameHeight / 2,
        explosion.frameWidth,
        explosion.frameHeight
      );
    }
  }

  //MISSILE CODE
  const missileSprite = new Image();

  let isFiringMissile = false; // Flag to track if a missile is already in flight

  // Event listener for firing missiles when the spacebar key is pressed
  let isSpacebarPressed = false; // Flag to track if the spacebar is currently pressed

  missileSprite.src =
    "_img/commondatastorage.googleapis.com/codeskulptor_assets/lathrop/shot2.png";

  // Array to store missile objects
  const missiles = [];

  // Define missile properties
  const missile = {
    width: 4, // Width of the missile
    height: 4, // Height of the missile
    speed: 3, // Speed of the missile (pixels per frame)
    maxDistance: 200, // Maximum distance the missile can travel
  };

  // Function to create a new missile fired from the spaceship
  function createMissile() {
    const missileObj = {
      x: spaceship.x, // Initial x-coordinate of the missile (same as spaceship)
      y: spaceship.y, // Initial y-coordinate of the missile (same as spaceship)
      angle: spaceship.angle, // Initial angle (same as spaceship)
      distance: 0, // Initial distance traveled by the missile
    };

    missiles.push(missileObj);
  }

  // Function to update missile positions and remove them when they reach the max distance
  function updateMissiles() {
    for (let i = missiles.length - 1; i >= 0; i--) {
      const missileObj = missiles[i];

      // Calculate the new position of the missile based on its angle and speed
      missileObj.x += Math.cos(missileObj.angle) * missile.speed;
      missileObj.y += Math.sin(missileObj.angle) * missile.speed;

      // Calculate the distance traveled by the missile
      missileObj.distance += missile.speed;

      // Remove the missile if it reaches the maximum distance
      if (missileObj.distance >= missile.maxDistance) {
        missiles.splice(i, 1);
      }
    }
  }

  // Function to draw missiles on the canvas
  function drawMissiles() {
    missiles.forEach((missileObj) => {
      ctx.drawImage(
        missileSprite,
        missileObj.x - missile.width / 2,
        missileObj.y - missile.height / 2,
        missile.width,
        missile.height
      );
    });
  }

  //GENERAL CODE
  // Arrow key event listeners for rotation
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      // Start rotating left when the left arrow key is pressed
      rotatingLeft = true;
    } else if (event.key === "ArrowRight") {
      // Start rotating right when the right arrow key is pressed
      rotatingRight = true;
    }
  });

  // Arrow key event listeners for stopping rotation
  document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") {
      // Stop rotating left when the left arrow key is released
      rotatingLeft = false;
    } else if (event.key === "ArrowRight") {
      // Stop rotating right when the right arrow key is released
      rotatingRight = false;
    }
  });

  // Event listener for the up arrow key (keydown to start accelerating)
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      // Start accelerating when the up arrow key is pressed
      accelerating = true;
    }
  });

  // Event listener for the up arrow key (keyup to stop accelerating)
  document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowUp") {
      // Stop accelerating when the up arrow key is released
      accelerating = false;
    }
  });

  // Event listener for firing missiles when the spacebar key is pressed

  document.addEventListener("keydown", (event) => {
    if (event.key === " " && !isFiringMissile) {
      createMissile(); // Create a new missile
      isFiringMissile = true; // Set the flag to prevent firing more missiles
    }
  });

  // Event listener to reset the missile firing flag when the spacebar key is released
  document.addEventListener("keyup", (event) => {
    if (event.key === " ") {
      isFiringMissile = false;
    }
  });

  // Function to check for collisions between the spaceship and asteroids
  function checkCollisions() {
    for (let i = asteroids.length - 1; i >= 0; i--) {
      const asteroid = asteroids[i];

      // Calculate the distance between the spaceship and the asteroid
      const distance = Math.sqrt(
        (asteroid.x - spaceship.x) ** 2 + (asteroid.y - spaceship.y) ** 2
      );

      // If the distance is less than a threshold (e.g., 50 pixels), it's a collision
      if (distance < 30) {
        startExplosion(asteroid.x, asteroid.y);
        // Remove the asteroid from the array
        asteroids.splice(i, 1);
        asteroidCount--;
      }
    }
  }

  function checkMissileHit() {
    for (let i = 0; i < missiles.length; i++) {
      const missile = missiles[i];

      for (let j = 0; j < asteroids.length; j++) {
        const asteroid = asteroids[j];

        // Calculate the distance between the missile and asteroid
        const distance = Math.sqrt(
          Math.pow(missile.x - asteroid.x, 2) +
            Math.pow(missile.y - asteroid.y, 2)
        );

        // Check if the missile and asteroid have collided
        if (distance < missileSprite.width / 2 + asteroidSprite.width / 2) {
          // Trigger an explosion at the collision point
          startExplosion(asteroid.x, asteroid.y);
          asteroidCount--;

          // Remove the missile and asteroid from their respective arrays
          missiles.splice(i, 1);
          asteroids.splice(j, 1);

          // Exit the inner loop to avoid checking other asteroids for this missile
          break;
        }
      }
    }
  }

  // Game loop to continuously update and draw the spaceship
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawSpaceship(); // Draw the spaceship
    drawAsteroids();
    drawMissiles();
    updateSpaceship();
    updateMissiles();
    if (explosion.isActive) {
      updateExplosion();
      drawExplosion();
    }
    checkMissileHit();
    checkCollisions();
    requestAnimationFrame(gameLoop);
  }

  // Start the game loop
  gameLoop();
});
