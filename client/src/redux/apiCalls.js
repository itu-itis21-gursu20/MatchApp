import axios from "axios";
import { loginFailure, loginStart, loginSuccess, logout } from "./userRedux";
import { publicRequest } from "../requestMethods";

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    // const res = await axios.post("/auth/login", user);
    const res = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
};

export const logOut = async (dispatch) => {
    dispatch(logout());
}

// export const setAccountOwner = async (dispatch, info) => {
//   dispatch(setaccountowner(info));
// }

