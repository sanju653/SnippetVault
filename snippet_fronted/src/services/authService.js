//Think of a React service file as the place where we keep all the code responsible for talking to the Spring Boot backend.
//Contains functions for calling backend APIs
import api from "./api"


export const registerUser=async(userData)=>{
    const response=await api.post("/auth/register",userData);
    return response.data;
}

export const loginUser=async(credentials)=>{
    const response=await api.post("/auth/login",credentials);
    return response.data;
}
export const getRefreshToken=async(refreshToken)=>{
    const response=await api.post("/auth/refresh",{refreshToken});//in  refreshtokenreq we have single varible,refreshToken is a single variable, not an object.The backend expects the token inside an object. Therefore, we write:{ refreshToken },{}Wrap the variable in an object.
    return response.data;
}