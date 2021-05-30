const dbConnection = require('../../../database/mySQLconnect');
const Authorize = require('../../../app/Authorize.js');
const Create = require('../../../app/Controllers/Create');
const Login = require('../../../app/Controllers/Login')
const AdvController = require('../../../app/Controllers/AdvisingController.js')

const AdvisingController = new AdvController()

const CreateController = new Create();
const LoginController = new Login();

const jwt = require('jsonwebtoken')

const appRouter = require('koa-router')({
    prefix: '/v1'
});

appRouter
  .post('/createAdvisor', CreateController.createAdvisor)
  .post('/createAdvisee', CreateController.createAdvisee)
  .post('/loginAdvisee', LoginController.loginAdvisee)
  .post('/loginAdvisor', LoginController.loginAdvisor)


async function middleware(ctx, next) {
  try {
    const value = await jwt.verify(ctx.request.req.headers.authorization.substring(7), "ShittySecretKey")
    return next()
  } catch (e) {
    ctx.throw(500, "Bad Creds Middleware")
  }
}



async function checkBeforeCommit(ctx, key, value) {

  try {
    const result = await jwt.verify(ctx.request.req.headers.authorization.substring(7), "ShittySecretKey")

    if ( result[key] != value ) 
      ctx.throw(500, "Bad Creds")

    // return next()
  } catch (e) {
    ctx.throw(500, "Bad Creds")
  }
}



// Approve Appointment 
appRouter.post('/advisingSession/approve', middleware, AdvisingController.genericUpdatePassQuery.bind({
    query: `UPDATE AdvisingSession SET approved = true WHERE advisor_id = ? AND lookup_key = ?`,
    filler: ['advisor_id', 'lookup_key'],
    func: [checkBeforeCommit, 'advisor_id']
}))

// Book Appointment
appRouter.post('/advisingSession/book', middleware, AdvisingController.genericUpdatePassQuery.bind({
  query: `UPDATE AdvisingSession SET student_id = ?, booked = true WHERE  advisor_id = ? AND lookup_key = ?;`,
  filler: ['student_id', 'advisor_id', 'lookup_key'],
 // func: [checkBeforeCommit, 'student_id']
}))

// Leave Comment
appRouter.put('/advisingSession/comments', middleware, AdvisingController.genericUpdatePassQuery.bind({
  query: `UPDATE AdvisingSession SET comments = ? where advisor_id = ? AND lookup_key = ?`,
  filler: ['comments', 'advisor_id', 'lookup_key'],
  func: [checkBeforeCommit, 'advisor_id']
}))

appRouter.put('advisingSession/missed', AdvisingController.genericUpdatePassQuery.bind({
  query: `UPDATE AdvisingSession SET missed = true where lookup_key = ?`,
  filler: ['lookup_key']
}))


//add time heuristic later
appRouter.get('/advisingSession/pending/:advisor_id', middleware, AdvisingController.genericSelect.bind({
  query: `SELECT * from AdvisingSession left join Advisee on AdvisingSession.student_id = Advisee.student_id WHERE 
  advisor_id = ? AND booked = true AND approved = false`,
  url_param: ['advisor_id'],
  func: [checkBeforeCommit, 'advisor_id']
}))

//Terrible query that needs to search the entire database ugh oh well
appRouter.get('/advisingSession/advisee/:advisor_id', middleware, AdvisingController.genericSelect.bind({
  query: `select DISTINCT a.student_id, first_name, last_name, email from AdvisingSession advs left join Advisee a on a.student_id = advs.student_id where 
  advisor_id = ? AND booked = true;`,
  url_param: ['advisor_id'],
  func: [checkBeforeCommit, 'advisor_id']
}))

appRouter.get('/foo/:id', middleware, AdvisingController.genericSelect.bind({
  query: `SELECT * from Advisor WHERE advisor_id = ?`,
  url_param: ['id']
}))

//upcoming that have been approved
appRouter.get('/advisingSession/upcoming/:advisor_id', middleware, AdvisingController.genericSelect.bind({
  query: `SELECT * from AdvisingSession WHERE advisor_id = ? and booked = true AND approved = true AND start_time > NOW()`,
  url_param: ['advisor_id'],
  func: [checkBeforeCommit, 'advisor_id']
}))

appRouter.get('/advisingSession/student/approved/:student_id', middleware, AdvisingController.genericSelect.bind({
  query: `select * from AdvisingSession where student_id = ? AND approved = true AND start_time > NOW();`,
  url_param: ['student_id']
}))

appRouter.get('/advisingSession/student/pending/:student_id', middleware, AdvisingController.genericSelect.bind({
  query: `select * from AdvisingSession where student_id = ? AND approved = false AND start_time > NOW();`,
  url_param: ['student_id']
}))

//past that have been approved
appRouter.get('/advisingSession/past/:advisor_id', middleware, AdvisingController.genericSelect.bind({
  query: `SELECT * from AdvisingSession WHERE advisor_id = ? and booked = true AND approved = true AND start_time < NOW()`,
  url_param: ['advisor_id'],
  func: [checkBeforeCommit, 'advisor_id']
}))

appRouter.get('/advisingSession/past/data/:id', middleware, AdvisingController.genericSelect.bind({
  query: `select * from AdvisingSession aas left join Advisee aa on aas.student_id = aa.student_id where aas.booked = true AND aas.approved = true AND start_time < NOW();`,
  url_param: ['id']
}))

//get all advisor info for seclect advisor
appRouter.get('/advisee/getAllAdvisors', middleware, AdvisingController.genericSelect.bind({
  query: 'SELECT first_name, last_name, advisor_id from Advisor',
  url_param: []
}))

appRouter
  .post('/createBlock', middleware, CreateController.blockHandler)
  .get('/advisingSession/:advisor', middleware, AdvisingController.advisorSession)

module.exports = appRouter

// localhost:8239/v1/advisingSession/pending/12345

