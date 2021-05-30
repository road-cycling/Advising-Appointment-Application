const 
      loginRouter         = require('./routes/login/login_routes.js'),
      defaultRouter       = require('./routes/default/default_routes.js'),
      appRouter           = require('./routes/app_routes/app_routes.js');

const compose = require('koa-compose')

//https://github.com/koajs/koa/blob/master/docs/guide.md#middleware-best-practices

function combineRouters(routers) {

  return () => {
    routers = [...arguments]
    const middleware = []

    routers.forEach(router => {
      let { stack } = router
      stack.forEach(({ methods, path }) => {
        console.log(`${methods.filter(item => item !== 'HEAD')} - http://localhost:8239${path}`)
      })
      middleware.push(router.routes())
      middleware.push(router.allowedMethods())
    })

    return compose(middleware)
  }
}

const router = combineRouters(
  defaultRouter,
  loginRouter,
  appRouter
)

module.exports = function (app) {
    app.use(router());
};


// 
// SELECT *
//   FROM course_base cb
//   INNER JOIN
//       course_components cc
//       ON cb.class_number = cc.class_number
//   LEFT JOIN
//       meeting_pattern mp
//       ON cc.class_number = mp.class_number
//   LEFT JOIN
//       course_instructors ci
//       ON cc.class_number = ci.class_number
//     WHERE cb.term = 2187

// select cb.subject, cb.catalog, cc.section, cb.course_title,
//        cb.units, cc.component, cc.class_number,
//        ci.instructor_fName, ci.instructor_lName
//        FROM course_base cb,
//             course_components cc,
//             course_instructors ci
//        WHERE cb.subject = 'CS' AND
//              cb.catalog = '315' AND
//              cb.class_number = cc.parent_class_number AND
//              cc.class_number = ci.class_number


// select cb.subject, cb.catalog, cc.section, cb.course_title,
//        cb.units, cc.component, cc.class_number,
//        ci.instructor_fName, ci.instructor_lName
//        FROM course_base cb,
//             course_components cc left join
//             course_instructors ci
//             on (cc.class_number = ci.class_number)
//        WHERE cb.subject = 'CS' AND
//              cb.catalog = '315' AND
//              cb.class_number = cc.parent_class_number AND
//              instructor_lName IS NULL;
