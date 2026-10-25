const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: process.env.AWS_REGION });

const jsonResponse = (statusCode, payload) => ({
    statusCode,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(payload),
});

const parsePayload = (event) => {
    if (!event) {
        return {};
    }

    if (event.body == null) {
        return typeof event.message === "string" ? event : {};
    }

    let body = event.body;
    if (event.isBase64Encoded && typeof body === "string") {
        body = Buffer.from(body, "base64").toString("utf8");
    }

    if (typeof body === "object") {
        return body;
    }

    if (typeof body !== "string" || body.trim() === "") {
        return {};
    }

    return JSON.parse(body);
};

exports.handler = async (event) => {
    let payload;
    try {
        payload = parsePayload(event);
    } catch (error) {
        return jsonResponse(400, { error: "Invalid JSON payload" });
    }

    const payloadMessage = typeof payload.message === "string" ? payload.message.trim() : "";
    const message = payloadMessage || "New Visit";

    const params = {
        Destination: { ToAddresses: ["c.darioalmonte@gmail.com"] },
        Message: {
            Body: { Text: { Data: message } },
            Subject: { Data: "New visit" },
        },
        Source: process.env.SENDER_EMAIL,
    };

    try {
        await ses.sendEmail(params).promise();
        return jsonResponse(200, { message: "Email sent successfully" });
    } catch (error) {
        console.error(error);
        return jsonResponse(500, {
            error: "Failed to send email",
            details: error.message,
        });
    }
};
