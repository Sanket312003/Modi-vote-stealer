// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// IMAGES
const playerTexture = textureLoader.load("images.jpg");
const coinTexture = textureLoader.load("coin.jpg");
const obstacleTexture = textureLoader.load("rahul.jpg");

// 🔊 SOUND EFFECTS
const coinSound = new Audio("wah.mp3");
const crashSound = new Audio("modibkl.mp3");

// PLAYER
const playerGeometry = new THREE.PlaneGeometry(2, 3);
const playerMaterial = new THREE.MeshBasicMaterial({
  map: playerTexture,
  transparent: true
});
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);
player.position.set(0, 1.5, 0);

// TRACK
const trackGeometry = new THREE.PlaneGeometry(10, 200);
const trackMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
const track = new THREE.Mesh(trackGeometry, trackMaterial);
track.rotation.x = -Math.PI / 2;
track.position.z = -50;
scene.add(track);

// LANE SYSTEM
let lane = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") lane = Math.max(lane - 1, -1);
  if (e.key === "ArrowRight") lane = Math.min(lane + 1, 1);
});

// SCORE
let score = 0;

// COINS
let coins = [];

function spawnCoin() {
  const coinGeometry = new THREE.PlaneGeometry(1.5, 1.5);
  const coinMaterial = new THREE.MeshBasicMaterial({
    map: coinTexture,
    transparent: true
  });

  const coin = new THREE.Mesh(coinGeometry, coinMaterial);

  coin.position.set(
    (Math.floor(Math.random() * 3) - 1) * 2,
    2,
    player.position.z - 30
  );

  scene.add(coin);
  coins.push(coin);
}

setInterval(spawnCoin, 1000);

// OBSTACLES (IMAGE BASED)
let obstacles = [];

function spawnObstacle() {
  const obsGeometry = new THREE.PlaneGeometry(2, 3);

  const obsMaterial = new THREE.MeshBasicMaterial({
    map: obstacleTexture,
    transparent: true
  });

  const obs = new THREE.Mesh(obsGeometry, obsMaterial);

  obs.position.set(
    (Math.floor(Math.random() * 3) - 1) * 2,
    1.5,
    player.position.z - 30
  );

  scene.add(obs);
  obstacles.push(obs);
}

setInterval(spawnObstacle, 2000);

// GAME LOOP
function animate() {
  requestAnimationFrame(animate);

  // MOVE FORWARD
  player.position.z -= 0.2;

  // LANE MOVE
  player.position.x = lane * 2;

  // CAMERA FOLLOW
  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 6;
  camera.position.y = player.position.y + 4;
  camera.lookAt(player.position);

  // PLAYER FACES CAMERA
  player.lookAt(camera.position);

  // SCORE UPDATE
  score += 0.1;
  document.getElementById("score").innerText =
    "Score: " + Math.floor(score);

  // COIN LOGIC
  coins.forEach((coin, index) => {
    coin.lookAt(camera.position);
    coin.rotation.y += 0.1;

    if (player.position.distanceTo(coin.position) < 1.5) {
      scene.remove(coin);
      coins.splice(index, 1);

      coinSound.currentTime = 0;
      coinSound.play();
    }
  });

  // OBSTACLE LOGIC
  obstacles.forEach((obs) => {
    obs.lookAt(camera.position);

    if (player.position.distanceTo(obs.position) < 1.5) {
      crashSound.currentTime = 0;
      crashSound.play();

      setTimeout(() => {
        alert("Game Over 💀");
        location.reload();
      }, 200);
    }
  });

  renderer.render(scene, camera);
}

animate();