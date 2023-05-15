import Api from './Api';

 export const SendMail = async (acessCode,emailId,to,msg,subject)=>
{
    const response =  await Api.post('/sendMail',{
        acessCode:acessCode,
        emailId:emailId,
        to:to,
        msg:msg,
        subject:subject
    });

    return response;
}