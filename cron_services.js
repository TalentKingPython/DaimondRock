const CronJob = require("node-cron");

const initCronJobFunction = CronJob.schedule("*/10 * * * * *", async () => {
    console.log("I'm executed on a schedule!", new Date().toLocaleString());
    
    try {
    } catch (err) { console.error(err) }
}, {
    scheduled: false,
});

exports.cronJobsInit = () => {
    initCronJobFunction.start();
}