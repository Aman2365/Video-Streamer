import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import { Avatar } from '@mui/material';
// import Button from '@mui/material/Button';
// import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {Button, Radio, Modal } from 'antd';
import { Tags, TagOption } from '@/utils/enum';
import { uploadVideo } from '@/pages/api/video';

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
    const filter: TagOption[]=[
        {value:Tags.FINANCIALS, label: Tags.FINANCIALS},
        {value:Tags.HEALTH, label: Tags.HEALTH},
        {value:Tags.POLITICS, label: Tags.POLITICS},
        {value:Tags.NATURE, label: Tags.NATURE},
    ]
    const [video, setVideo] = useState((props.editVideo)? props.editVideoData.video: "");
    const [cover, setCover] = useState((props.editVideo)? props.editVideoData.coverImage:"");
    const [title, setTitle] = useState(props.editVideoData?.title || "")
    const [filterTag, setFilterTag] = useState(Tags.NATURE)
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
    
    useEffect(()=>{
        if(props.editVideo){
            setOpen(true);
        }
    },[props.editVideo])
    const handleFileChange = (e: any) => {
        const selectedFile = e.target.files[0];
        setVideo(selectedFile);
      };

      const handleCoverChange = (e: any) => {
        const selectedFile = e.target.files[0];
        setCover(selectedFile);
      };

      const showModal = () => {
        setOpen(true);
      };
    
      const handleOk = async () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("video", video);
        formData.append("cover", cover);
        formData.append("tag", filterTag);
        const token = localStorage.getItem('token');
        try{
            const data=await uploadVideo(formData);
            setModalText('Uploading Video');
            setConfirmLoading(true);
            if(data?.status == 201){
                props.updateData(data);
                setTimeout(() => {
                    setOpen(false);
                    setConfirmLoading(false);
                  }, 1000);
            }
            else{
                setTimeout(() => {
                    toast.error('Please Upload video again')
                    setConfirmLoading(false);
                  }, 1000);
            }
            // setOpen(false);
        } catch{

        }

      };
    
      const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
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
                                <Button type="primary" onClick={showModal}>Add New</Button>
                                <Modal
                                    title="Title"
                                    open={open}
                                    onOk={handleOk}
                                    confirmLoading={confirmLoading}
                                    onCancel={handleCancel}
                                >
                                    <div>
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
                                                <div className='flex-row'>
                                                <label>Tags</label>
                                                <Radio.Group onChange={(data)=>setFilterTag(data.target.value)} value={filterTag}>
                                                    <Radio value={Tags.FINANCIALS}>{Tags.FINANCIALS}</Radio>
                                                    <Radio value={Tags.HEALTH}>{Tags.HEALTH}</Radio>
                                                    <Radio value={Tags.NATURE}>{Tags.NATURE}</Radio>
                                                    <Radio value={Tags.POLITICS}>{Tags.POLITICS}</Radio>
                                                </Radio.Group>
                                                </div>
                                            </Box>
                                        </Typography>
                                    </div>
                                </Modal>
                            </div>

                        </>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
}
