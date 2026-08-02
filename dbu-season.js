const axios = require("axios");
const cheerio = require("cheerio");

const config =
require("./config");


async function findThreeDivisionTeam(){

    const url =
    `https://www.dbu.dk/resultater/klub/${config.clubId}/hold`;


    const response =
    await axios.get(
        url,
        {
            headers:{
                "User-Agent":
                "Mozilla/5.0"
            }
        }
    );


    const $ =
    cheerio.load(
        response.data
    );


    let result = null;


    $("a").each((i,el)=>{


        const text =
        $(el)
        .text()
        .replace(/\s+/g," ")
        .trim();


        if(
            text.includes(
                config.competitionName
            )
            &&
            text.includes(
                config.clubName
            )
        ){

            result = {

                name:text,

                url:
                $(el).attr("href")

            };

        }

    });


    if(!result){

        throw new Error(
            "Kunne ikke finde 3. Division"
        );

    }


    return result;

}


module.exports =
{
    findThreeDivisionTeam
};
