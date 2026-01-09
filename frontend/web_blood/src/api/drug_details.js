import http from "../utils/http"
import {reactive, ref} from "vue"

const drug_detail =reactive({
  drug:"",
  get_drug_detail(id){
     return http.get(`/consultation/Drug_detail/${id}/`);
  }
})
export default drug_detail