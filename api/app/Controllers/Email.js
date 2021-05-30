const dbConnection = require('../../database/mySQLconnect');

// npm install --save @sendgrid/mail OR yarn add @sendgrid/mail
const sgMail = require('@sendgrid/mail');
const key = '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'
sgMail.setApiKey(key);

exports.verify = function(req, res, next){
    dbConnection.User.findOne({hash: req.params.hash})
  .then((user)=>{
    console.log(user)
    if(user && (req.params.hash === user.hash)){
      user.emailValidated = true;
      user.save()
      return res.json({"Status": "successful!"})
    } else{
      return res.json({"Status": "user not found"})
    }
  })
  .catch(err => {
    return next(err)
  })
}

// send varification of appointment request to Advisee
// this is currently set up to send the advisee an email 
// letting them know to confirm their appointment request
exports.sendVerificationAdvisee = function(adviseeEmail, adviseeHash, advisee_fname, advisee_lname){
  return new Promise((resolve, reject) => {
    const msgVerify1 = {
      to: `${adviseeEmail}`,
      from: 'appointmentRequestVerification@noreplyemail.com',
      subject: 'Appointment Request Verification',
      text: `Hello ${advisee_fname} ${advisee_lname} , this email is to acknowledge that you have requested to book an advising appointment.`,
      html: `<p>You have requested an advising appointment.
      Please verify your request by clicking on the link below</p>
      <a href="${link}"> Confirm Request! </a>`
    };
    sgMail.send(msgVerify1);
    console.log(`verification email sent to ${adviseeEmail}`)
    resolve();
  })
}

// send varification of appointment request to Advisor
// this is currently set up to send the advisor an email 
// letting them know to confirm their appointment request
exports.sendVerificationAdvisor = function(advisorEmail, advisorHash, advisor_fname, advisor_lname){
    return new Promise((resolve, reject) => {
      const msgVerify2 = {
        to: `${advisorEmail}`,
        from: 'pendingAppointmentRequest@noreplyemail.com',
        subject: 'Pending Appointment Request',
        text: `Hello ${advisor_fname} ${advisor_lname} , this email is to let you know that you have a pending advising appointment.`,
        html: `<p>An advisee has signed up for an advising appointment.
        Please accept the appointment request submitted by clicking on the link below</p>
        <a href="${link}"> Accept Appointment! </a>`
      };
      sgMail.send(msgVerify2);
      //console.log(`verification email sent to ${advisorEmail}`)
      console.log(`Appointment Accepted!`)
      resolve();
    })
}

exports.sendConfirmationAdvisee = function(adviseeEmail, advisee_fname, advisee_lname){
    return new Promise((resolve, reject) => {
      const msgConfirm1 = {
        to: `${adviseeEmail}`,
        from: 'appointmentConfirmation@noreplyemail.com',
        subject: 'Appointment Confirmation',
        text: `Hello ${advisee_fname} ${advisee_lname} , this email is to confirm that your advising appointment request has been accepted.`      };
      sgMail.send(msgConfirm1);
      resolve();
    })
}

/*exports.sendConfirmationAdvisor = function(advisorEmail, advisor_fname, advisor_lname){
    return new Promise((resolve, reject) => {
      const msgConfirm2 = {
        to: `${advisorEmail}`,
        from: 'appointmentApproved@noreplyemail.com',
        subject: 'Appointment Approved',
        text: `Hello ${advisor_fname} ${advisor_lname} , this email is to confirm that you approved an advising appointment.`
      };
      sgMail.send(msgConfirm2);
      resolve();
    })
  }*/
