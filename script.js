document.addEventListener("DOMContentLoaded", () => {
  fetchMovies();
});

function fetchMovies() {
  fetch("http://localhost:3000/films")  // Fetch from the correct endpoint
      .then(res => res.json())
      .then(movies => {
          displayMovies(movies);
          if (movies.length > 0) {
              showMovieDetails(movies[0]);  // Automatically load the first movie
          }
      })
      .catch(err => console.error("Error fetching movies:", err));
}

function displayMovies(movies) {
  const movieList = document.getElementById("movie-list");
  movieList.innerHTML = ""; // Clear previous list
  movies.forEach(movie => {
      const li = document.createElement("li");
      li.textContent = movie.title;
      li.addEventListener("click", () => showMovieDetails(movie));
      movieList.appendChild(li);
  });
}

function showMovieDetails(movie) {
  document.getElementById("movie-poster").src = movie.poster;
  document.getElementById("movie-title").textContent = movie.title;
  document.getElementById("runtime").textContent = movie.runtime;
  document.getElementById("movie-description").textContent = movie.description;
  document.getElementById("showtime").textContent = movie.showtime;
  
  let ticketsLeft = movie.capacity - movie.tickets_sold;
  document.getElementById("tickets").textContent = ticketsLeft;

  const buyButton = document.getElementById("buy-ticket");
  buyButton.disabled = ticketsLeft === 0;

  buyButton.onclick = () => buyTicket(movie);
}

function buyTicket(movie) {
  let ticketsLeft = movie.capacity - movie.tickets_sold;
  if (ticketsLeft > 0) {
      movie.tickets_sold += 1;
      ticketsLeft -= 1;
      document.getElementById("tickets").textContent = ticketsLeft;

      if (ticketsLeft === 0) {
          document.getElementById("buy-ticket").disabled = true;
      }

      // PATCH request to update backend
      fetch(`http://localhost:3000/films/${movie.id}`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ tickets_sold: movie.tickets_sold })
      })
      .catch(err => console.error("Error updating tickets:", err));
  }
}
