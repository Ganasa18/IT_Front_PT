import { combineReducers } from "redux";
import { categoryReducer } from "./category";
import { globalReducer } from "./global";
import { areaReducer } from "./area";
import { dapartementReducer } from "./departement";
import { userReducer } from "./user";
import { rolesReducer } from "./role";
const reducer = combineReducers({
  areaReducer,
  categoryReducer,
  dapartementReducer,
  globalReducer,
  userReducer,
  rolesReducer,
});
export default reducer;
