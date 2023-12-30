const express = require('express');

const request = require("request");

const router = express.Router();

const baseUrl = "https://bhaveshnetflix.live/";

let updateFunction = (item, item2) => {
    let options = {
        method: "POST",
        url: baseUrl + "update.php",
        formData: {
          update_query: item,
          select_query: item2,
        },
    };
    return options;
}

router.post("/edit/:tvShowId", 
	async (req, res, next) => {
		const tvShowId = req.params.tvShowId; // Get the TV show ID from the request parameters
        const selectedMovieName = req.body.selectedMovieName;
        const selectedMovieId = req.body.selectedMovieId;
        const type = req.body.selectedMediaType;

        const { episodeId, lang, fileCode, file_Sub_Code }  = req.body;
        
        // console.log(req.body, fileCode, file_Sub_Code);

        if (type === 'tv') {
            const seasonNumber = req.body.seasonNumber[0];

            const combinedData = episodeId.map((idItem, index) => ({
                id: idItem,
                filecode: fileCode[index],
                fileSubCode: file_Sub_Code[index]
            })).filter(item => item.id !== '');

            // console.log(combinedData);

            try {
                // update database
                if (combinedData.length >= 1) {
                    combinedData.forEach(i => {
                        let opt1 = updateFunction(
                            "update videos set filecode = '"
                                .concat(`${i.filecode}`)
                                .concat("', file_sub_code = '")
                                .concat(`${i.fileSubCode}`)
                                .concat("' where video_id = '")
                                .concat(`${i.id}`)
                                .concat("' AND lang = '")
                                .concat(`${lang}`)
                                .concat("'"),
                            "select * from videos where season_id = '"
                                .concat(`${tvShowId}`)
                                .concat("' AND season_number = '")
                                .concat(`${seasonNumber}`)
                                .concat("' AND lang = '")
                                .concat(`${lang}`)
                                .concat("' ORDER BY video_id ASC")
                        );

                        // console.log(opt1);

                        request(opt1, (error, response) => {
                            if (error) throw new Error(error);
                            else {
                                let x = JSON.parse(response.body);

                                // console.log(x);
                            }
                        })
                    })
                }

                return res.redirect("/v1/home");
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Failed to upload file' });
            }
        }

        else if (type === 'collectionMovie') {
            const combinedData = episodeId.map((idItem, index) => ({
                id: idItem,
                filecode: fileCode[index],
                fileSubCode: file_Sub_Code[index]
            })).filter(item => item.id !== '');

            // console.log(combinedData);

            try {
                // update database
                if (combinedData.length >= 1) {
                    combinedData.forEach(i => {
                        let opt1 = updateFunction(
                            "update videos set filecode = '"
                                .concat(`${i.filecode}`)
                                .concat("', file_sub_code = '")
                                .concat(`${i.fileSubCode}`)
                                .concat("' where video_id = '")
                                .concat(`${i.id}`)
                                .concat("' AND lang = '")
                                .concat(`${lang}`)
                                .concat("'"),
                            "select * from videos where season_id = '"
                                .concat(`${tvShowId}`)
                                .concat("' AND season_number = 'null'")
                                .concat(" AND lang = '")
                                .concat(`${lang}`)
                                .concat("' ORDER BY video_id ASC")
                        );

                        // console.log(opt1);

                        request(opt1, (error, response) => {
                            if (error) throw new Error(error);
                            else {
                                let x = JSON.parse(response.body);

                                // console.log(x);
                            }
                        })
                    })
                }

                return res.redirect("/v1/home");
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Failed to upload file' });
            }
        }

        else if (type === 'movie') {
            const combinedData = [{
                id: episodeId,
                filecode: fileCode,
                fileSubCode: file_Sub_Code
            }];

            // console.log(combinedData);

            try {
                // update database
                if (combinedData.length >= 1) {
                    combinedData.forEach(i => {
                        let opt1 = updateFunction(
                            "update videos set filecode = '"
                                .concat(`${i.filecode}`)
                                .concat("', file_sub_code = '")
                                .concat(`${i.fileSubCode}`)
                                .concat("' where video_id = '")
                                .concat(`${i.id}`)
                                .concat("' AND lang = '")
                                .concat(`${lang}`)
                                .concat("'"),
                            "select * from videos where season_id = '"
                                .concat(`${tvShowId}`)
                                .concat("' AND season_number = 'null'")
                                .concat(" AND lang = '")
                                .concat(`${lang}`)
                                .concat("' ORDER BY video_id ASC")
                        );

                        // console.log(opt1);

                        request(opt1, (error, response) => {
                            if (error) throw new Error(error);
                            else {
                                let x = JSON.parse(response.body);

                                // console.log(x);
                            }
                        })
                    })
                }

                return res.redirect("/v1/home");
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Failed to update file' });
            }
        }
})

module.exports = router;