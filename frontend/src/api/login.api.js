import Api from "./Api";

 export const googleLogin = async (key) => {
    let response;
    try {

        response = await Api.post('/loginGoogle',
            {},
            {
                headers:{"Authorization" :`Bearer ${key}`}
            });
        console.log('Login Response: ', response);

        return response.data;

    } 
    catch (error)
    {
        console.log('Login API Encountered An Error:', error);
        return null;
    }

}
