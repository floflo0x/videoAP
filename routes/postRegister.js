const express = require('express');

const router = express.Router();

const { body, validationResult } = require('express-validator');

const request = require("request");

const baseUrl = "https://mateys.xyz/h4kig_api/connection/";

let registerFunction = (item1, item2, item3, item4) => {
  let options = {
    method: "POST",
    url: baseUrl + "register.php",
    formData: {
        email: item1,
	    password: item2,
	    name: item3,
	    remember_token: item4
    },
  };
  return options;
};

router.post(  "/register",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email Address required")
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid email"),
    body("name").trim().notEmpty().withMessage("Name required"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password required")
      .isLength({ min: 8 })
      .withMessage("Password must be 8 characters long")
      .matches(/(?=.*?[A-Z])/)
      .withMessage("At least one Uppercase")
      .matches(/(?=.*?[a-z])/)
      .withMessage("At least one Lowercase")
      .matches(/(?=.*?[0-9])/)
      .withMessage("At least one Number")
      .matches(/(?=.*?[#?!@$%^&*-])/)
      .withMessage("At least one special character")
      .not()
      .matches(/^$|\s+/)
      .withMessage("White space not allowed"),
    body("cpassword")
      .notEmpty()
      .withMessage("Confirm password is required")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
  ],
  async (req, res, next) => {
    const { email, password, cpassword, name, phone } = req.body;

    // console.log(req.body);
    
    try {

		const error = validationResult(req);

      	if (!error.isEmpty()) {
				// console.log(error.array());
				let msg1 = error.array()[0].msg;

				if (msg1 == 'Email Address required' && req.session.lang == 'fr') {
					msg1 = "Adresse mail: (requis";
				}
				else if (msg1 == 'Invalid email' && req.session.lang == 'fr') {
					msg1 = "Email invalide";
				}
				else if (msg1 == 'Name required' && req.session.lang == 'fr') {
					msg1 = "Nom (obligatoire";
				}
				else if (msg1 == 'Password required' && req.session.lang == 'fr') {
					msg1 = "Mot de passe requis";
				}
				else if (msg1 == 'Password must be 8 characters long' && req.session.lang == 'fr') {
					msg1 = "Le mot de passe doit comporter 8 caractères";
				}
				else if (msg1 == 'Password must have at least one Uppercase' && req.session.lang == 'fr') {
					msg1 = "Le mot de passe doit contenir au moins une majuscule";
				}
				else if (msg1 == 'Password must have at least one Lowercase' && req.session.lang == 'fr') {
					msg1 = "Le mot de passe doit avoir au moins une minuscule";
				}
				else if (msg1 == 'Password must have at least one Number' && req.session.lang == 'fr') {
					msg1 = "Le mot de passe doit avoir au moins un numéro";
				}
				else if (msg1 == 'Password must have at least one special character' && req.session.lang == 'fr') {
					msg1 = "Le mot de passe doit contenir au moins un caractère spécial";
				}
				else if (msg1 == 'White space not allowed' && req.session.lang == 'fr') {
					msg1 = "Espace blanc non autorisé";
				}
				else if (msg1 == 'Confirm password is required' && req.session.lang == 'fr') {
					msg1 = "Confirmer que le mot de passe est requis";
				}
				else {
					msg1 = error.array()[0].msg;
				}

				return res.render("register", 
			    { 
					title: 'Register',
			      	errorMessage: msg1,
			      	oldInput: {
			      		email: email,
			      		name: name
			      	}
			    }
			  );
		}

		else {
			let opt1 = registerFunction(
				`${email}`,
				`${password}`,
				`${name}`,
				'12345'
			);

			request(opt1, (error, response) => {
	      if (error) throw new Error(error);
	      else {
	        let x = JSON.parse(response.body);

	        // console.log(x);

	      	if (x.isSuccess == false) {
						req.flash('error', 'Email already exists...');
						return res.redirect('/v1/register');
					}

					else {
            res.cookie("email", email);
						return res.redirect("/v1/home");
					}
	      }
	    })
		}
	}

	catch (error) {
		console.log(error);
		return res.redirect('/v1/register');
	}
})

module.exports = router;