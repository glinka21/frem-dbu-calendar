const ical = require("ical-generator").default;
const fs = require("fs");

const config = require("./config");


function createCalendar(matches) {

    const cal = ical({

        name: config.calendarName,

        timezone: config.timezone,

        prodId: {
            company: "Boldklubben Frem",
            product: "DBU Calendar"
        }

    });


    matches.forEach(match => {


        const isHome =
            match.home.includes("Frem");


        const icon =
            isHome ? "🏠" : "🚌";


        const start =
            parseDbuDate(
                match.date,
                match.time
            );


        const end =
            new Date(
                start.getTime()
                +
                2 * 60 * 60 * 1000
            );


        cal.createEvent({

            id:
                "frem-" +
                match.id +
                "@calendar",


            start,

            end,


            summary:
                `${icon} ${match.home} - ${match.away}`,


            location:
                match.stadium ||
                config.homeGround,


            description:
`Boldklubben Frem
3. Division

DBU kamp:
${match.id}

Kilde:
DBU.dk`,


            alarms: [

                {
                    type: "display",

                    trigger:
                        86400
                }

            ]

        });


    });


    fs.writeFileSync(
        "calendar.ics",
        cal.toString()
    );

}



function parseDbuDate(date, time) {


    /*
       DBU-format:
       lør.02-08 2025
       14:00

       Vi finder kun dato-delen,
       så små ændringer i DBU-teksten
       ikke ødelægger parseren.
    */


    const match =
        date.match(
            /(\d{2})-(\d{2})\s(\d{4})/
        );


    if (!match) {

        throw new Error(
            "Ukendt dato: " + date
        );

    }


    const [
        ,
        day,
        month,
        year
    ] = match;


    return new Date(
        `${year}-${month}-${day}T${time}:00`
    );

}



module.exports = {

    createCalendar

};
