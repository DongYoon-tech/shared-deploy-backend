const db = require("../db");
const bcrypt = require("bcrypt");
const ExpressError = require("../helpers/ExpressError");

const BCRYPT_WORK_FACTOR = 10;

class User {

    static async authenticate(data) {

        const result = await db.query(
            `SELECT username, 
              password, 
              first_name, 
              last_name, 
              email, 
              lat,
              lng
        FROM users 
        WHERE username = $1`,
            [data.username]
        );

        const user = result.rows[0];

        if (user) {

            const isValid = await bcrypt.compare(data.password, user.password);
            if (isValid) {
                return user;
            }
        }

        throw new ExpressError("Invalid Password", 401);
    }

    static async register(data) {
        const duplicateCheck = await db.query(
            `SELECT username 
        FROM users 
        WHERE username = $1`,
            [data.username]
        );

        if (duplicateCheck.rows[0]) {
            throw new ExpressError(
                `There already exists a user with username '${data.username}`,
                400
            );
        }

        const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users 
          (username, password, first_name, last_name, email, lat, lng) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING username, password, first_name, last_name, email, lat, lng`,
            [
                data.username,
                hashedPassword,
                data.first_name,
                data.last_name,
                data.email,
                data.lat,
                data.lng
            ]
        );

        return result.rows[0];
    }

    static async findAll() {
        const result = await db.query(
            `SELECT username, first_name, last_name, email,  lat, lng
        FROM users
        ORDER BY username`
        );

        return result.rows;
    }

    static async findOne(username) {
        const userRes = await db.query(
            `SELECT username, first_name, last_name, email,  lat, lng
        FROM users 
        WHERE username = $1`,
            [username]
        );

        const user = userRes.rows[0];

        if (!user) {
            throw new ExpressError(`There exists no user '${username}'`, 404);
        }

        const userHobbiesRes = await db.query(
            `SELECT h.id, h.activity, h.user_username
            FROM hobbies AS h
            WHERE h.user_username = $1`, [username]
        )

        user.hobbies = userHobbiesRes.rows.map(h => (
            {
                id: h.id,
                activity: h.activity
            }
        ))

        // const userJobsRes = await db.query(
        //   `SELECT j.title, j.company_handle, a.state 
        //     FROM applications AS a
        //       JOIN jobs AS j ON j.id = a.job_id
        //     WHERE a.username = $1`,
        //   [username]
        // );

        // user.jobs = userJobsRes.rows;
        return user;
    }

    static async update(username, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        const res = await db.query(`
                        UPDATE users
                        SET password = $1, 
                            first_name = $2, 
                            last_name = $3, 
                            email = $4, 
                            lat = $5, 
                            lng = $6
                        WHERE username = $7
                        RETURNING username,
                        first_name, 
                        last_name, 
                        email, 
                        lat,
                        lng`,
            [data.password,
            data.first_name,
            data.last_name,
            data.email,
            data.lat,
            data.lng,
                username])

        const user = res.rows[0]

        if (!user) {
            throw new ExpressError(`There exists no user '${username}'`, 404);
        }

        delete user.password;

        return user;
    }

    static async remove(username) {
        let result = await db.query(
            `DELETE FROM users 
        WHERE username = $1
        RETURNING username`,
            [username]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`There exists no user '${username}'`, 404);
        }
    }
}

module.exports = User;
