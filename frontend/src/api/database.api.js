import Api from '../api/Api';

export const GetDatabase = async (pageNum, limit, serchValue,activeJwt) => {
     console.log('JWT type ',typeof activeJwt, ' and JWT ',activeJwt);
     try {

          let response = '';
          if (serchValue.length > 0 && serchValue.trim().length > 0)
          {

               response = await Api.get(`/database/${0}/${limit}/${serchValue}`,
             
               {
                    headers:{"Authorization" :`Bearer ${activeJwt}`}
               });
          }
          else 
          {
               response = await Api.get(`/database/${pageNum}/${limit}/null`,
             
               {
                    headers:{"Authorization" :`Bearer ${activeJwt}`}
               });
          }
          return response;

     }
     catch (error) {
          // console.log('Error Is ', error);

          
          return  {status: error.response.status, error: error}; 
     };
}

