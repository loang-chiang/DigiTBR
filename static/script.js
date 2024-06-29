// GLOBAL VARIABLES
const new_book_form = document.querySelector("#new-book");
const continuing_category = document.querySelector("#book-continuing-cont");
const edit_book_form = document.querySelector("#edit-book");
// the following are for the sorting options
const by_title_a = document.querySelector("#cont-title-a");
const by_title_z = document.querySelector("#cont-title-z");
const by_priority_high = document.querySelector("#cont-priority-high");
const by_priority_low = document.querySelector("#cont-priority-low");
const by_length_high = document.querySelector("#cont-length-high");
const by_length_low = document.querySelector("#cont-length-low");
const cont_author = document.querySelector("#cont-author");
const cont_genre = document.querySelector("#cont-genre");
const cont_agerange = document.querySelector("#cont-agerange");
const cont_type = document.querySelector("#cont-type");


// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', function() {
    
    //  FOR NEW BOOK
        // users clicks on add-book
        document.querySelector("#add-book").onclick = function() {
            new_book_form.style.display = "block";  // displays add_book menu
            console.log(new_book_form.style.display);
            continuing_category.style.display = "none";  // keeps the continuing series hidden until later
        }

        // user clicks on book genre
        document.querySelectorAll(".option-genre").forEach(option => {
            option.onclick = () => choice("genre", option);
        })

        // user clicks on book priority
        document.querySelectorAll(".option-priority").forEach(option => {
            option.onclick = () => choice("priority", option);
        })

        // user clicks on book length
        document.querySelectorAll(".option-length").forEach(option => {
            option.onclick = () => choice("length", option);
        })

        // user clicks on book age range
        document.querySelectorAll(".option-agerange").forEach(option => {
            option.onclick = () => choice("agerange", option);
        })

        // user clicks on book type
        document.querySelectorAll(".option-type").forEach(option => {
            option.onclick = function() {
                choice("type", option);
                if (option.textContent === "Duology/Trilogy" || option.textContent === "Series") {
                    if (!option.classList.contains("chosen")) {  // if clicking a second time, aka unchoosing
                        continuing_category.style.display = "none";

                        document.querySelectorAll(".option-continuing").forEach(choice => {
                            eliminate_choice("continuing", choice)  // eliminates the choices inside continuing
                        })
                    }
                    else {
                        continuing_category.style.display = "block";  // displays continuing category if series
                    }
                }
                else {
                    continuing_category.style.display = "none";  // hides continuing category if not series

                    document.querySelectorAll(".option-continuing").forEach(choice => {
                        eliminate_choice("continuing", choice)  // eliminates the choices inside continuing
                    })
                }
            }
        })

        // user clicks on book continuing option
        document.querySelectorAll(".option-continuing").forEach(option => {
            option.onclick = () => choice("continuing", option);
        })

        // user clicks submit on the new book form
        document.querySelector("#new-book-form").onsubmit = function() {
            let all_filled = true;
            document.querySelectorAll(".required-category").forEach(category => {
                if (category.value === "") {
                    all_filled = false;  // this means that the form won't send if there is lacking info
                }
            })
            return all_filled;
        }

        // user clicks the x button without having submitted the new book form
        document.querySelector("#exit-form").onclick = function() {
            clean_form();
            new_book_form.style.display = "none";
        }

    // FOR EDIT BOOK FORM
        // user clicks on edit button
        document.querySelectorAll('.edit-book').forEach(book => {
            book.onclick = function() {
                load_edit(book.id);
                edit_book_form.style.display = "block";  // displays edit book menu
            }
        })

        // user clicks on book genre
        document.querySelectorAll(".edit-option-genre").forEach(option => {
            option.onclick = () => choice("genre", option, "edit-");
        })

        // user clicks on book priority
        document.querySelectorAll(".edit-option-priority").forEach(option => {
            option.onclick = () => choice("priority", option, "edit-");
        })

        // user clicks on book length
        document.querySelectorAll(".edit-option-length").forEach(option => {
            option.onclick = () => choice("length", option, "edit-");
        })

        // user clicks on book age range
        document.querySelectorAll(".edit-option-agerange").forEach(option => {
            option.onclick = () => choice("agerange", option, "edit-");
        })

        // user clicks on book type
        document.querySelectorAll(".edit-option-type").forEach(option => {
            option.onclick = function() {
                choice("type", option);
                if (option.textContent === "Duology/Trilogy" || option.textContent === "Series") {
                    if (!option.classList.contains("chosen")) {  // if clicking a second time, aka unchoosing
                        continuing_category.style.display = "none";

                        document.querySelectorAll(".edit-option-continuing").forEach(choice => {
                            eliminate_choice("continuing", choice, "edit-")  // eliminates the choices inside continuing
                        })
                    }
                    else {
                        continuing_category.style.display = "block";  // displays continuing category if series
                    }
                }
                else {
                    continuing_category.style.display = "none";  // hides continuing category if not series

                    document.querySelectorAll(".edit-option-continuing").forEach(choice => {
                        eliminate_choice("continuing", choice, "edit-")  // eliminates the choices inside continuing
                    })
                }
            }
        })

        // user clicks on book continuing option
        document.querySelectorAll(".option-continuing").forEach(option => {
            option.onclick = () => choice("continuing", option);
        })

        // user clicks the x button without having submitted the edit book form
        document.querySelector("#edit-exit-form").onclick = function() {
            clean_form("edit-");  // argument targets the edit book form specifically
            edit_book_form.style.display = "none";
        }

        // user clicks submit on the edit book form
        document.querySelector("#edit-book-form").onsubmit = function() {
            let all_filled = true;
            document.querySelectorAll(".edit-required-category").forEach(category => {
                if (category.value === "") {
                    all_filled = false;  // this means that the form won't send if there is lacking info
                }
            })
            return all_filled;
        }

    // OTHERS
        // user selects a sorting option
        document.querySelector("#select").onchange = function() {
            document.querySelectorAll(".books-cont").forEach(container => {
                console.log(this.value);
                if (container.id === `cont-${this.value}`) {  // if this is the sort type the user picked
                    container.style.display = "block";
                }
                else {
                    container.style.display = "none";
                }
            })
        }

        // user clicks on delete book
        document.querySelectorAll('.delete-book').forEach(book => {
            book.onclick = () => delete_book(book.id); 
        })
})


// FUNCTIONS
function choice(category, option, form_prefix = "") {  // runs when a user chooses an option
    console.log(`Running choice function for category ${category} and option ${option.textContent}`);

    let choiceName = option.textContent;

    if (option.classList.contains("chosen")) {  // if the choice has already been clicked
        eliminate_choice(category, option, form_prefix);
    }
    else {
        document.querySelectorAll(`.option-${category}`).forEach(choice => {
            if (choice !== option && choice.classList.contains("chosen")) {
                eliminate_choice(category, choice, form_prefix);  // eliminate all other choices
            }
        })

        document.querySelector(`#${form_prefix}${category}`).value = choiceName;  // adds choice to hidden input so the backend can read it
        option.classList.add("chosen");
        option.style.backgroundColor = "red";  // styling to show it's been chosen
    }
}


function eliminate_choice(category, option, form_prefix = "") {  // eliminates choice!
    console.log(`Running eliminate_choice function for option ${option.textContent}`);
    
    document.querySelector(`#${form_prefix}${category}`).value = "";  // empties the value of the choice so it won't go to the backend
    option.classList.remove("chosen");
    option.style.backgroundColor = "beige";  // styling to reflect it's been unchosen
}


function clean_form(form_prefix = "") {  // cleans the info for the new book form or the edit form. IN PROGRESS
    console.log("Running clean_form function");

    // cleans the text inputs
    document.querySelector(`#${form_prefix}title`).value = "";
    document.querySelector(`#${form_prefix}author`).value = "";

    // cleans the div inputs
    let categories = [`title`, `genre`, `author`, `priority`, `length`, `agerange`, `type`, `continuing`];
    for (let category of categories) {
        if (document.querySelector(`#${form_prefix}${category}`).value !== "") {  // only empties the filled categories
            console.log()
            document.querySelectorAll(`.option-${category}`).forEach(option => {
                eliminate_choice(category, option, form_prefix);
            })
        }
    }
}


function load_edit(book_id) {  // loads the edit book form with all the necessary info
    console.log(`Running load_edit function for book ${book_id}`);

    // adds id to hidden input so the backend knows which book it is when we send the form
    document.querySelector("#edit-id").value = book_id;

    // sends data to python func
    fetch('/load_edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            book_id: book_id,
        })
    })
    .then(response => response.json())
    .then(response => {
        // updates form to reflect the info
        document.querySelector("#edit-title").value = response["title"];
        document.querySelector("#edit-author").value = response["author"];

        // these placeholders are needed or the code won't understand spaces or slashes
        let genre_temp = response["genre"].replace(' ', '-');
        let agerange_temp = response["agerange"].replace(' ', '-');
        let type_temp = response["type"].replace('/', '\\/');  
        let continuing_temp = response["continuing"].replace(' ', '-');

        // gets the divs the user originally chose
        let genre = document.querySelector(`#edit-genre-${genre_temp}`);
        let priority = document.querySelector(`#edit-priority-${response["priority"]}`);
        let length = document.querySelector(`#edit-length-${response["length"]}`);
        let agerange = document.querySelector(`#edit-agerange-${agerange_temp}`);
        let type = document.querySelector(`#edit-type-${type_temp}`);
        let continuing = document.querySelector(`#edit-continuing-${continuing_temp}`);

        // calls choice() to mark them as picked
        let form_prefix = "edit-";
        choice("genre", genre, form_prefix);
        choice("priority", priority, form_prefix);
        choice("length", length, form_prefix);
        choice("agerange", agerange, form_prefix);
        choice("type", type, form_prefix);
        choice("continuing", continuing, form_prefix);
    })
}


function delete_book(book_id) {  // deletes the book from the database
    console.log(`Running delete_book function for book ${book_id}`);

    // sends data to python func
    fetch('/delete_book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            book_id: book_id,
        })
    })
    .then(() => {
        document.querySelectorAll(`#book-div-${book_id}`).forEach(container => {
            container.remove();
        })
    })
}