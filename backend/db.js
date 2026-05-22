import mysql from 'mysql2/promise';

const dbConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) ,
    queueLimit: 0
};


let pool;

if (process.env.NODE_ENV === 'production') {
    pool = mysql.createPool(dbConfig);
} else {
    if (!global.dbPool) {
        global.dbPool = mysql.createPool(dbConfig);
    }
    pool = global.dbPool;
}

export async function query(sql, params) {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error("ERROR EN CONEXION A BD:", error.message);
        throw error;
    }
}