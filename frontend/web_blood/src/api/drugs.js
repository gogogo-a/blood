import http from "../utils/http"
import {reactive, ref} from "vue"


const drugs = reactive({
  count: 0, // 数据总数
  size: 0,  // 每页条数
  drugs_list: [],
  current_page: 1,
  loading: false,
  error: null,
  get_drugs_list(page) {
    return http.get(`/consultation/Drugs/?page=${page}`);
  }
});


export default drugs;
