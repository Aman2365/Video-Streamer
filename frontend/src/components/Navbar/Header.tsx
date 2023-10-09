import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import { Avatar } from '@mui/material';
// import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import {Button, message, Upload } from 'antd';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

interface HeaderProps{
    isLoggedIn: any,
    updateData: (data: any) =>void
    editVideo: boolean,
    editVideoData: any
}

export default function SearchAppBar(props: HeaderProps) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [video, setVideo] = useState((props.editVideo)? props.editVideoData.video: "");
    const [cover, setCover] = useState((props.editVideo)? props.editVideoData.coverImage:"");
    const [title, setTitle] = useState(props.editVideoData?.title || "")
    useEffect(()=>{
        if(props.editVideo){
            setOpen(true);
            console.log('handle');
        }
    },[props.editVideo])
    console.log(props.editVideoData,'title',title);
    
    const submitForm = async (e: any) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("video", video);
        formData.append("cover", cover);
        const token = localStorage.getItem('token');
        try{
            const data=await axios.post("http://localhost:3003/api/v1/video", formData, {
                headers: ({
                    Authorization: 'Bearer ' + token
                })
            })
            setOpen(false);
            props.updateData(data);
        }
        catch{
            toast.error('Phirse upload karo');
        }
    }
    const handleFileChange = (e: any) => {
        const selectedFile = e.target.files[0];
        setVideo(selectedFile);
      };

      const handleCoverChange = (e: any) => {
        const selectedFile = e.target.files[0];
        setCover(selectedFile);
      };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        Streamly
                    </Typography>
                    {props.isLoggedIn &&
                        <>
                            <Search>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </Search>
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            </Avatar>
                            <div>
                                <Button onClick={handleOpen}>Add New</Button>
                                <Modal
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={style}>
                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                            <Box component="form" noValidate sx={{ mt: 1 }}>
                                                <label>Video Title:</label>
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    id="title"
                                                    name="title"
                                                    value={title}
                                                    autoFocus
                                                    onChange={(e) => setTitle(e.target.value)}
                                                />
                                                <label>Select Video:</label>
                                                {/* <Upload {...prop}>
                                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                                </Upload> */}
                                                <input type='file' accept='video/*' onChange={handleFileChange}/>
                                                <label>Select Cover Image:</label>
                                                <TextField
                                                    autoFocus
                                                    margin="normal"
                                                    required
                                                            fullWidth
                                                                   name="coverImage"
                                                    type="file"
                                                    id="coverImage"
                                                    onChange={handleCoverChange}
                                                />
                                                <Button
                                                onClick={submitForm}
                                                >
                                                    Upload
                                                </Button>
                                            </Box>
                                        </Typography>
                                    </Box>
                                </Modal>
                            </div>

                        </>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
}
