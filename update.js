const dbu =
require("./dbu-parser");

const calendar =
require("./calendar");


async function run(){

    console.log(
        "Henter Frem kampprogram..."
    );


    const matches =
        await dbu.getMatches();


    console.log(
        matches.length +
        " kampe fundet"
    );


    calendar.createCalendar(matches);


    console.log(
        "calendar.ics opdateret"
    );

}


run()
.catch(error => {

    console.error(error);

    process.exit(1);

});
