const ical =
require("ical-generator").default;

const fs =
require("fs");

const config =
require("./config");


function createCalendar(matches){


    const cal =
    ical({

        name:
        config.calendarName,

        timezone:
        config.timezone

    });



    matches.forEach(match=>{


        const home =
        match.home.includes("Frem");


        const icon =
        home ? "🏠" : "🚌";


        const start =
        parseDbuDate(
            match.date,
            match.time
        );


        cal.createEvent({

    id:
    "frem-" +
    match.id +
    "@calendar",

    start: {
        date: start,
        timezone: config.timezone
    },

    end: {
        date:
        new Date(
            start.getTime() +
            7200000
        ),
        timezone: config.timezone
    },


            summary:
            `${icon} ${match.home} - ${match.away}`,


            location:
            match.stadium,


            description:
`Boldklubben Frem
3. Division

DBU kamp:
${match.id}`,


            alarms:[

                {
                    type:
                    "display",

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



function parseDbuDate(
    date,
    time
){

    const m =
    date.match(
        /(\d{2})-(\d{2})\s(\d{4})/
    );


    if(!m)
        throw new Error(
            "Ukendt dato: " + date
        );


    return new Date(
        `${m[3]}-${m[2]}-${m[1]}T${time}:00`
    );

}


module.exports =
{
    createCalendar
};
