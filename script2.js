document.addEventListener("DOMContentLoaded", function () {
  // Get the canvas and its context
  const canvas = this.getElementById("game-canvas");
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
  let score = 0;

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
  function handleRotation() {
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
  }

  function handleAcceleration() {
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
  }

  function handleMissiles() {
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
  }

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
        score -= 5;
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
        if (distance < missileSprite.width / 3 + asteroidSprite.width / 3) {
          // Trigger an explosion at the collision point
          startExplosion(asteroid.x, asteroid.y);
          asteroidCount--;
          score += 10;

          // Remove the missile and asteroid from their respective arrays
          missiles.splice(i, 1);
          asteroids.splice(j, 1);

          // Exit the inner loop to avoid checking other asteroids for this missile
          break;
        }
      }
    }
  }

  function showScore() {
    document.getElementById(
      "score-tracker"
    ).innerHTML = `<span>Score = ${score}</span>`;
  }

  function startTimer(timer, display) {
    let intervalId = setInterval(function () {
      let minutes = parseInt(timer / 60, 10);
      let seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = `${minutes}:${seconds}`;

      if (--timer < 0) {
        clearInterval(intervalId); // Clear the interval when the timer reaches 0
      }
    }, 1000);
  }

  function setTimer(duration) {
    return duration; // Simply return the initial duration
  }

  // Call this function to start the timer when your loop or event begins
  function startTimerWhenLoopStarts() {
    var fiveMinutes = 60 * 5 - 1;
    var display = document.querySelector("#timer");
    var initialTimerValue = setTimer(fiveMinutes);
    startTimer(initialTimerValue, display);
  }

  //PRACTICE

  //Define practice stages
  const stages = [
    {
      name: "Welcome to the Experiment!",
      instructions: "Press 'N' to continue",
    },
    {
      name: "Rotate Right",
      instructions: "Use the right arrow key to rotate the spaceship right",
    },
    {
      name: "Rotate Left",
      instructions: "Use the left arrow key to rotate the spaceship left",
    },
    {
      name: "Acceleration",
      instructions:
        "Use the up arrow key to accelerate. Be careful, there are no brakes!",
    },
    {
      name: "Shooting",
      instructions: "Press spacebar to shoot asteroids",
    },
    {
      name: "Free Practice",
      instructions: "You can practice freely!",
    },
    {
      name: "",
      instructions: "",
    },
  ];

  const keyImages = [
    "_img/keyboard/keyboard_right.png",
    "_img/keyboard/keyboard_left.png",
    "_img/keyboard/keyboard_up.png",
    "_img/keyboard/keyboard_space.png",
  ];

  // Initialize stage manager
  let currentStageIndex = 0; // Start with the first stage
  let wantPracticeChange = false;

  // Function to handle advancing to the next stage
  function advanceToNextStage() {
    pStage++;
    const currentStage = stages[pStage];
    if (pStage < stages.length) {
      // Display instructions for the next stage
      document.getElementById("instructions").innerHTML = `
        <h1>${currentStage.name}</h1>
        <p>${currentStage.instructions}</p>
      `;
      // Update the displayed key image for the next stage
      updateKeyImage(pStage);
    } else {
      currentStage.name.display = "none";
      currentStage.instructions.display = "none";
    }
  }

  function updateKeyImage(stageIndex) {
    const keyImageElement = document.getElementById("keyImage");
    if (
      stageIndex == 1 ||
      stageIndex == 2 ||
      stageIndex == 3 ||
      stageIndex == 4
    ) {
      // Update the image source based on the current practice stage
      keyImageElement.src = keyImages[stageIndex - 1];
      // You can also adjust the position or visibility of the image here
      keyImageElement.style.height = "120px";
      keyImageElement.style.width = "400px";
      keyImageElement.style.visibility = "visible";
    } else {
      // Hide the image if there are no more practice stages
      keyImageElement.style.visibility = "hidden";
      keyImageElement.style.height = "0px";
      keyImageElement.style.width = "0px";
    }
  }

  // Event listener for the "N" key to advance to the next stage
  function nEventListener() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "n" || event.key === "N") {
        advanceToNextStage();
        wantPracticeChange = true;
      }
    });
  }

  // Initial instructions for the first stage
  function firstStageInstructions() {
    document.getElementById("instructions").innerHTML = `
    <h1>Practice Stage: ${stages[currentStageIndex].name}</h1>
    <p>${stages[currentStageIndex].instructions}</p>
  `;
  }

  function clearEventListeners() {
    document.removeEventListener("keydown", handleRotation);
    document.removeEventListener("keydown", handleAcceleration);
    document.removeEventListener("keydown", handleMissiles);
  }

  let pStage = 0;

  function stage0() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    firstStageInstructions();
    drawSpaceship();
    updateSpaceship();
    if (pStage != 0) {
      onStage0Finish();
      return;
    }
    requestAnimationFrame(stage0);
  }

  function stage1() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpaceship();
    updateSpaceship();
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        rotatingRight = true;
      }
    });
    document.addEventListener("keyup", (event) => {
      if (event.key === "ArrowRight") {
        rotatingRight = false;
      }
    });
    if (pStage != 1) {
      onStage1Finish();
      return;
    }
    requestAnimationFrame(stage1);
  }

  function stage2() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.removeEventListener("keydown", handleRotation);
    drawSpaceship();
    updateSpaceship();
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        rotatingLeft = true;
      }
    });
    document.addEventListener("keyup", (event) => {
      if (event.key === "ArrowLeft") {
        rotatingLeft = false;
      }
    });
    if (pStage != 2) {
      onStage2Finish();
      return;
    }
    requestAnimationFrame(stage2);
  }

  function stage3() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpaceship();
    handleAcceleration();
    updateSpaceship();
    if (pStage != 3) {
      onStage3Finish();
      return;
    }
    requestAnimationFrame(stage3);
  }

  function stage4() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpaceship();
    drawMissiles();
    updateSpaceship();
    updateMissiles();
    handleMissiles();
    if (pStage != 4) {
      onStage4Finish();
      return;
    }
    requestAnimationFrame(stage4);
  }

  function stage5() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpaceship();
    drawAsteroids();
    drawMissiles();
    handleRotation();
    handleAcceleration();
    handleMissiles();
    updateSpaceship();
    updateMissiles();
    if (explosion.isActive) {
      updateExplosion();
      drawExplosion();
    }
    checkMissileHit();
    checkCollisions();
    if (pStage != 5) {
      onStage5Finish();
      return;
    }
    requestAnimationFrame(stage5);
  }

  // Game loop to continuously update and draw the spaceship
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawSpaceship(); // Draw the spaceship
    drawAsteroids();
    drawMissiles();
    showScore();
    handleRotation();
    handleAcceleration();
    handleMissiles();
    updateSpaceship();
    updateMissiles();
    if (explosion.isActive) {
      updateExplosion();
      drawExplosion();
    }
    checkMissileHit();
    checkCollisions();
    if (currentGameLoop != gameLoop) {
      return;
    }
    startTime = performance.now();
    requestAnimationFrame(gameLoop);
  }

  function gameLoop2() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawSpaceship(); // Draw the spaceship
    drawAsteroids();
    drawMissiles();
    showScore();
    handleRotation();
    handleAcceleration();
    handleMissiles();
    updateSpaceship();
    updateMissiles();
    if (explosion.isActive) {
      updateExplosion();
      drawExplosion();
    }
    checkMissileHit();
    checkCollisions();
    if (currentGameLoop != gameLoop2) {
      return;
    }
    requestAnimationFrame(gameLoop2);
  }

  let currentGameLoop;

  function switchGameLoop() {
    // Switch to the other game loop
    if (currentGameLoop === gameLoop) {
      currentGameLoop = gameLoop2;
      otherLoop = gameLoop;
    } else {
      currentGameLoop = gameLoop;
      otherLoop = gameLoop2;
    }
  }

  let otherLoop;

  function startRandomloop() {
    startAsteroidSpawner(1000); // Adjust the interval as needed
    const randomVal = Math.random();
    if (randomVal < 0.5) {
      startTimerWhenLoopStarts();
      currentGameLoop = gameLoop;
      otherLoop = gameLoop2;
    } else {
      startTimerWhenLoopStarts();
      currentGameLoop = gameLoop2;
      otherLoop = gameLoop;
    }
    requestAnimationFrame(currentGameLoop);
  }

  function clearEventListeners() {
    document.removeEventListener("keydown", handleRotation);
    document.removeEventListener("keydown", handleAcceleration);
    document.removeEventListener("keydown", handleMissiles);
  }

  let wantContinue = false;

  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      wantContinue = true;
    }
  });

  function startSequentially(data) {
    if (pStage != 6) {
      return;
    }
    score = 0;
    startRandomloop();
    setTimeout(() => {
      clearEventListeners();
      switchGameLoop();
      startAsteroidSpawner(1000); // Adjust the interval as needed
      requestAnimationFrame(currentGameLoop);
    }, 5000);
  }

  // splashScreen.style.display = "none";

  function onStage0Finish() {
    clearEventListeners();
    stage1();
  }

  function onStage1Finish() {
    clearEventListeners();
    stage2();
  }

  function onStage2Finish() {
    clearEventListeners();
    stage3();
  }

  function onStage3Finish() {
    clearEventListeners();
    stage4();
  }

  function onStage4Finish() {
    clearEventListeners();
    stage5();
  }

  function onStage5Finish() {
    clearEventListeners();
    startSequentially();
  }

  // Initialize an array to store spacebar press events
  const spacebarPressEvents = [];

  // Event listener for capturing spacebar press events
  document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
      const timestamp = performance.now(); // Get the current timestamp
      spacebarPressEvents.push({ timestamp }); // Store the event with timestamp
      // Send this spacebar press event to the server
      sendSpacebarPressToServer({ timestamp });
    }
  });

  // Function to send spacebar press event to the server
  function sendSpacebarPressToServer(event) {
    fetch("http://localhost:3000/submit-spacebar-press", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("Spacebar press event saved successfully");
        } else {
          console.error("Failed to save spacebar press event");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  stage0();
  nEventListener();
});
