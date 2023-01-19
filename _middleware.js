import authSlice from "features/authSlice";
import { useRouter } from "next/router";
import { NextResponse } from "next/server";

const Middleware = (req) => {
    // const {user} = useSelector((state) => state.auth)
    // let url = req.url
    // const router = useRouter()

    // if(localStorage.getItem("user") === undefined){
    //     return router.push('/login')
    // }
    console.log('TEST')
}

export default Middleware