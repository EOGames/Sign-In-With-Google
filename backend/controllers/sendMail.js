const nodemailer = require("nodemailer");
const { google } = require("googleapis");
// const OAuth2 = google.auth.OAuth2;

const { OAuth2Client } = require('google-auth-library');

const oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.REDIRECT_URI);
const User = require('../model/userDetail');

module.exports.SendMail = async (req, res) =>
{
    console.log('Mail::::::::::::', req.body);

    try {
        const { acessCode, emailId, to, msg, subject } = req.body;

        const foundUser = await User.findOne({ email: emailId });
        
        let accessToken ;
        let refreshToken = foundUser.refreshToken ;

        console.log(' User Found In Sendmail',foundUser);
        console.log('RefreshToken Set From Found User :',refreshToken);

        if (refreshToken === '')
        {
            const { tokens } = await oauth2Client.getToken(acessCode);
            // accessToken = tokens.access_token;
            refreshToken = tokens.refresh_token;           
            foundUser.refreshToken =  tokens.refresh_token;
            console.log('Refresh Token  Not Found Getting New ',refreshToken); 
            await foundUser.save();       
        }

        console.log('Refresh Token Found Using Old Refresh Token ',refreshToken);
        
        // refreshToken = foundUser.refreshToken;

        oauth2Client.setCredentials (

            {
                refresh_token: refreshToken,            
            });   

         accessToken = await oauth2Client.getAccessToken();

        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: "OAuth2",
                user: emailId,
                accessToken,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: refreshToken
            }
        });

        const emailOptions = {
            subject: subject,
            text: msg,
            to: to,
            from: emailId
        }
        let result = await transporter.sendMail(emailOptions);
        console.log(result);
        return res.status(200).json(req.body);
    }

    catch (error) {
        console.log('Sending Mail Error:::::', error);
    }


}