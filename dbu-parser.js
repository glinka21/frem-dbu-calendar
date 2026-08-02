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


    const url =
    config.dbuUrl;


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


        const kampIndex =
cells.findIndex(
    c => /^\d{6}$/.test(c)
);


const datoIndex =
cells.findIndex(
    c => /\d{2}-\d{2}/.test(c)
);


if(
    kampIndex === -1 ||
    datoIndex === -1
){
    return;
}


const id =
cells[kampIndex];


const date =
cells[datoIndex];


const time =
cells[datoIndex + 1];


const home =
cells[datoIndex + 2];


const away =
cells[datoIndex + 3];


const stadium =
cells[datoIndex + 4];


matches.push({

    id,

    date,

    time,

    home,

    away,

    stadium:
    stadium ||
    config.homeGround

});


    });


    return matches;

}


module.exports =
{
    getMatches
};
