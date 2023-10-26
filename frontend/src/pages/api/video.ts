import axios, { AxiosError } from "axios";
import { handleAPIError } from "@/utils/function/function";

export async function fetchVideo(filterTag: string | null) {
    const token = localStorage.getItem('token');
    try {
        const {data} = await axios.get(`http://localhost:3003/api/v1/video?tag=${filterTag}`, {
            headers: ({
                Authorization: 'Bearer ' + token
            })
        });
        return data;
    } catch(e:any) {
        handleAPIError(e.response.data);
        return {success: false};
    }
}

export async function deleteVideo(id: string) {
    const token = localStorage.getItem('token');
    try {
        const {data} = await axios.delete(`http://localhost:3003/api/v1/video/${id}`, {
            headers: ({
                Authorization: 'Bearer ' + token
            })
        });
        return data;
    } catch(e:any) {
        handleAPIError(e.response.data);
    }
}

export async function signUp(form: any) {
    const token = localStorage.getItem('token');
    try {
        const {data} = await axios.post("http://localhost:3003/api/v1/user/signup", form);
        return data;
    } catch(e:any) {
        handleAPIError(e.response.data);
    }
}

export async function signIn(form: any) {
    const token = localStorage.getItem('token');
    try {
        const {data} = await axios.post("http://localhost:3003/api/v1/user/signin", form);
        return data;
    } catch(e:any) {
        handleAPIError(e.response.data);
    }
}

export async function uploadVideo(formData: FormData){
    const token = localStorage.getItem('token');
    try{
        const data=await axios.post("http://localhost:3003/api/v1/video", formData, {
            headers: ({
                Authorization: 'Bearer ' + token
            })
        });
        return data;
    } catch(e: any){
        handleAPIError(e.response.data);
    }
}