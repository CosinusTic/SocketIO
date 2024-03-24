import * as React from 'react';
import Drawer from '@mui/joy/Drawer';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ModalClose from '@mui/joy/ModalClose';
import Menu from '@mui/icons-material/Menu';
import { IconButton } from "@mui/joy";
import {useEffect, useState} from "react";
import "../style/Sidebar.css";
import Api from "../modules/Api";

export default function DrawerScrollable({ channelSetter }) {
    const [open, setOpen] = useState(false);
    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState("");

    const handleSelectChannel = (channel) => {
        setSelectedChannel(channel);
        channelSetter(channel);
    }

    async function apiReqsOnAwake() {
        try {
            const channelsTemp = await Api.Channels.getAllChannels();
            const user = await Api.Users.getUserById(localStorage.getItem('id'));
            if(user.error){
                console.error('Failed to user infos');
            } else {
                const channelsDef = channelsTemp.map(channel => user.channels_id.includes(channel));
                /*console.log(channelsDef);*/
                setChannels(channelsDef);
            }
        } catch (error) {
            console.error('Failed to fetch channels:', error);
        }
    }

    useEffect(() => {
        apiReqsOnAwake();
    }, []);

    return (
        <React.Fragment>
            <IconButton onClick={() => setOpen(true)}>
                <Menu />
            </IconButton>
            <Drawer open={open} onClose={() => setOpen(false)} >
                <ModalClose onClick={() => setOpen(false)} />
                <DialogTitle>Channels</DialogTitle>
                <DialogContent style={{backgroundColor: "#242430"}}>
                    <List>
                        {channels.map((channel) => (
                            <ListItem key={channel._id}>
                                <ListItemButton onClick={() => handleSelectChannel(channel)}>
                                    <p className='channel-name'>{channel.name}</p>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Drawer>
        </React.Fragment>
    );
}
