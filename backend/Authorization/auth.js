

const { OAuth2Client } = require('google-auth-library');

const oath_client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
const jwt = require('jsonwebtoken');


module.exports.ChqTokenHeaderIsValid =  (req,res,next) =>
{
    // console.log('Req::::::::::::: ',req);
    console.log( "auth:::::::::::: ",req);
    if (req.headers.authorization !== undefined)
    {
        const token = req.headers.authorization.split(" ")[1];

        //  console.log('JWT: type', typeof process.env.MY_JWT_PRIVATE_KEY);
        //  console.log('token: type', typeof token);

        const tokenExpired = CheckIfTokenExpired(token,process.env.MY_JWT_PRIVATE_KEY);
        console.log('ChqTokenHeaderIsValid Bool Value is ::::',tokenExpired);

        if (tokenExpired)
        {
            return res.status(401).json(' Token Expired');
        }
        else
        {
            next();
            // return res.status(200).json('Token Is Valid');
        }
    }else
    {
        return res.status(401).json('Error Token Not Provided');
    }
}

module.exports.IsTokenExpired =(req,res) =>
{
    if (req.headers.authorization !== undefined)
    {
        const token = req.headers.authorization.split(" ")[1];
      const tokenExpired =   CheckIfTokenExpired(token,process.env.MY_JWT_PRIVATE_KEY);
        console.log ('Bool ', tokenExpired);
      if (tokenExpired)
      {
        return res.status(401).json('Token Expired Session Time Out!');
      }
      else
      {
        return res.status(200).json('Token Is Still Valid');
      }
    }   
}
// module.exports = IsTokenExpired;


 const CheckIfTokenExpired = (token,secretKey) =>
{
    // console.log('token Type:', typeof token, 'SecretKey Type:',typeof secretKey);
    let bool = false;
    jwt.verify(token,secretKey,(err,res)=>
    {
        if (err)
        {
         console.log('token Expired Called In Auth.js [Function:CheckIfTokenExpired] and ERROR: ',err);
           bool = true;
        }

    });
    return bool;    
}


module.exports.CheckIfValid = async(req, res, next) => {
    console.log('Was Here: 1 In Auth');
    console.log('Req Headers ',req.headers);


    try 
    {
        if (req.headers.authorization !== undefined)
        {
            const token = req.headers.authorization.split(" ")[1];
    
            console.log('TOKEN: ',token);
    
            // console.log("Value :", VerifyGoogleJWT(token));
    
            const value = await VerifyGoogleJWT(token);        
            if (value) 
            {
                // const tokenExpired = CheckIfTokenExpired(token,process.env.GOOGLE_CLIENT_SECRET);
                // console.log('Token Not Expired ',tokenExpired);
    
                // if (!tokenExpired)
                // {
                    // means token is valid and not expired yet
                    // we should create a login session for user
                    
                    next(); 
                // }
                // else
                // {
                //    return res.status(401).json({ status: 401, message: 'Token Expired' });
                // }
                
            }
            else {
               return res.status(401).json({ status: 401, message: 'Not A valid Token Or Expired Token' });
            }
    
    
        } 
        else
        {
           return res.status(401).json({ status: 401, message: 'Unauthorized Acess No Token' });
        }
    } catch (error)
    {
        console.log('ERROR Catched At 49 auth.js: ',error);
    }    
}




const VerifyGoogleJWT = async (Jwt_key) => {
    try {

        const ticket = await oath_client.verifyIdToken({
            idToken: Jwt_key,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (payload)
        {
            // means key is valid
            console.log(payload);
            return true;
        }
        else
        {
            // means key is invalid
            return false;
        }

    } 
    catch (error) 
    {
        console.log('ERROR Catched At 88 in auth.js:', error);
        return false;
    }

}



