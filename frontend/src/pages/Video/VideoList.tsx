import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Navbar/Header'
import router from 'next/router';
import toast from 'react-hot-toast';
import { deleteVideo, fetchVideo } from '../api/video';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { Tags, TagOption } from '@/utils/enum';

interface VideoListProps{
    setLoggedIn: any,
    data: any
}

export default function VideoList(props: VideoListProps) {
    const filter: TagOption[]=[
        {value:Tags.FINANCIALS, label: Tags.FINANCIALS},
        {value:Tags.HEALTH, label: Tags.HEALTH},
        {value:Tags.POLITICS, label: Tags.POLITICS},
        {value:Tags.NATURE, label: Tags.NATURE},
    ]
    const [videos, setVideos] = useState([])
    const [uploadData, setUploadData] = useState();
    const [editVideo, setEditVideo] = useState<boolean>(false);
    const [editVideoData, setEditVideoData] = useState();
    const [filterTag, setFilterTag] = useState<Tags | ''>();
    // const navigate = useNavigate();
    async function fetchData() {
            const data = await fetchVideo(filterTag || '');
            setVideos(data)
    }
    useEffect(() => {
        fetchData();
    }, [props.setLoggedIn,props.data,uploadData,filterTag]);

    async function DeleteVideo(id :string){
        try{
            const data = await deleteVideo(id);
            if(!!data){
                fetchData();
                toast.success('Video is deleted');
            }
        }
        catch{
            toast.error('please try again');
        }
    }
    function EditVideoData(data: any){
        setEditVideo(true);
        setEditVideoData(data);
    }
    return (
        <Container>
            <Header
            editVideo={editVideo}
            editVideoData={editVideoData}
            updateData={(data)=>setUploadData(data)}
            isLoggedIn={true}/>
            <div className='flex-row align-item' style={{margin: '33px 0 0 0'}}>
            <p style={{marginRight: '5px'}}>Filter by:-</p>
            <Select
            options={filter}
            style={{width: '100px'}}
            onChange={(data)=>setFilterTag(data)}
            value={filterTag}
            allowClear
            placeholder = 'Topic' />
            </div>
            <div className='flex-row' style={{marginTop: '10px', flexWrap: 'wrap'}}>
                    {videos && videos?.map((video: any,index) => {
                        return <div style={{margin: '10px 20px'}}>
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
                    })}
            </div>
        </Container >
    );
}

