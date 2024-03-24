import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import "../style/Message.css";
import Api from '../modules/Api';
import Utils from '../modules/Utils';
import Header from '../components/Header';
import InputBar from "../components/InputBar";
import ChannelMessages from '../components/ChannelMessages';
import SearchResults from '../components/Channels';
import AuthChannelCreation from '../components/AuthChannelCreation';

import "../style/Home.css";

const Home = () => {
    const [channels, setChannels] = useState([]);
    const [ channel_id, setActiveChannel] = useState('');
    const [messages, setMessages] = useState([]);
    const [author_username, setUsername] = useState('');
    const navigate = useNavigate();
    const socket = useRef(null);

    useEffect(() => {
        if (!Utils.isLoggedIn()) {
            navigate("/login");
        } else {
            setUsername(localStorage.getItem("username") || '');
            apiReqsOnAwake();
        }
    }, []);


    useEffect(() => {
        const cleanupSocket = connectToSocket();
        return cleanupSocket;
    }, []);

    useEffect(() => {
        loadMessages();
    }, [channel_id]);


    async function loadMessages() {
        if (channel_id) {
            const fetchedMessages = await Api.Messages.getMessagesByChannel(channel_id);
            setMessages(fetchedMessages);
        }
    }

    function connectToSocket() {
        if (!socket.current) {
            socket.current = io(process.env.REACT_APP_API_URL);

            socket.current.on('chat message', (data) => {
                setMessages(prevMessages => [...prevMessages, data]);
            });
        }

        return () => {
            if (socket.current) {
                socket.current.disconnect();
                socket.current = null;
            }
        };
    }

    async function apiReqsOnAwake() {
        try {
            const channels = await Api.Users.getUserChannels(localStorage.getItem("id"));
            if(channels.error){
               alert("Problem with the user info, log out");
            } else {
                setChannels(channels);
                setActiveChannel(channels[0]._id);
            }
        } catch (error) {
            console.error('Failed to fetch channels:', error);
        }
    }

    const handleChannelSelect = (channel) => {
        setActiveChannel(channel._id);
    };

    return (
        <main className='flex flex-row w-full h-screen'>
            <div className='flex flex-col w-1/4 bg-slate-950 p-5'>
                <SearchResults searchResults={channels} channelSetter={handleChannelSelect}/>
            </div>
            <div className='flex flex-col items-end flex-grow p-5 w-3/4 bg-slate-900'>
                <div className='flex message-container flex-col flex-grow content-end w-full'>
                  <ChannelMessages messages={messages} channelId={channel_id}/>
                </div>
                <div className='flex flex-col content-end w-full'>
                    <InputBar socket={socket} channel_id={channel_id} author_username={author_username} channelSetter={handleChannelSelect}/>
                </div>
            </div>
        </main>
    );
}; 

export default Home;
