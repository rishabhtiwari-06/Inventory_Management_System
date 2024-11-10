from flask import Flask, request, jsonify , session
from flask_cors import CORS  # Import CORS
from db import create_users_table
from db import create_items_table
# from db import create_user_profile
from flask_cors import CORS
import mysql.connector
from db import get_db_connection  # Import database connection from db.py
from werkzeug.security import check_password_hash

app = Flask(__name__)

# Enable CORS with correct configuration
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


# Function to check if user exists by email
def check_user_exists(email):
    connection = get_db_connection()
    cursor = connection.cursor()
    query = "SELECT * FROM users WHERE email = %s"
    cursor.execute(query, (email,))
    user = cursor.fetchone()  # Get the first result or None if no user found
    cursor.close()
    connection.close()
    return user  # Returns user if exists, otherwise None


@app.route("/signup", methods=["POST", "OPTIONS"])
def signup():
    if request.method == "OPTIONS":
        # CORS preflight response
        response = app.make_response((""))
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type,Authorization"
        )
        response.headers.add("Access-Control-Allow-Methods", "POST,OPTIONS")
        return response

    elif request.method == "POST":
        form_data = request.json  # Assuming frontend sends data as JSON
        name = form_data.get("name")
        email = form_data.get("email")
        password = form_data.get("password")

        if not name or not email or not password:
            return jsonify({"status": "error", "message": "Missing data!"}), 400

        # Check if user already exists
        user = check_user_exists(email)
        if user:
            return jsonify({"status": "error", "message": "User already exists!"}), 400

        # Insert data into MySQL if user doesn't exist
        # user_id = user[0]
        try:
            connection = get_db_connection()
            cursor = connection.cursor()

            cursor.execute(
                "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
                (name, email, password),
            )
            connection.commit()

            return jsonify({"status": "success", "message": "User added successfully!" })

        except mysql.connector.Error as err:
            print(f"Error: {err}")
            return jsonify({"status": "error", "message": str(err)}), 500

        finally:
            cursor.close()
            connection.close()


# Route to handle Google login
@app.route('/google-login', methods=['POST'])
def google_login():
    user_data = request.json  # Expecting user details from frontend (Google login)
    email = user_data.get('email')
    name = user_data.get('name')
    # password = user_data.get('password')

    if not email or not name:
        return jsonify({"status": "error", "message": "Missing data!"}), 400

    # Check if the user already exists
    user = check_user_exists(email)
    user_id = user[0]
    if not user:
        # If user doesn't exist, insert into database
        try:
            connection = get_db_connection()
            cursor = connection.cursor()

            cursor.execute(
                "INSERT INTO users (name, email,password) VALUES (%s, %s,%s)",
                (name, email)
            )
            connection.commit()

        except mysql.connector.Error as err:
            return jsonify({"status": "error", "message": str(err)}), 500
        
        finally:
            cursor.close()
            connection.close()

    # Create session for the Google user
    # session['user'] = {'email': email, 'name': name}
    return jsonify({"status": "success", "message": "Google login successful!","user_id":user_id})


@app.route("/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        # CORS preflight response
        response = app.make_response((""))
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type,Authorization"
        )
        response.headers.add("Access-Control-Allow-Methods", "POST,OPTIONS")
        return response

    elif request.method == "POST":
        form_data = request.json  # Assuming frontend sends data as JSON
        email = form_data.get("email")
        password = form_data.get("password")

        if not email or not password:
            return (
                jsonify({"status": "error", "message": "Missing email or password!"}),
                400,
            )

        # Check if the user exists
        user = check_user_exists(email)
        if not user:
            return jsonify({"status": "error", "message": "User does not exist!"}), 400

        # Extract stored password from the database (assuming the 3rd column is the password)
        stored_password = user[3]
        user_id = user[0]

        # Verify the password (plain text comparison)
        if stored_password == password:
            return jsonify({"status": "success", "message": "Login successful!","userid":user_id})
        else:
            return jsonify({"status": "error", "message": "Incorrect password!"}), 401


@app.route("/add-product", methods=["POST", "OPTIONS"])
def add_item():

    if request.method == "OPTIONS":
        response = app.make_response((""))
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "POST,OPTIONS")
        return response

    elif request.method == "POST":
        form_data = request.json
        user_id = form_data.get("user_id")  # This should be passed from frontend (e.g., via session)
        item_name = form_data.get("item_name")
        category = form_data.get("category")
        price = form_data.get("price")
        quantity = form_data.get("quantity")

        if not item_name or not category or not price or not user_id:
            return jsonify({"status": "error", "message": "Missing data!"}), 400

        try:
            connection = get_db_connection()
            cursor = connection.cursor()
            cursor.execute(
                "INSERT INTO items (user_id, item_name, category, price,quantity) VALUES (%s, %s, %s, %s,%s)",
                (user_id, item_name, category, price, quantity),
            )
            connection.commit()
            return jsonify({"status": "success", "message": "Item added successfully!"})

        except mysql.connector.Error as err:
            print(f"Error: {err}")
            return jsonify({"status": "error", "message": str(err)}), 500

        finally:
            cursor.close()
            connection.close()

@app.route('/get-items', methods=['GET'])
def get_items():
    user_id = request.args.get('user_id')
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)  # This will return data with column names

    # Fetch items for the given user_id
    cursor.execute("SELECT * FROM items WHERE user_id = %s", (user_id,))
    items = cursor.fetchall()

    # print("Fetched items:", items)  # Debugging
    return jsonify(items)



@app.route('/get-user-details', methods=['GET'])
def getUserDetails():
    user_id = request.args.get('user_id')
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)  # This will return data with column names

    # Fetch items for the given user_id
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    profile = cursor.fetchall()

    # print("Fetched items:", items)  # Debugging
    return jsonify(profile)

@app.route('/update-quantity', methods=['POST'])
def update_quantity():
    try:
        data = request.json
        print(data)
        item_id = data.get('item_id')
        quantity = data.get('quantity')

        if not item_id or quantity is None:
            return jsonify({"error": "Invalid data"}), 400

        # Connect to the database
        connection = get_db_connection()
        cursor = connection.cursor()

        # Update the item quantity in the database
        query = "UPDATE items SET quantity = %s WHERE id = %s"
        cursor.execute(query, (quantity, item_id))
        connection.commit()

        # Close database connections
        cursor.close()
        connection.close()

        return jsonify({"success": True, "message": "Quantity updated successfully"}), 200

    except Exception as e:
        print("Error updating quantity:", e)
        return jsonify({"error": "An error occurred while updating quantity"}), 500

@app.route('/delete-item', methods=['DELETE'])
def delete_item():
    data = request.get_json()
    item_id = data.get('item_id')

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Delete the item with the specified ID
        cursor.execute("DELETE FROM items WHERE id = %s", (item_id,))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({"message": "Item deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# New route for the homepage
@app.route("/", methods=["GET"])
def home():
    return "API is running!"  # This will display on the homepage


if __name__ == "__main__":
    create_users_table() 
    create_items_table()
    
    app.run(debug=True)
