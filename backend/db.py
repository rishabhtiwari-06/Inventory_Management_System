import mysql.connector

db_config = {
    'user': 'root',
    'password': 'ohmanihavethem',
    'host': '127.0.0.1',
    'database': 'inventory_db'
}

def get_db_connection():
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except mysql.connector.Error as err:
        print(f"Error connecting to the database: {err}")
        return None

def create_users_table():
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor()
        create_table_query = """
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );
        """
        cursor.execute(create_table_query)
        connection.commit()
        cursor.close()
        connection.close()
        print("Users table created (if it didn't exist).")
    else:
        print("Failed to connect to the database.")

def create_items_table():
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor()
        create_table_query = """
        CREATE TABLE IF NOT EXISTS items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            item_name VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        """
        cursor.execute(create_table_query)
        connection.commit()
        cursor.close()
        connection.close()
        print("Items table created (if it didn't exist).")
    else:
        print("Failed to connect to the database.")


