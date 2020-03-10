// MOVIEA CLASS: REPRESENTS A MOVIE
class Movie {
  constructor(title, director, year) {
    this.title = title;
    this.director = director;
    this.year = year;
  }
}

// UI CLASS: HANDLE UI TASKS
class UI {
  static displayMovie() {
    const movies = Store.getMovie();

    movies.forEach(movie => UI.addMovieToList(movie));
  }

  static addMovieToList(movie) {
    const list = document.querySelector("#movie-list"); //Get Element

    const row = document.createElement("tr"); //Create tr

    row.innerHTML = `
    <td>${movie.title}</td>
    <td>${movie.director}</td>
    <td>${movie.year}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteMovie(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");

    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");
    const form = document.querySelector("#movie-form");
    container.insertBefore(div, form); //insert div before form

    // Remove in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#director").value = "";
    document.querySelector("#year").value = "";
  }
}

// STORE CLASS: HANDLES STORAGE
class Store {
  //NE MOZEMO SPREMITI OBJECT U LOCAL STORAGE ZATO MORAMO PREBACITI U STRING
  static getMovie() {
    let movies;
    if (localStorage.getItem("movies") === null) {
      movies = [];
    } else {
      movies = JSON.parse(localStorage.getItem("movies"));
    }
    return movies;
  }

  static addMovie(movie) {
    const movies = Store.getMovie();
    movies.push(movie);

    localStorage.setItem("movies", JSON.stringify(movies));
  }

  static removeMovie(year) {
    const movies = Store.getMovie();
    movies.forEach((movie, index) => {
      if (movie.year === year) {
        movies.splice(index, 1);
      }
    });

    localStorage.setItem("movies", JSON.stringify(movies));
  }
}

// EVENTS: DISPLAY MOVIE
document.addEventListener("DOMContentLoaded", UI.displayMovie);

//EVENT: ADD A MOVIE
document.querySelector("#movie-form").addEventListener("submit", e => {
  // Prevent actual submit
  e.preventDefault();

  //Get form values
  const title = document.querySelector("#title").value;
  const director = document.querySelector("#director").value;
  const year = document.querySelector("#year").value;

  // Validate
  if (title === "" || director === "" || year === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    // Instatiate movie
    const movie = new Movie(title, director, year);

    // Add book to UI
    UI.addMovieToList(movie);

    // Add movie to store
    Store.addMovie(movie);

    //show success message
    UI.showAlert("Movie added", "success");

    // Clear fields
    UI.clearFields();
  }
});
// EVENT: REMOVE A MOVIE
document.querySelector("#movie-list").addEventListener("click", el => {
  // Remove movie from UI
  UI.deleteMovie(el.target);

  // Remove movie from store
  Store.removeMovie(el.target.parentElement.previousElementSibling.textContent);

  //show delete movie
  UI.showAlert("Movie Removed", "success");
});
