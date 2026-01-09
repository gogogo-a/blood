import http from "../utils/http"
import {reactive, ref} from "vue"


const articles = reactive({
  count: 0, // 数据总数
  size: 0,  // 每页条数
  articles_list: [],
  current_page: 1,
  loading: false,
  error: null,
  get_articles_list(page) {
    return http.get(`/consultation/Article/?page=${page}`);
  }
});


export default articles;
