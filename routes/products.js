const express = require('express');

const request = require("request");

const request2 = require("request-promise-any");

const router = express.Router();

const baseUrl = "https://mateys.xyz/h4kig_api/connection/";

const tmdbUrl = 'https://api.themoviedb.org/3';

const isAuth = require('../middleware/is_auth');

let selectFunction = (item) => {
  let options = {
    method: "POST",
    url: baseUrl + "select.php",
    formData: {
      select_query: item,
    },
  };
  return options;
};

router.get("/home", isAuth, (req, res, next) => {
	const { editing } = req.query;
	// console.log(req.query);
	
	let opt1 = selectFunction(
		"select season_id, season_type, lang from videos"
	);

	request(opt1, (error, response) => {
    if (error) throw new Error(error);

    else {
			let x = JSON.parse(response.body);
			const page = parseInt(req.query.page) || 1;
			const itemsPerPage = 10;

			// console.log(x);

			if (x.length >= 1) {
				const uniqueSeasonData = [];
				const uniqueSeasons = new Set();

				let url = '';
				let combinedData = [];

				for (const item of x) {
				  const { season_id, season_type, lang } = item;
				  const uniqueKey = `${season_id}-${season_type}-${lang}`;
				  
				  if (!uniqueSeasons.has(uniqueKey)) {
				    uniqueSeasons.add(uniqueKey);
				    uniqueSeasonData.push(item);
				  }
				}

				// console.log(uniqueSeasonData);

				try {
					const options = {
					  method: 'GET',
					  headers: {
		    			accept: 'application/json',
		    			Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
						}
					};

					Promise.all(uniqueSeasonData.map(i => {
					    id = i.season_id;
					    type = i.season_type;
					    lang = i.lang;

					    // console.log(id, type, lang);

					    if (type === 'tv') {
					        url = `${tmdbUrl}/tv/${id}?language=en-US`;
					    } else if (type === 'collectionMovie') {
					        url = `${tmdbUrl}/collection/${id}?language=en-US`;
					    } else {
					        url = `${tmdbUrl}/movie/${id}?language=en-US`;
					    }

					    return request2(url, options)
					    	.then(data => JSON.parse(data))
					    	.then(result => (
						    	{ 
						    		...result, lang: i.lang
						    	}
						    ));
					})).then(results => {
					    // console.log(results); // Here you have the combined array of all results

							// Calculate pagination-related values
				      const totalCount = results.length;
				      const pageCount = Math.ceil(totalCount / itemsPerPage);

				      // Calculate start and end indices for pagination
				      const startIndex = (page - 1) * itemsPerPage;
				      const endIndex = startIndex + itemsPerPage;

				      // Slice the results array based on pagination
				      const paginatedResults = results.slice(startIndex, endIndex);

				      // console.log(paginatedResults);

					    return res.render("products", {
					    	editing: false,
								data: paginatedResults,
				        currentPage: page,
				        pageCount: pageCount,
								errorMessage: ""
							});
					}).catch(err => console.log('error:', err));
				}

				catch(error) {
					console.log(error);
					return res.render("products", {
					  editing: editing,
						data: [],
						pageCount: 0,
						errorMessage: "No data found..."
					});
				}
			}

			else {
				return res.render("products", {
					editing: editing,
					data: [],
					pageCount: 0,
					errorMessage: ''
				})
			}
		}
	})

})

module.exports = router;