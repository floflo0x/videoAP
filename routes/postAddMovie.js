const express = require('express');

const request = require('request');

const router = express.Router();

const baseUrl = "https://bhaveshnetflix.live/";

let insertFunction = (item, item2) => {
  let options = {
    method: "POST",
    url: baseUrl + "insert.php",
    formData: {
      insert_query: item,
      select_query: item2,
    },
  };
  return options;
};

router.post('/upload',
    async (req, res, next) => {
        // console.log(req.body);

        const type = req.body.selectedMediaType;

        const lang = req.body.lang;

        // console.log(type);

        if (type === 'tv') {
            const seasonId = req.body.selectedMovieId;

            const seasonNumber = req.body.seasonNumber[0];

            const episodeId = req.body.episodeId;

            const filecode = req.body.fileCode;

            const fileSubCode = req.body.file_Sub_Code;

            const combinedData = filecode.map((val, index) => {
                return {
                    id: episodeId[index],
                    filecode: filecode[index],
                    fileSubCode: fileSubCode[index]
                };
            });

            // console.log(combinedData);

            try {
                if (combinedData.length >= 1) {
                    combinedData.forEach(i => {

                        let values1 = `\'${seasonId}\', '${seasonNumber}\', '${type}\', '${lang}\', '${i.id}\', '${i.filecode}\', '${i.fileSubCode}\'`;

                        // console.log(values1);

                        let opt1 = insertFunction(
                            "insert into videos (season_id, season_number, season_type, lang, video_id, filecode, file_sub_code) values("
                                .concat(`${values1}`)
                                .concat(")"),
                            "select * from videos"
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
                else {
                    return res.json({
                        isSuccess: false
                    })
                }
            }

            catch(error) {
                console.log(error);
                return res.json({
                    isSuccess: false
                })
            }

            return res.redirect("/v1/home");           
        }

        else if (type === 'movie') {
            // console.log(type);
            const selectedMovieName = req.body.selectedMovieName;
            const selectedMovieId = req.body.selectedMovieId;

            const movieId = req.body.movieId;
            const movieName = req.body.movieName;
            const filecode = req.body.fileCode;
            const fileSubCode = req.body.file_Sub_Code;

            // console.log(typeof movieId, typeof movieName);

            if (typeof movieId === 'object' 
                && typeof movieName === 'object'
            ) {
                const combinedData = filecode.map((val, index) => {
                    return {
                        id: movieId[index],
                        filecode: filecode[index],
                        fileSubCode: fileSubCode[index]
                    };
                });

                // console.log(combinedData);

                combinedData.forEach(i => {

                    let values1 = `\'${selectedMovieId}\', 'null\', 'collectionMovie\', '${lang}\', '${i.id}\', '${i.filecode}\', '${i.fileSubCode}\'`;

                    // console.log(values1);

                    let opt1 = insertFunction(
                        "insert into videos (season_id, season_number, season_type, lang, video_id, filecode, file_sub_code) values("
                            .concat(`${values1}`)
                            .concat(")"),
                        "select * from videos"
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

            else {
                let values1 = `\'${movieId}\', 'null\', '${type}\', '${lang}\', '${movieId}\', '${filecode}\', '${fileSubCode}\'`;

                // console.log(values1);

                let opt1 = insertFunction(
                    "insert into videos (season_id, season_number, season_type, lang, video_id, filecode, file_sub_code) values("                   
                        .concat(`${values1}`)
                        .concat(")"),
                    "select * from videos"
                );

                request(opt1, (error, response) => {
                    if (error) throw new Error(error);
                    else {
                        let x = JSON.parse(response.body);
                        // console.log(x);
                    }
                })
            }

            return res.redirect("/v1/home");           
        }
});

module.exports = router;