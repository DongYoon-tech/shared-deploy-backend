const db = require("../db");
const ExpressError = require("../helpers/ExpressError");

class Hobby {

    static async findAll() {
        const result = await db.query(
            `SELECT 
            id, 
            activity, 
            meet_address, 
            user_username,
            lat,
            lng
        FROM hobbies
        ORDER BY id`
        )
        return result.rows
    }

    static async findOne(id) {
        const hobbyRes = await db.query(
            `SELECT id, 
            activity, 
            meet_address, 
            user_username,
            lat,
            lng
            FROM hobbies
            WHERE id = $1`,
            [id]
        );

        const hobby = hobbyRes.rows[0];

        if (!hobby) {
            throw new ExpressError(`There exits no hobby '${id}'`, 404);
        }

        const usersRes = await db.query(
            `SELECT username, email 
        FROM users
        WHERE username = $1`,
            [hobby.user_username]
        );

        // const addressRes = await db.query(
        //     `SELECT id, meet_address, hobbies_id 
        // FROM address
        // WHERE hobbies_id = $1`,
        //     [hobby.id]
        // );

        hobby.userList = usersRes.rows[0];
        // hobby.addressList = addressRes.rows[0];

        return hobby;
    }

    static async create(data) {
        const result = await db.query(
            `INSERT INTO hobbies (
                activity, 
                meet_address, 
                user_username,
                lat,
                lng) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING 
        id, 
        activity, 
        meet_address, 
        user_username,
        lat,
        lng`,
            [
                data.activity,
                data.meet_address,
                data.user_username,
                data.lat,
                data.lng
            ]
        );

        return result.rows[0];
    }

    static async update(id, data) {

        const query = `UPDATE hobbies
                        SET (activity = $1,
                            meet_address =$2,
                            user_username = $3,
                            lat = $4,
                            lng = $5)
                        WHERE id = $6
                        RETURNING id,
                                activity,
                                meet_address,
                                user_username,
                                lat,
                                lng,
                                created_at`;
        const values = [
            data.activity,
            data.meet_address,
            data.user_username,
            data.lat,
            data.lng,
            id
        ]
        const result = await db.query(query, values);
        const hobby = result.rows[0];

        if (!hobby) {
            throw new ExpressError(`There exists no hobby '${id}`, 404);
        }

        return hobby;
    }

    static async remove(id) {
        const result = await db.query(
            `DELETE FROM hobbies 
        WHERE id = $1 
        RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`There exists no hobby '${id}`, 404);
        }
    }

}

module.exports = Hobby;
