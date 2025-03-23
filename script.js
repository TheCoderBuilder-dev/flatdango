document.addEventListener("DOMContentLoaded", function() {
  fetchMovies()
});

function fetchMovies() {
  fetch("http://localhost:3000/films")
      .then((res) => res.json())
      .then((movies) => {
          displayMovies(movies);
          if (movies.length > 0) {
              showMovieDetails(movies[0]); 
          }
      })
      .catch((err) => console.log("Error fetching movies:", err));
}

function displayMovies(movies) {
  let movieList = document.getElementById("movie-list");
  movieList.innerHTML = "";

  movies.forEach(movie => {
      let li = document.createElement("li");

      let movieTitle = document.createElement("span");
      movieTitle.textContent = movie.title;
      movieTitle.onclick = function () {
          showMovieDetails(movie);
      }

      let deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.onclick = function () {
          deleteMovie(movie.id, li);
      };

      li.appendChild(movieTitle);
      li.appendChild(deleteBtn);
      movieList.appendChild(li);
  });
}

function showMovieDetails(movie) {
  document.getElementById("movie-poster").src = movie.poster;
  document.getElementById("movie-title").textContent = movie.title;
  document.getElementById("runtime").textContent = movie.runtime + " mins"; 
  document.getElementById("movie-description").textContent = movie.description;
  document.getElementById("showtime").textContent = "Showtime: " + movie.showtime; 

  let ticketsLeft = movie.capacity - movie.tickets_sold;
  document.getElementById("tickets").textContent = ticketsLeft;

  let buyButton = document.getElementById("buy-ticket");
  if (ticketsLeft === 0) {
      buyButton.disabled = true;
      buyButton.textContent = "Sold Out";
  } else {
      buyButton.disabled = false;
      buyButton.textContent = "Buy Ticket";
  }

  buyButton.onclick = function() {
      buyTicket(movie);
  };
}

function buyTicket(movie) {
  let ticketsElement = document.getElementById("tickets");
  let buyButton = document.getElementById("buy-ticket");

  let ticketsLeft = parseInt(ticketsElement.textContent);
  if (ticketsLeft > 0) {
      ticketsLeft--;
      ticketsElement.textContent = ticketsLeft;

      if (ticketsLeft === 0) {
          buyButton.disabled = true;
          buyButton.textContent = "Sold Out";
      }

      fetch("http://localhost:3000/films/" + movie.id, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              tickets_sold: movie.capacity - ticketsLeft
          })
      })
      .catch(err => console.log("Error updating tickets", err));
  }
}

function deleteMovie(movieId, listItem) {
  fetch("http://localhost:3000/films/" + movieId, {
      method: "DELETE"
  })
  .then(res => {
      if (res.ok) {
          listItem.remove();
      }
  })
  .catch((err) => console.log("Error deleting movie", err));
}
