import axios from "axios";

export default axios.create({
   baseURL: `https://localhost:5001/api/`
  // baseURL: `http://localhost:59293/api`
  // baseURL: `http://newmms.core200.com/api`
});
