const axios = require("axios");
const cheerio = require("cheerio");

const config =
require("./config");

const season =
require("./dbu-season");


function cleanText(text){

    return text
        .replace(/\s+/g," ")
        .trim();

}



async function getMatches(){


    const team =
        await season.findThreeDivisionTeam();


    const url =
        "https://www.dbu.dk" +
        team.url +
        "/kampprogram";


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


    const matches=[];


    $("table tbody tr")
    .each((i,row)=>{


        const cells =
        $(row)
        .find("td")
        .map(
            (i,e)=>
            cleanText(
                $(e).text()
            )
        )
        .get();


        if(cells.length < 5)
            return;


        const text =
            cells.join(" ");


        if(
            !text.includes("Frem")
        )
            return;


        matches.push({

            id:
            cells[0],

            date:
            cells[1],

            time:
            cells[2],

            home:
            cells[3],

            away:
            cells[4],

            stadium:
            cells[5] ||
            config.homeGround

        });


    });


    return matches;

}


module.exports =
{
    getMatches
};
