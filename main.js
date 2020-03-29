const Discord = require("discord.io");
const logger = require("winston");
const request = require("request");

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
    colorize: true
});
logger.level = "debug";

let bot_token;

// Checks if there's an environmental variable configured.
// Super hack shit I know D:
if (process.env.BOT_TOKEN) {
    bot_token = process.env.BOT_TOKEN;
} else {
    bot_token = require("./auth.json").token;
}

// Initialize Discord Bot
// Docs: https://izy521.gitbooks.io/discord-io/content/Methods/Client.html
var bot = new Discord.Client({
    // token: process.env.BOT_TOKEN,
    // token: auth.token,
    token: bot_token,
    autorun: true
});

// TODO: A universal get cases function
function getPACases(user, userID, channelID, message, evt) {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    let timestring =
        month +
        "-" +
        date +
        "-" +
        year +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;

    request(
        "https://covidtracking.com/api/states",
        { json: true },
        (err, res, body) => {
            if (err) {
                return logger.error(err);
            } else {
                // logger.info(body[38]);
                var data = body[38];
                bot.sendMessage({
                    to: channelID,
                    message:
                        `...\n` +
                        `As of ${timestring} there are **${data.positive}** positive COVID19 cases in **${data.state}**.` +
                        ` **${data.totalTestResults}** tests have been performed.`
                });
            }
        }
    );
}

function getUSCases(user, userID, channelID, message, evt) {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    let timestring =
        month +
        "-" +
        date +
        "-" +
        year +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;

    request(
        "https://covidtracking.com/api/us",
        { json: true },
        (err, res, body) => {
            if (err) {
                return logger.error(err);
            } else {
                // logger.info(body);
                var data = body[0];
                bot.sendMessage({
                    to: channelID,
                    message:
                        `...\n` +
                        `As of ${timestring} there are **${data.positive}** positive COVID19 cases in the US.` +
                        ` **${data.totalTestResults}** tests have been performed.`
                });
            }
        }
    );
}

bot.on("ready", function(evt) {
    logger.info("Connected");
    logger.info("Logged in as: ");
    logger.info(bot.username + " - (" + bot.id + ")");
});

bot.on("message", function(user, userID, channelID, message, evt) {
    if (user == "CoronaBot") {
        return;
    }

    if (message.substring(0, 1) == "!") {
        var args = message.substring(1).split(" ");
        var cmd = args[0];

        logger.info(args[0]);

        args = args.splice(1);

        // TODO: make it work for every state.
        // TODO: Center county cases
        switch (cmd) {
            // !ping
            case "commands":
                bot.sendMessage({
                    to: channelID,
                    message:
                        "Here are the commands:\n" +
                        "**!ping**:     pong\n" +
                        "**!cases**:    Get the number of Covid19 cases in the USA"
                });
                break;

            case "ping":
                bot.sendMessage({
                    to: channelID,
                    message: "Pong!"
                });
                break;

            case "cases":
                getUSCases(user, userID, channelID, message, evt);
                break;

            case "PA":
                getPACases(user, userID, channelID, message, evt);
                break;

            case "pa":
                getPACases(user, userID, channelID, message, evt);
                break;
        }
    }
});
