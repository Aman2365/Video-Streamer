import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { useState } from 'react'
import SignIn from "../components/Auth/SignIn";
import SignUp from "./SignUp";
import Header from "../components/Navbar/Header";
import VideoList from "./Video/VideoList";
import Video from "./Video/Video";
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [isLoggedIn, setLoggedIn ] = useState(false);
  const [data,setData] = useState();
  console.log(isLoggedIn);
  
  return(
    <div>
      <Header updateData={(data)=>setData(data)} isLoggedIn={isLoggedIn}/>
      <SignIn isLoggedIn={(data)=>setLoggedIn(data)}/>
    {/* <Header updateData={(data)=>setData(data)} isLoggedIn={isLoggedIn} />
    <BrowserRouter>
        {isLoggedIn ?
            <Routes>
                <Route path="/video" element={<VideoList data={(data:any)=>setData(data)} setLoggedIn={setLoggedIn}/>}>
                </Route>
                <Route path="/video/:id" element={<Video setLoggedIn={setLoggedIn}/>}>
                </Route>
            </Routes>
            :
            <Routes>
                <Route path="/" element={<SignIn setIsLoggedIn={setLoggedIn} isLoggedIn={isLoggedIn} />}>
                </Route>
                <Route path="/signup" element={<SignUp/>}>
                </Route>
            </Routes>
        }
    </BrowserRouter> */}
</div>
  )
}
