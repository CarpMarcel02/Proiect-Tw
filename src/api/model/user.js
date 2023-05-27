const pool = require("../database/connection");

exports.getAllUsers = async () => {
  const result = await pool.query("SELECT * FROM users");
  console.log(result.rows);
  return result.rows;
};
exports.createUser = async (userData) => {
  const { name, email, password, role } = userData;

  console.log(password);
  const queryText =
    "INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4) RETURNING *";
  const values = [name, email, password, role];
  try {
    const result = await pool.query(queryText, values);
    return result.rows[0]; // returneaza utilizatorul creat
  } catch (err) {
    console.error(err);
    throw err;
  }
};
exports.checkUsername = async (name) => {
  try {
    const queryText = "SELECT name FROM users WHERE name =$1";
    const result = await pool.query(queryText, [name]);
    return result.rows.length > 0;
  } catch (err) {
    console.error(err);
    throw new Error("Database query failed");
  }
};
exports.checkEmail = async (email) => {
  try {
    const queryText = "SELECT email FROM users WHERE email =$1";
    const result = await pool.query(queryText, [email]);
    return result.rows.length > 0;
  } catch (err) {
    console.error(err);
    throw new Error("Database query failed");
  }
};

exports.findUserByEmail = async (email) => {
  try {
    // Only select the fields you need
    const queryText = "SELECT name, email, password FROM users WHERE email =$1";
    const result = await pool.query(queryText, [email]);

    if (result.rows.length > 0) {
      // Return the actual user object
      return result.rows[0];
    } else {
      // If no user found, return null
      return null;
    }
  } catch (err) {
    console.error(err);
    // Provide a more specific error message
    throw new Error(`Database query failed: ${err.message}`);
  }
};
exports.findUserByUser = async (username) => {
  try {
    const queryText = "SELECT * FROM users WHERE name =$1";
    const result = await pool.query(queryText, [username]);
    if (result.rows.length > 0) {
      return {
        id: result.rows[0].user_id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        password: result.rows[0].password,
        role: result.rows[0].role,
      };
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    throw new Error(`Database query failed: ${err.message}`);
  }
};