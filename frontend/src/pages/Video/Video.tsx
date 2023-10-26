import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
// import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function VideoList() {
    const router = useRouter();
    const videoId = router.query?.videoId;
    const [videoInfo, setVideoInfo] = useState<any>([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem('token');
                const {data} = await axios.get(`http://localhost:3003/api/v1/video?id=${videoId}`, {
                    headers: ({
                        Authorization: 'Bearer ' + token
                    })
                });
                setVideoInfo(data)
            }catch{
                
            }
        }
        fetchData();
    }, [videoId]);
    return (
<Container>
        <div style={{height: '500px'}}>
            <video autoPlay controls className='width100' style={{height: '100%'}}>
                <source src={`http://localhost:3003/api/v1/video/${videoId}`} type='video/mp4' />
            </video>
        </div>
    <Grid container spacing={2} marginTop={2}>
        <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="primary">
                Created by:{videoInfo.createdBy?.fullname}
            </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="primary">
                Created: {videoInfo.uploadDate}
            </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
            <Typography variant="h5">
                {videoInfo.title}
            </Typography>
        </Grid>
    </Grid>
</Container>
    );
}
