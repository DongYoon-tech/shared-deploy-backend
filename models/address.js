const db = require("../db");
const ExpressError = require("../helpers/ExpressError");

class Address {

    static async findAll() {
        const result = await db.query(
            `SELECT id, meet_address, hobbies_id, created_at
        FROM address`
        )
        return result.rows
    }

    static async findOne(id) {
        const addressRes = await db.query(
            `SELECT id, meet_address, hobbies_id, created_at
            FROM address
            WHERE id = $1`,
            [id]
        );

        const address = addressRes.rows[0];

        if (!address) {
            throw new ExpressError(`There exits no address '${id}'`, 404);
        }

        const hobbiesRes = await db.query(
            `SELECT id, activity, user_username 
        FROM hobbies
        WHERE id = $1`,
            [address.hobbies_id]
        );

        address.hobbiesList = hobbiesRes.rows[0];

        return address;
    }

    static async create(data) {
        const result = await db.query(
            `INSERT INTO address (meet_address, hobbies_id) 
        VALUES ($1, $2) 
        RETURNING id, meet_address, hobbies_id`,
            [data.meet_address, data.hobbies_id]
        );

        return result.rows[0];
    }

    static async update(id, data) {

        const query = `UPDATE address
                        SET (meet_address = $1,
                            hobbies_id = $2)
                        WHERE id = $3
                        RETURNING id,
                                meet_address,
                                hobbies_id,
                                created_at`;
        const values = [
            data.meet_address,
            data.hobbies_id,
            id
        ]
        const result = await db.query(query, values);
        const address = result.rows[0];

        if (!address) {
            throw new ExpressError(`There exists no address '${id}`, 404);
        }

        return address;
    }

    static async remove(id) {
        const result = await db.query(
            `DELETE FROM address 
        WHERE id = $1 
        RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`There exists no address '${id}`, 404);
        }
    }
}

module.exports = Address;
