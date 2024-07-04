# DigiTBR

### [Video Demo](https://youtu.be/2JBE9cNvk3c)

## Overview
The story behind this web app is a tale of two qualities of mine: one good and one bad. The good one is that I have been a very avid reader from a young age. The bad one is that I've always been - and still am - awfully indecisive. The combination of these two means that my TBR list (list of books one is planning / wants to read, for those who aren't acquainted with the term) is massive and eternally growing. After trying many methods to keep it organized like endless notes app entries and annoying spreadsheets, I decided to take matters into my own hands and create my own TBR organizing tool.

## Technologies Used
For this project, I used the **Flask** framework! For the frontend part of the program, I used **HTML/CSS**, the **Bootstrap** library for improved styling, and **JavaScript**, which was also used to communicate between my front- and back-ends.
My back-end was built using **Python** and **Flask-SQLAlchemy** for the SQLite database.
Finally, I also used Bootstrap Icons for the plus sign and open book icons as well as Google Fonts - the entire website uses Zilla Slab!

## Functionality
### Adding a New Book
Starting out with this app is easy: after registering a new account and landing on the homepage, you just have to click on the plus sign at the right corner of the screen to add a new book! You'll notice that a dialog will pop up asking you to input the following information for the book:
* Title
* Author
* Priority: here you are able to rank from 1 to 5 how much you want to read this book. If you still aren't sure, don't worry too much about it as you'll always be able to edit this information
* Genre
* Length
* Age Range
* Type: meaning whether it is an Standalone novel, part of a Duology/Trilogy, part of a Series, or a Spin-off
* Continuing: if you choose either Duology/Trilogy or Series for the type category, an additional (totally optional) category will pop up asking if this is a New Series or one you're Continuing
Once you fill in all the necessary information, you can click on the `Save` button and two things will happen: the new book form will hide, and a new card with your book's information will appear!

### Sorting Your TBR
As you keep adding more books to your TBR, you'll notice that it gets harder to pick the right book to get started on! That's why just under the DigiTBR title, there are several sorting options to help you out:
* Title (from A to Z and from Z to A. A to Z is the default order)
* Priority (from Highest to Lowest and from Lowest to Highest)
* Length (from Longest to Shortest and from Shortest to Longest)
* Others (sort by Author, Genre, Age Range, and Type!)

### Editing 
Oops! While searching for your next favorite read, you've stumbled upon a typo you made while adding a book entry. No worries! Just click on the `Edit` button at the bottom left corner of the book card you want to change the information of, and a form similar to the new book one you already know will appear, filled with your chosen entry's current information. You can now fix your typo and maybe also edit the priority level or any other part of the entry if you feel like it. After you're done, just click on the `Save` button and the form will disappear, leaving you with your now-fixed book card.

### Deleting a Book's Info
Finally, you've chosen what book to read! At the bottom of every book card, beside the Edit button we covered earlier, there's a `Delete` button. Just click it and that book card will disappear and its information get deleted from the database, as simple as that. Now enjoy your reading! <3