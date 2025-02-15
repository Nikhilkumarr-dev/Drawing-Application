import axios from "axios"
import { backend_url } from "../config"
import ChatRoom from "../../../app/components/ChatRoom";

async function getRoomId(slug:string){
    const response = axios.get(`${backend_url}/room/${slug}`)
    //@ts-ignore
    return response.data.id;
}

export default async function ChatRoom1({
    params
}:{
    params:{
        slug:string
    }
}){
    const slug=await params.slug;
    const roomId=await getRoomId(slug);
    return <ChatRoom id={roomId}></ChatRoom>
}
