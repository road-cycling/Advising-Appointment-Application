const dbConnection = require('../../database/mySQLconnect');



class Controller {

  constructor () { console.log('Constructor called for Base Class') }

  static getTime(time) { return new Date().getMilliseconds() - time.getMilliseconds() }

  static formatBodySuccess(startTime, tuples) {
  
    return {
      'success': true,
      'timeElapsed': Controller.getTime(startTime),
      'count': tuples.length || 0,
      'data': tuples
    }
  }

  static formatBodyError(startTime, error = {}) {
    return {
      'success': false,
      'timeElapsed': `${Controller.getTime(startTime)}ms`,
      error
    }
  }

  static formatGenericQuery(whereClause, extra = "") {

    let union = whereClause.map((value, idx) => {
      if (idx === whereClause.length - 1)
        return `${value} = ?`
      else if (idx === 0)
        return `WHERE ${value} = ? AND `
      return `${value} = ? AND `
    }).join('')


    return `
      SELECT *
        FROM course_base cb
        INNER JOIN
            course_components cc
            ON cb.class_number = cc.class_number
        LEFT JOIN
            meeting_pattern mp
            ON cc.class_number = mp.class_number
        LEFT JOIN
            course_instructors ci
            ON cc.class_number = ci.class_number
          ${union}
          ${extra}
    `
  }

  genericUnion(ctx) {
    return new Promise((resolve, reject) => {

      let startTime = new Date();

      let { db_table, union } = this

      const query = Controller.formatGenericQuery(union)

      console.log(`Query is >>> ${query} <<< `)

      dbConnection.query({
        sql: query,
        values: union.map(item => ctx.params[item.replace(/^cb.|^cc.|^ci./, "")])
      }, (error, tuples) => {
        if (error) {
          ctx.body = Controller.formatBodyError(startTime)
          ctx.status = 200
          return reject(error)
        }

        ctx.body = Controller.formatBodySuccess(startTime, tuples)
        ctx.status = 200

        return resolve()
      })
    })
  }

  genericAll(ctx) {
    return new Promise((resolve, reject) => {

      let startTime = new Date();

      let { db_table } = this
      let extra = this.extra

      const query = Controller.formatGenericQuery([], extra)

      // const query = `select * from ${db_table} ${extra}`

      console.log(`Query is >>> ${query} <<<`)

      dbConnection.query({
        sql: query
      }, (error, tuples) => {
        // anon functions don't bind this
        if (error) {
          ctx.body = Controller.formatBodyError(startTime)
          ctx.status = 200
          return reject(error)
        }

        ctx.body = Controller.formatBodySuccess(startTime, tuples)
        ctx.status = 200

        return resolve();
      })
    })
  }

  genericUpdatePassQuery(ctx) {
    return new Promise(async (resolve, reject) => {

      let startTime = new Date()

      let { request: { body } } = ctx
      let { query, filler, func } = this

      if ( func != null ) {
        let [ toExecute, key ] = func 
        await toExecute(ctx, key, body[key])
      }

      dbConnection.query({
        sql: query,
        values: filler.map(v => body[v])
      }, (error, results) => {
        if (error) {
          ctx.body = Controller.formatBodyError(startTime)
          return reject()
        }

        let { changedRows } = results 

        if ( changedRows == 1 ) {
          ctx.body = Controller.formatBodySuccess(startTime, {})
        } else {
          ctx.body = Controller.formatBodyError(startTime)
        }
        return resolve()
      })
    })
  }

  genericSelect(ctx) {
    return new Promise(async (resolve, reject) => {

      let startTime = new Date()

      let { request: { body } } = ctx
      let { query, url_param, func } = this

      if ( func != null ) {
        let [ toExecute, key ] = func 
        await toExecute(ctx, key, ctx.params[key])
      }

      dbConnection.query({
        sql: query,
        values: url_param.map(v => ctx.params[v])
      }, (error, results) => {
        if (error) {
          ctx.body = Controller.formatBodyError(startTime)
          return reject()
        }
        ctx.body = Controller.formatBodySuccess(startTime, results)
        return resolve()
      })
    })
  }

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

  // GenericSQL.genericInsert({
//     tableName: 'AdviseeView',
//     argumentNameList: ['student_id', 'first_name', 'last_name', 'h_password', 'email'],
//     values: [ 150000, 'Joe', 'Schmo', 'asdfasdf', 'joeSchmo@yahoo.com' ]
// })
}

module.exports = Controller


