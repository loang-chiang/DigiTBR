// GLOBAL VARIABLES
const new_book_form = document.querySelector("#new-book");
const continuing_category = document.querySelector("#book-continuing-cont");


// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', function() {
    
    // users clicks on add-book
    document.querySelector("#add-book").onclick = function() {
        new_book_form.style.display = "block";  // displays add_book menu
        continuing_category.style.display = "none";  // keeps the continuing series hidden until later
    }

    // user clicks on book genre
    document.querySelectorAll(".book-genre").forEach(option => {
        option.onclick = () => choice("genre", option, false);
    })

    // user clicks on book priority
    document.querySelectorAll(".book-priority").forEach(option => {
        option.onclick = () => choice("priority", option);
    })

    // user clicks on book length
    document.querySelectorAll(".book-length").forEach(option => {
        option.onclick = () => choice("length", option);
    })

    // user clicks on book age range
    document.querySelectorAll(".book-agerange").forEach(option => {
        option.onclick = () => choice("agerange", option);
    })

    // user clicks on book type
    document.querySelectorAll(".book-type").forEach(option => {
        option.onclick = function() {
            choice("type", option);
            if (option.textContent === "Duology/Trilogy" || option.textContent === "Series") {
                if (!option.classList.contains("chosen")) {  // if clicking a second time, aka unchoosing
                    continuing_category.style.display = "none";
                }
                else {
                    continuing_category.style.display = "block";  // displays continuing category if series
                }
            }
            else {
                continuing_category.style.display = "none";  // hides continuing category if not series
            }
        }
    })

    // user clicks on book continuing option
    document.querySelectorAll(".book-continuing").forEach(option => {
        option.onclick = () => choice("continuing", option);
    })

    // user clicks submit on the new book form
    document.querySelector("#new-book-submit").onsubmit = function() {
        let all_filled = true;
        document.querySelectorAll(".required-category").forEach(category => {
            if (category.value === "") {
                all_filled = false;  // this means that the form won't send
            }
        })
        return all_filled;
    }

    // user clicks the x button without having submitted the form
    document.querySelector("#exit-form").onclick = function() {
        clean_and_hide();
    }
})




// FUNCTIONS
function choice(category, option, delete_others = true) {  // runs when a user chooses an option
    console.log(`Running choice function for category ${category} and option ${option.textContent}`);

    let choiceName = option.textContent;

    if (delete_others) {  // if this category is single-choice
        document.querySelectorAll(`.book-${category}`).forEach(choice => {
            if (choice !== option && choice.classList.contains("chosen")) {
                eliminate_choice(category, choice);  // eliminate all other choices
            }
        })
    }

    if (option.classList.contains("chosen")) {  // if the choice has already been clicked
        eliminate_choice(category, option);
    }
    else {
        document.querySelector(`#${category}`).value = choiceName;  // adds choice to hidden input so the backend can read it
        option.classList.add("chosen");
        option.style.backgroundColor = "red";  // styling to show it's been chosen
    }
}


function eliminate_choice(category, option) {  // eliminates choice for multiple choice categories!
    console.log(`Running eliminate_choice function for option ${option.textContent}`);
    
    document.querySelector(`#${category}`).value = "";  // empties the value of the choice so it won't go to the backend
    option.classList.remove("chosen");
    option.style.backgroundColor = "beige";  // styling to reflect it's been unchosen

    if (category === "type") {
        document.querySelector(`#continuing`).value = "";
    }
}


function clean_and_hide() {  // cleans the info for the new book form and hides the form
    console.log("Running clean_and_hide function for this form");

    new_book_form.style.display = "none";  // hides form
}
