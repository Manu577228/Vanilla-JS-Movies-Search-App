// Get DOM elements
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const toggleMode = document.getElementById("toggleMode");
const movieList = document.getElementById("movieList");

// Dark mode toggle
toggleMode.addEventListener("change", function () {
  document.body.classList.toggle("dark-mode");
});

// Fetch movies from OMDB API
const fetchMovies = async (query) => {
  const apiKey = "thewdb"; // Replace with your actual API key
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`
  );
  const data = await response.json();
  return data.Search;
};

// Fetch full movie details
const fetchMovieDetails = async (imdbID) => {
  const apiKey = "thewdb"; // Replace with your actual API key
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`
  );
  const data = await response.json();
  return data;
};

// Display fetched movies
const displayMovies = (movies) => {
  movieList.innerHTML = "";
  movies.forEach((movie) => {
    const movieCard = `
      <div class="col s12 m6">
        <div class="card movie-card">
          <div class="card-image">
            <img src="${movie.Poster}" alt="${movie.Title} Poster" class="movie-poster">
          </div>
          <div class="card-content">
            <span class="card-title truncate" title="${movie.Title}" data-id="${movie.imdbID}">${movie.Title}</span>
            <p>Year: ${movie.Year}</p>
            <div class="details" data-id="${movie.imdbID}">
              <!-- Details will be dynamically loaded here -->
            </div>
            <button class="btn details-button" data-id="${movie.imdbID}">Details</button>
          </div>
        </div>
      </div>
    `;
    movieList.innerHTML += movieCard;
  });

  // Add event listeners to all details buttons
  const detailsButtons = document.querySelectorAll(".details-button");
  detailsButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const imdbID = button.getAttribute("data-id");
      const detailsDiv = document.querySelector(
        `.details[data-id="${imdbID}"]`
      );
      const titleElement = document.querySelector(
        `.card-title[data-id="${imdbID}"]`
      );

      // Fetch and display movie details
      const details = await fetchMovieDetails(imdbID);
      detailsDiv.innerHTML = `
        <p>Genre: ${details.Genre}</p>
        <p>Director: ${details.Director}</p>
        <p>Actors: ${details.Actors}</p>
        <p>Plot: ${details.Plot}</p>
      `;

      // Show the full title
      titleElement.textContent = details.Title;

      // Toggle details display
      detailsDiv.classList.toggle("open");
    });
  });
};

// Search for movies
const searchMovies = async () => {
  const query = searchInput.value.trim();
  if (query.length > 2) {
    const movies = await fetchMovies(query);
    if (movies) {
      displayMovies(movies);
    } else {
      movieList.innerHTML = "<p>No movies found</p>";
    }
  } else {
    movieList.innerHTML = "";
  }
};

// Event listeners for search button and input field
searchButton.addEventListener("click", searchMovies);
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchMovies();
  }
});
