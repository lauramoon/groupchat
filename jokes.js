const joke = getJoke();

function getJoke() {
  const jokes = [
    "This is a joke, right?",
    "You've got to be kidding me!",
    "That chicken has sailed.",
    "If you walk into a bar, it hurts.",
    "Joke's on you!",
    "All jokes (not) aside.",
    "Schrodinger's joke",
  ];

  return jokes[Math.floor(Math.random() * jokes.length)];
}

module.exports = getJoke;
