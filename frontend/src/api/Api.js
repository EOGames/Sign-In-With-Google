import axios from "axios";
const backendLink = process.env.REACT_APP_BACKEND_LINK; 

const Api = axios.create(
    {
      baseURL: `${backendLink}/api`,
    }
  );
export default Api;