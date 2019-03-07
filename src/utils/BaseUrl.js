import axios from "axios";

export default axios.create({
  baseURL: `http://localhost:56996/api`
});
