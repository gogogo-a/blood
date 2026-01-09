import http from "../utils/http"
import {reactive, ref} from "vue"

const article_detail =reactive({
  article:"",
  get_article_detail(id){
     return http.get(`/consultation/Article_detail/${id}/`);
  }
})
export default article_detail