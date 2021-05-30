const dbConnection = require('../../../database/mySQLconnect');
const Authorize = require('../../../app/Authorize.js');
const Create = require('../../../app/Controllers/Create');
const Login = require('../../../app/Controllers/Login')

const CreateController = new Create();
const LoginController = new Login();

const router = require('koa-router')({
    prefix: '/v1'
});

// function foo(ctx) {
//   return new Promise((resolve, reject) => {

//     let { advisor } = ctx.params 

//     const sql = `
//       SELECT 
//       a.first_name,
//       a.last_name,
//       a.email,
//       a.lock_time,
//       ab.session_length,
//       ads.start_time,
//       ads.approved,
//       ads.booked,
//       ads.lookup_key
//       FROM Advisor a
//       LEFT JOIN AdvisingBlock ab ON
//         a.advisor_id = ab.advisor_id 
//       LEFT JOIN AdvisingSession ads ON 
//         ab.advisor_id = ads.advisor_id
//       WHERE a.advisor_id = ? AND ads.start_time < NOW()
//         ORDER BY ads.start_time ASC `;
//     dbConnection.query({ sql, values: [ advisor ] }, (err, result) => {
//       if (err) {
//           console.log("err")
//           console.log(err)
//           return reject()
//       }
//       ctx.body = result;
//       return resolve()
//     })
//   });
// }

// function book(ctx) {
  
//   return new Promise((resolve, reject) => {

//     let { request: { body } } = ctx
//     console.log(body.student_id)
//     console.log(body.advisor_id)

//     let {
//       advisor_id, /*Number*/
//       student_id, /*Number*/
//       lookup_key /*String*/} = body

//     const sql = `
//       update AdvisingSession SET
//       student_id = ?, booked = true 
//       WHERE  advisor_id = ? 
//       AND lookup_key = ?;`;

//     dbConnection.query({ sql, values: [student_id, advisor_id, lookup_key] }, err => {
//       if (err) {
//           ctx.body = { success: false }
//           console.log("err")
//           console.log(err)
//           return reject()
//       }
//       ctx.body = { success: true }
//       return resolve()
//     })
//   });
// }

router
  .get('/', ctx => ctx.body = 'Hello ')
  // .post('/createBlock', CreateController.blockHandler)
  // .post('/createAdvisor', CreateController.createAdvisor)
  // .post('/createAdvisee', CreateController.createAdvisee)
  // .post('/loginAdvisee', LoginController.loginAdvisee)
  // .post('/loginAdvisor', LoginController.loginAdvisor)
  // .get('/advisingSession/:advisor', AdvisingController.foo)
  // .post('/advisingSession/book', AdvisingController.booasdf)

module.exports = router

