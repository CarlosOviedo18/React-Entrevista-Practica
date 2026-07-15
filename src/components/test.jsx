function randomEntre(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log(randomEntre(1, 100));