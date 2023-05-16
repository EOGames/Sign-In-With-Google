import Api from './Api';

export const ChqIfAlreadyAsked = async(email)=>
{
    let response;
    try
    {   
        response = await Api.get(`/userDetails/${email}`);
        return response.data;
    }
     catch (error)
    {
        console.log( 'Error Found While Getting User Details::::',error);
        return(error);
    }
}
