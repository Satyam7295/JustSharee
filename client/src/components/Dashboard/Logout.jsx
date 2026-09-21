import { useDispatch } from "react-redux";
import {  logoutUser } from "../../redux/slice/auth/authSlice";
import { useEffect } from "react";


const logout = () => {

    const dispatch = useDispatch();
    
    useEffect(()=>{
        const logoutUserFromStorage = async () => {
            await dispatch(logoutUser());
            window.location.href = "/login";
        }
        logoutUserFromStorage();

    },[dispatch])

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-gray-400 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Logging out...</p>
          </div>
        </div>
    )

}

export default logout;