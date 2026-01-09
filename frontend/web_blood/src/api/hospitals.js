import http from "../utils/http"
import {reactive, ref} from "vue"


const hospitals = reactive({
  count: 0, // 数据总数
  size: 0,  // 每页条数
  hospitals_list: [],
  current_page: 1,
  loading: false,
  error: null,
  get_hospitals_list(page) {
    return http.get(`/consultation/Hospital/?page=${page}`);
  }
});


export default hospitals;
