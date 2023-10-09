import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Navbar/Header'
import router from 'next/router';
import toast from 'react-hot-toast';
import Head from 'next/head';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface VideoListProps{
    setLoggedIn: any,
    data: any
}

export default function VideoList(props: VideoListProps) {
    const [videos, setVideos] = useState([])
    const [uploadData, setUploadData] = useState();
    const [editVideo, setEditVideo] = useState<boolean>(false);
    const [editVideoData, setEditVideoData] = useState();
    // const navigate = useNavigate();
    async function fetchData() {
        try {
            const token = localStorage.getItem('token');
            const {data} = await axios.get('http://localhost:3003/api/v1/video', {
                headers: ({
                    Authorization: 'Bearer ' + token
                })
            });
            setVideos(data)
            toast.success('Ye lo tumhari Videos');
        } catch {
            router.push('/')
            toast.error('please login again');
        }
    }
    useEffect(() => {
        fetchData();
    }, [props.setLoggedIn,props.data,uploadData]);

    async function DeleteVideo(id :string){
        try{
            const token = localStorage.getItem('token');
            const {data} = await axios.delete(`http://localhost:3003/api/v1/video/${id}`,{
                headers: ({
                    Authorization: 'Bearer ' + token
                })
            })
            fetchData()
        }
        catch{
            toast.error('video delete nhi ho paayi');
        }
    }
    function EditVideoData(data: any){
        setEditVideo(true);
        setEditVideoData(data);
        console.log(data,'edit');
        
    }
    return (
        <Container>
            <Header
            editVideo={editVideo}
            editVideoData={editVideoData}
            updateData={data=>setUploadData(data)}
            isLoggedIn={true}/>
            <Grid container spacing={2} marginTop={2}>
                    {videos.map((video: any) => {
                        return <Grid item xs={12} md={4} key={video._id}>
                            <div>
                                <div className='flex-column box-shadow' style={{padding: "10px"}}>
                                    <div className='flex-row justify-space-between-baseline'>
                                        <div onClick={()=>router.push("/Video/Video?videoId="+video._id)} className='flex-column'>
                                        <h2 className='margin-unset margin-bottom-5px' style={{marginBottom: '12px'}}>
                                            <Link href={"/Video/Video?videoId="+video._id} style={{ textDecoration: "none", color: "black" }}>{video.title}</Link>
                                        </h2>
                                        <p className='margin-unset margin-bottom-5px'>
                                            {video.uploadDate}
                                        </p>
                                        <p className='margin-unset margin-bottom-5px'>
                                            Uploaded By: {video.createdBy?.fullname}
                                        </p>
                                        </div>
                                        <DeleteOutlined onClick={()=>DeleteVideo(video._id)}/>
                                        {/* <EditOutlined onClick={()=>EditVideoData(video)}/> */}
                                    </div>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
                                        image={`http://127.0.0.1:3003/${video.coverImage}`}
                                        alt="alt"
                                    />
                                </div>
                            </div>
                        </Grid>
                    })}
            </Grid>
        </Container >
    );
}

