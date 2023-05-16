import Api from './Api';

export const genrateRefreshToken = async (email,acessCode)=>
{
    try
    {
        let response = await Api.post(`/genrateRefreshToken`,
        {
            email:email,
            acessCode:acessCode
        });

        return response;
    }
    catch(error)
    {
        console.log(' Got Error While Genrating RefreshToken::::: ',error);
        return error;
    }
}
