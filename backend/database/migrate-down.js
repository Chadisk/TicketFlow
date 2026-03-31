import pool from '../src/db.js';

const dropTables = async () => {
  try {
    console.log('Dropping tables...');
    await pool.query('DROP TABLE IF EXISTS tickets CASCADE');
    console.log('Tables dropped successfully');
    await pool.end();
  } catch (err) {
    console.error('Drop failed:', err);
    await pool.end();
    process.exit(1);
  }
};

dropTables();
