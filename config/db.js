require("dotenv").config();

const { query } = require("express");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

const executeQuery = async (text, params) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows;
  } finally {
    client.release();
  }
};

module.exports = { executeQuery };
