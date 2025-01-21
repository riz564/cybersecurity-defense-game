var twilio = require('twilio');
var client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.handler = async function(event, context) {
    const body = JSON.parse(event.body);
    const phoneNumber = body.phoneNumber;

    try {
        await client.verify.services(process.env.TWILIO_SERVICE_ID)
            .verifications.create({to: phoneNumber, channel: 'sms'});
        
        return {
            statusCode: 200,
            body: JSON.stringify({ status: 'success' })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ status: 'error', message: err.message })
        };
    }
};
