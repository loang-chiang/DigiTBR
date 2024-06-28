import os

from flask import Flask, flash, redirect, render_template, request, session, abort, url_for, jsonify
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy import Integer, String, ForeignKey
from functools import wraps
from werkzeug.security import check_password_hash, generate_password_hash

# configures application
app = Flask(__name__)
app.debug = True

# configures session to use filesystem instead of signed cookies
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_FILE_DIR"] = "./flask_session_cache"
Session(app)


# DATABASE CONFIGURATION
class Base(DeclarativeBase):
    pass
db = SQLAlchemy(model_class=Base)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
db.init_app(app)

# model declaration
class User(db.Model):
    __tablename__ = 'User'

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column()
    hash: Mapped[str] = mapped_column()

class Book(db.Model):
    __tablename__ = 'Book'

    id:  Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("User.id"))
    title: Mapped[str] = mapped_column()
    author: Mapped[str] = mapped_column()
    genre: Mapped[str] = mapped_column()
    priority: Mapped[str] = mapped_column()
    length: Mapped[str] = mapped_column()
    agerange: Mapped[str] = mapped_column()
    type: Mapped[str] = mapped_column()
    continuing: Mapped[str] = mapped_column()

with app.app_context():
    db.create_all()


# LOGIN AND LOGOUT FUNCTIONS

@app.after_request
def after_request(response):  # disables caching of the response
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


def login_required(f):  # requires user to have logged in to access certain routes
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function


@app.route("/")
@login_required
def index():  # shows the page index
    # order the user's books
    by_title_a = db.session.query(Book).filter_by(user_id=session["user_id"]).order_by(Book.title).all()
    by_title_z = db.session.query(Book).filter_by(user_id=session["user_id"]).order_by(Book.title.desc()).all()
    by_priority_high = db.session.query(Book).filter_by(user_id=session["user_id"]).order_by(Book.priority.desc()).all()
    by_priority_low = db.session.query(Book).filter_by(user_id=session["user_id"]).order_by(Book.priority).all() 
    by_length_high = db.session.query(Book).filter_by(user_id=session["user_id"]).order_by(Book.priority.desc()).all()
    by_length_low = db.session.query(Book).filter_by(user_id=session["user_id"]).order_by(Book.priority).all()
    by_author = db.session.query(Book).filter_by(user_id=session["user_id"]).order_by(Book.author).all()
    by_genre = db.session.query(Book).filter_by(user_id=session["user_id"]).order_by(Book.genre).all()
    by_agerange = db.session.query(Book).filter_by(user_id=session["user_id"]).order_by(Book.agerange).all()
    by_type = db.session.query(Book).filter_by(user_id=session["user_id"]).order_by(Book.type).all()

    return render_template("index.html",
        by_title_a=by_title_a,
        by_title_z=by_title_z,
        by_priority_high=by_priority_high,
        by_priority_low=by_priority_low,
        by_length_high=by_length_high,
        by_length_low=by_length_low,
        by_author=by_author,
        by_genre=by_genre,
        by_agerange=by_agerange,
        by_type=by_type,
    )


@app.route("/register", methods=["GET", "POST"])
def register():  # registers new users
    if request.method == "POST":
        if not request.form.get("username"):
            return render_template("error.html", message="Must provide username")
        elif not request.form.get("password"):
            return render_template("error.html", message="Must provide password")
        elif not request.form.get("confirmation"):
            return render_template("error.html", message="Must provide password a second time")
        elif request.form.get("password") != request.form.get("confirmation"):
            return render_template("error.html", message="Passwords do not match")

        # queries database to check if username already exists
        username = request.form.get("username")
        print(username)
        users = list(db.session.execute(db.select(User).filter_by(username=username)).scalars())
        if len(users) > 0:
            return render_template("error.html", message="Username already exists")

        # inserts new user into the database
        hashed_password = generate_password_hash(request.form.get("password"))
        user = User(
            username=username,
            hash=hashed_password
        )
        db.session.add(user)
        db.session.commit()

        # gets user back to login page
        return redirect("/login")

    else:
        return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():  # logs users in
    session.clear()  # forgets any user_id

    if request.method == "POST":
        if not request.form.get("username"):  # check if username was submitted
            return render_template("error.html", message="Must provide username")
        elif not request.form.get("password"):  # check if password was submitted
            return render_template("error.html", message="Must provide password")

        # queries database for username
        username = request.form.get("username")

        try:
            user = db.session.execute(db.select(User).filter_by(username=username)).scalar_one()
        except NoResultFound:
            return render_template("error.html", message="Invalid username and/or password")

        # checks if username exists and password are correct
        if not user or not check_password_hash(user.hash, request.form.get("password")):
            return render_template("error.html", message="Invalid username and/or password")

        session["user_id"] = user.id  # remembers which user has logged in
        return redirect("/")

    else:
        return render_template("login.html")


@app.route("/logout")
@login_required
def logout():  # allows the user to log out of their account
    session.clear()
    return redirect("/")


# OTHER FUNCTIONS

@app.route("/new_book", methods=["POST"]) 
@login_required
def new_book():  # adds new book to database
    # gets info from form
    title = request.form.get("title")
    author = request.form.get("author")
    genre = request.form.get("genre")
    priority = request.form.get("priority")
    length = request.form.get("length")
    agerange = request.form.get("agerange")
    type = request.form.get("type")
    continuing = request.form.get("continuing")

    # creates book instance and adds it to database
    book = Book(
        user_id=session["user_id"],
        title=title,
        author=author,
        genre=genre,
        priority=priority,
        length=length,
        agerange=agerange,
        type=type,
        continuing=continuing,
    )
    db.session.add(book)
    db.session.commit()

    return redirect("/")  # takes user back to homepage


@app.route("/load_edit", methods=["POST"]) 
@login_required
def load_edit():  # sends a book's data to the frontend so it can be shown to the user
    # picks the book from the database using its id
    data = request.get_json()
    book_id = data.get("book_id")
    book = db.session.execute(db.select(Book).filter_by(user_id=session["user_id"], id=book_id)).scalar_one()

    # sends the data to the frontend!
    return jsonify(
        title=book.title, 
        author=book.author, 
        genre=book.genre, 
        priority=book.priority, 
        length=book.length, 
        agerange=book.agerange, 
        type=book.type, 
        continuing=book.continuing
    ), 201


@app.route("/edit_book", methods=["POST"])
@login_required
def edit_book():  # edits a book's data
    # gets info from form
    book_id = request.form.get("edit-id")
    title = request.form.get("edit-title")
    author = request.form.get("edit-author")
    genre = request.form.get("edit-genre")
    priority = request.form.get("edit-priority")
    length = request.form.get("edit-length")
    agerange = request.form.get("edit-agerange")
    type = request.form.get("edit-type")
    continuing = request.form.get("edit-continuing")

    print(length)

    book = db.session.execute(db.select(Book).filter_by(user_id=session["user_id"], id=book_id)).scalar_one()
    book.title = title
    book.author = author
    book.genre = genre
    book.priority = priority
    book.length = length
    book.agerange = agerange
    book.type = type
    book.continuing = continuing
    db.session.commit()

    return redirect("/")  # takes user back to homepage