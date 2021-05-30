const dbConnection = require('../../database/mySQLconnect');

const Controller = require('./Controller')

class AdvisingController extends Controller{

    constructor () { super(); console.log('Constructor called for AdvisingController') }

    advisorSession(ctx) {
        return new Promise((resolve, reject) => {
      
          let { advisor } = ctx.params 
      
          // const sql = `
          //   SELECT 
          //   a.first_name,
          //   a.last_name,
          //   a.email,
          //   a.lock_time,
          //   ab.session_length,
          //   ads.start_time,
          //   ads.approved,
          //   ads.booked,
          //   ads.lookup_key
          //   FROM Advisor a
          //   LEFT JOIN AdvisingBlock ab ON
          //     a.advisor_id = ab.advisor_id 
          //   LEFT JOIN AdvisingSession ads ON 
          //     ab.advisor_id = ads.advisor_id
          //   WHERE a.advisor_id = 12345 AND ads.start_time < NOW()
          //     ORDER BY ads.start_time ASC `;
          const sql = `select * from AdvisingSession WHERE advisor_id = ?` /* and start_time < NOW()` (for demo purposes)*/
          dbConnection.query({ sql, values: [ advisor ] }, (err, result) => {
            if (err) {
                console.log("err")
                console.log(err)
                return reject()
            }
            ctx.body = result;
            return resolve()
          })
        });
      }

}

module.exports = AdvisingController

/*

select * from AdvisingSession WHERE student_id = ? AND booked = true AND approved = false; 
// */
