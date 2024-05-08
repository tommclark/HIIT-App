// import { open } from 'sqlite';
// import sqlite3 from 'sqlite3';

// async function init() {
//     const db = await open({
//         filename: './database.sqlite',
//         driver: sqlite3.Database,
//         verbose: true,
//     });
//     await db.migrate({ migrationsPath: './migrations-sqlite' });
//     return db;
// }

// const dbConn = init();

// // db.run('CREATE TABLE IF NOT EXISTS exercises(name TEXT, duration TEXT, restPeriod TEXT, description TEXT)');

// export async function getExercises() {
//     const db = await dbConn;
//     return db.all('SELECT * FROM exercises');
// }
