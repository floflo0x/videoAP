const express = require('express');

const request = require("request-promise-any");

const router = express.Router();

const baseUrl = "https://mateys.xyz/h4kig_api/connection/";
const tmdbUrl = "https://api.themoviedb.org/3";

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

router.get("/edit/:sid", isAuth, (req, res, next) => {
	const { sid } = req.params;
	const { season } = req.query;
	const { title } = req.query;
	const { type } = req.query;
	const { lang } = req.query;
	// const langArray = [{ lang: `${lang}`, name: }];
	const langArray = [{ lang: `${lang}`, name: lang === 'en' ? 'English' : 'Français' }];

	// console.log(langArray, typeof langArray, lang);

	let url = '';

	// console.log(sid, season, title, type, lang);

	// console.log(req.query, req.params);

	if (type === 'tv') {
		url = `${tmdbUrl}/tv/${sid}/season/${season}?language=en-US`;
	}

	else if (type === 'collection') {
		url = `${tmdbUrl}/collection/${sid}?language=en-US`;
	}

	else {
		url = `${tmdbUrl}/movie/${sid}?language=en-US`;
	}

	// console.log(url);

	const options = {
	  method: 'GET',
	  headers: {
	    accept: 'application/json',
	    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTc3NGEwZDMxOTQzMTg0MmM4YWI4OGVkOTk1YjUxNSIsInN1YiI6IjY0YzUzYTc0Y2FkYjZiMDE0NDBkNTc1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.L-7MHPqHHx0avE_n4Y3kU49FEJ02CsOb54b8Mbp2NCs'
	  }
	};

	try {
		request(url, options)
		  	.then(data => {
			  	// console.log(JSON.parse(data));
			  	const result = JSON.parse(data);

			  	// console.log(result);

					  	let opt1 = selectFunction(
						  	"select * from videos where season_id = '"
						  		.concat(`${sid}`)
						  		.concat("' AND season_number = '")
						  		.concat(`${season}`)
						  		.concat("' AND lang = '")
						  		.concat(`${lang}`)
						  		.concat("' ORDER BY video_id ASC")
						  )

					  	if (result.id && result.hasOwnProperty("episodes")) {
					  		// console.log("seasons");
					  		const episodeName = result.episodes.map(ep => ep.name);
					  		const episodeId = result.episodes.map(ep => ep.id);

					  		// console.log(episodeId, episodeName);

					  		request(opt1, (error, response) => {
							    if (error) throw new Error(error);
							    else {
							    	let x = JSON.parse(response.body);

							    	// console.log(x);

							    	if (x.length >= 1) {
							    		const urlArray = episodeId.map((id, index) => {
											  let matchingData = x.find((item) => item.video_id === id.toString());
											  return {
											    id: id,
											    name: episodeName[index],
											    fileCode: matchingData ? matchingData.filecode : '',
											    file_Sub_Code: matchingData ? matchingData.file_sub_code: '',
											    fileUrl: matchingData ? matchingData.fileUrl: ''
											  };
											});

								    	// console.log(urlArray);
								    	
								    	const sTitle = `${title} Season ${season}`;

								    	return res.render("form3", {
										    editing: true,
										    dataArray: urlArray,
										    season: season,
										    sid: sid,
										    title: sTitle,
										    type: type,
										    langArray: langArray
											});
							    	}

							    	else {
					  					// return res.send("add one?");
					  					return res.render("form4", {
		                    editing: false,
		                    dataArray: [],
		                    season: season,
		                    sid: sid,
		                    title: title,
		                    type: type,
		                    langArray: langArray
		                	});
								  	}
							    }
							  })
					  	}

					  	else if (result.id && result.hasOwnProperty("parts")) {
					  		// console.log("collections");
					  		const episodeId = result.parts.map(ep => ep.id);
					  		const episodeName = result.parts.map(ep => ep.title);
					  		// console.log(episodeId);

					  		request(opt1, (error, response) => {
							    if (error) throw new Error(error);
							    else {
							    	let x = JSON.parse(response.body);

							    	// console.log(x);

							    	if (x.length >= 1) {
							    		const urlArray = episodeId.map((id, index) => {
											  let matchingData = x.find((item) => item.video_id === id.toString());
											  return {
											    id: id,
											    name: episodeName[index],
											    fileCode: matchingData ? matchingData.filecode : '',
											    file_Sub_Code: matchingData ? matchingData.file_sub_code: '',
											    fileUrl: matchingData ? matchingData.fileUrl: ''
											  };
											});

								    	// console.log(urlArray);

								    	return res.render("form3", {
										    editing: true,
										    dataArray: urlArray,
										    season: season,
										    sid: sid,
										    title: title,
										    type: 'collectionMovie',
										    langArray: langArray
											});
								  	}

								  	else {
					  					return res.redirect("/v1/add");
								  	}
							    }
							  })
					  	}

					  	else if (result.id) {
					  		// console.log("movie");
					  		request(opt1, (error, response) => {
							    if (error) throw new Error(error);
							    else {
							    	let x = JSON.parse(response.body);

							    	// console.log(x);
							    	if (x.length >= 1) {
							    		const urlArray = [{
							    			id: x[0].video_id,
							    			name: result.title,
											  fileCode: x[0].filecode,
											  file_Sub_Code: x[0].file_sub_code,
											  fileUrl: x[0].fileUrl
							    		}];
							    		
							    		// console.log(urlArray);

							  			return res.render("form3", {
										    editing: true,
										    dataArray: urlArray,
										    season: season,
										    sid: sid,
										    title: title,
										    type: 'movie',
										    langArray: langArray
											});
							    	}

							    	else {
					  					return res.redirect("/v1/add");
							    	}
							    }
						  	})
					  	}

					  	else {
					  		// console.log("none");
					  		return res.json({
					  			'message': "no data found..."
					  		})
					  	}
				})
				
		  	.catch(err => {
		  		// console.log('error:');
		  		return res.json({
					  "message": "no data found..."
					})
		  	});
	}
	catch(error) {
		// console.log(error);
		return res.json({ 'message': 'error' })
	}
})

module.exports = router;