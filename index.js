import Entity from "./modules/entity.js";
import Player from "./modules/player.js";
import Projectile from "./modules/projectile.js";
import Enemy from "./modules/enemy.js";
import Particle from "./modules/particle.js";

const canvas = document.querySelector("#game-container");
const ctx = canvas.getContext("2d", { alpha: false });

canvas.width = innerWidth;
canvas.height = innerHeight;

const player = new Player(canvas.width / 2, canvas.height / 2, 10, "blue");
player.draw();

const projectiles = [];

window.addEventListener("click", (event) => {
  const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
  const velocity = {
    x: Math.cos(angle) * 10,
    y: Math.sin(angle) * 10,
  };

  const projectile = new Projectile(player.x, player.y, 5, "white", velocity);
  projectiles.push(projectile);
  projectile.draw();
});

const enemies = [];

let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);

  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.draw();

  projectiles.forEach((projectile) => projectile.update());

  enemies.forEach((enemy, enemyIndex) => {
    projectiles.forEach((projectile, projectileIndex) => {
      const distance = Math.hypot(
        projectile.x - enemy.x,
        projectile.y - enemy.y
      );
      if (distance - projectile.radius - enemy.radius <= 0) {
        if (enemy.radius - 10 > 5) {
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1);
          }, 0);
        } else {
          /////////////////////
          let particles = [];
          let nbParticles = parseInt(Math.random() * (50 - 8) + 8);

          for (let i = 0; i <= nbParticles; i++) {
            const velocity = {
              x: Math.cos(Math.random() + (360 - 1) + 1),
              y: Math.sin(Math.random() + (360 - 1) + 1),
            };

            const particle = new Particle(
              projectile.x,
              projectile.y,
              parseInt(Math.random() * (3 - 1) + 1) * 3,
              enemy.color,
              velocity
            );
            particles.push(particle);
          }
          console.log(particles);
          particles.forEach((particle, index) => {
            if (particle.alpha <= 0) {
              particles.splice(index, 1);
            } else {
              particle.update();
            }
          });

          ////////////////////
          setTimeout(() => {
            enemies.splice(enemyIndex, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });

    // player touched
    const distPlayerEnemy = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (distPlayerEnemy - enemy.radius - player.radius <= 0) {
      cancelAnimationFrame(animationId);
    }

    enemy.update();
  });
}
animate();
function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;

    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const color = `rgb(${r}, ${g}, ${b})`;

    const randomValue = Math.random();
    let x, y;
    if (randomValue < 0.25) {
      x = 0 - radius;
      y = Math.random() * canvas.height;
    } else if (randomValue >= 0.25 && randomValue < 0.5) {
      x = canvas.width + radius;
      y = Math.random() * canvas.height;
    } else if (randomValue >= 0.5 && randomValue < 0.75) {
      x = Math.random() * canvas.width;
      y = 0 - radius;
    } else if (randomValue >= 0.75) {
      x = Math.random() * canvas.width;
      y = canvas.height + radius;
    }

    const angle = Math.atan2(player.y - y, player.x - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}
spawnEnemies();
enemies.forEach((enemy, enemyIndex) => {
  projectiles.forEach((projectile, projectileIndex) => {
    const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
    if (distance - projectile.radius - enemy.radius <= 0) {
      enemies.splice(enemyIndex, 1);
      projectiles.splice(projectileIndex, 1);
    }
  });
  enemy.update();
});

projectiles.forEach((projectile, index) => {
  if (
    projectile.x - projectile.radius < 0 ||
    projectile.x + projectile.radius > canvas.width ||
    projectile.y - projectile.radius < 0 ||
    projectile.y + projectile.radius > canvas.height
  ) {
    projectiles.splice(index, 1);
  }
  projectile.update();
});
