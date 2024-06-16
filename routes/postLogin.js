const express = require('express');

const { body, validationResult } = require('express-validator');

const request = require("request");

const router = express.Router();

const baseUrl = "https://mateys.xyz/h4kig_api/connection/";

let loginFunction = (item, item2) => {
  let options = {
    method: "POST",
    url: baseUrl2 + "login.php",
    formData: {
      email: item,
      password: item2,
    },
  };
  return options;
};

router.post('/login',
	[
		body('email')
			.trim()
			.notEmpty()
			.withMessage('Email Address required')
			.normalizeEmail()
			.isEmail()
			.withMessage('Invalid email or password'),
		body('password')
			.trim()
			.notEmpty()
			.withMessage('Password required')
			.isLength({min: 8})
			.withMessage('Password must be 8 characters long')
			.matches(/(?=.*?[A-Z])/).withMessage('At least one Uppercase')
  			.matches(/(?=.*?[a-z])/).withMessage('At least one Lowercase')
  			.matches(/(?=.*?[0-9])/).withMessage('At least one Number')
  			.matches(/(?=.*?[#?!@$%^&*-])/).withMessage('At least one special character')
  			.not().matches(/^$|\s+/).withMessage('White space not allowed')
	], 
	async (req, res, next) => {
		try {
			const { email, password } = req.body;

			// console.log(email, password);

			const error = validationResult(req);

			if (!error.isEmpty()) {
				// console.log(error.array());
				return res.render("login", 
			        { 
			            errorMessage: error.array()[0].msg,
			            oldInput: {
			            	email: email,
			            	password: password
			            }
			        }
			    )
			}

			else {
				let opt1 = loginFunction(`${email}`, `${password}`);

				request(opt1, (error, response) => {
          if (error) throw new Error(error);
          else {
            let x = JSON.parse(response.body);

            // console.log(x);

            if (x.isSuccess == false) {
							req.flash('error', 'Invalid email or password...');
              return res.redirect("/");
            } 
            else {
            	res.cookie("email", email);
            	return res.redirect('/v1/home');
            }

            // if (x.length >= 1 && x[0].password != password) {
            //   req.flash('error', 'Invalid email or password');
						// 	return res.redirect('/');						
            // }

            // else if (x.length >= 1 && x[0].role !== 'admin') {
            //   req.flash('error', 'You are not an admin');
						// 	return res.redirect('/');
            // }

            // else if (x.length >= 1 && x[0].password == password && x[0].role === 'admin') {
            // 	return res.redirect('/v1/home');
            // }

            // else {
            //   req.flash('error', 'Invalid email or password');
						// 	return res.redirect('/');
            // }
          }
				})
			}
		}

		catch(error) {
			// console.log(error);
			req.flash('error', 'Invalid email or password');
			return res.redirect('/');
		}
	}
);

module.exports = router;

// router.post('/logout', authController.postLogout);