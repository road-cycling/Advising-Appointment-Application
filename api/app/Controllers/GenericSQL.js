const dbConnection = require('../../database/mySQLconnect')
// const bcrypt = require('bcrypt')

require('dotenv').config()

class GenericSQL {

    constructor(){}

    static ping() { console.log('pong')}

    static async genericInsert({
        tableName,        /* String */
        argumentNameList, /* Array<String> */
        values            /* Array<Arguments> */
    }) {

        return new Promise((resolve, reject) => {
            
            const argNameList = argumentNameList.map((item, idx) => {
                if ( idx === argumentNameList.length - 1)
                    return `${item}`
                return `${item}, `
            }).join('')
    
            const variadicList = argumentNameList.map((item, idx) => {
                if ( idx === argumentNameList.length - 1)
                    return `?`
                return `?, `
            }).join('')
    
            const sql = `
                INSERT INTO ${tableName}
                    ( ${argNameList} )
                VALUES
                    ( ${variadicList} )`
            console.log(sql)
            dbConnection.query({ sql, values }, (error, tuples) => {
                if (error) {
                    console.log(error)
                    return reject()

                }
                return resolve(tuples)
            })
        })
    }
}

GenericSQL.ping()

// GenericSQL.genericInsert({
//     tableName: 'AdviseeView',
//     argumentNameList: ['student_id', 'first_name', 'last_name', 'h_password', 'email'],
//     values: [ 150000, 'Joe', 'Schmo', 'asdfasdf', 'joeSchmo@yahoo.com' ]
// })

module.exports = GenericSQL

// function foo (a, b, c, d) {
//     let arr = [...arguments, "foobar"]
//     console.log(arr)
// }

// foo (1, 2, 3, 4)

// INSERT INTO AdvisingBlock 
//     ( advisor_id, start_day, session_length, num_sessions_in_day )   
// VALUES                    
// ( `advisor_id` = 12345, `start_day` = '2019-04-01 10:00:00', `session_length` = 20, `num_sessions_in_day` = 10 )