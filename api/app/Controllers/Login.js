const dbConnection = require('../../database/mySQLconnect')
const GenericSQL = require('./GenericSQL');
const jwt              = require('jsonwebtoken');
// const bcrypt = require('bcrypt')

require('dotenv').config()


class Login extends GenericSQL {

    async loginAdvisee(ctx) {
        console.log("Hit ADV")
        return new Promise((resolve, reject) => {
            let { request: { body } } = ctx;
        
            let { student_id, h_password } = body;
    
            const sql = `
                SELECT * from Advisee 
                WHERE h_password = ? AND student_id = ?`;
    
            dbConnection.query({ sql, values: [ h_password, student_id ] }, (error, tuples) => {
                if ( error )
                    return reject("Error in login")

                if ( tuples.length == 1 ) {
                    let {
                        student_id,
                        first_name,
                        last_name,
                        email
                    } = tuples[0]
                    const webToken = jwt.sign({ student_id, first_name, last_name, email }, "ShittySecretKey")
                    ctx.body = { "success": true, "jwt": webToken }
                    ctx.status = 200
                    return resolve()
                } else {
                    ctx.body = { "success": false }
                    return resolve()
                }
                
            })
        })

    }

    async loginAdvisor(ctx) {
        console.log("HIt advvv")
        return new Promise((resolve, reject) => {
            let {request: { body } } = ctx;

            let { advisor_id, h_password } = body;

            const sql = `
            SELECT * FROM Advisor
            WHERE h_password = ? AND advisor_id = ?`;

            dbConnection.query({sql, values: [ h_password, advisor_id ] }, (error, tuples) => {
                if (error)
                return reject ("Error in Advisor Login")

                if (tuples.length == 1) {
                    let {
                        advisor_id,
                        first_name, 
                        last_name, 
                        email
                    } = tuples[0] 
                    const webToken = jwt.sign({ advisor_id, first_name, last_name, email }, "ShittySecretKey")
                    ctx.body = { "success": true, "jwt": webToken}
                    ctx.status = 200
                    return resolve()
                } else {
                    ctx.body = { "success": false}
                    return resolve()
                }
            })
        })
    }


}

module.exports = Login