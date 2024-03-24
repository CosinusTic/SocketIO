import React, {useEffect, useState} from "react";
import Api from "../modules/Api";
import "../style/Message.css";


const ChannelMessages = ({ messages, channelId }) => {
    const [channel, setChannel] = useState(undefined);

    async function assignChannel() {
        setChannel(await Api.Channels.getChannelById(channelId));
    }

    useEffect(() => {
        if(channelId){
            assignChannel();
        }
    }, [channelId]);

    return (
        messages.length > 0 ?
            messages.map((message, index) => {
                const keyProp = message.id || `message-${index}`;

                const isCurrentUserMessage = localStorage.getItem("username") === message.author_username;
                const messageClass = isCurrentUserMessage ? "message-bubble-end" : "message-bubble-start";
                const altText = `${message.author_username} image`;

                return (
                    <div key={keyProp} className={`flex ${isCurrentUserMessage ? 'gap-2.5' : 'items-start gap-2.5'} ${messageClass}`}>
                        <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt={altText} />
                        <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{message.author_username}</span>
                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{message.creation_date.toString().split('T')[0]}</span>
                            </div>
                            <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{message.content}</p>
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
                        </div>
                    </div>
                );
            })
            :
            <p>No message on this channel yet!</p>
    );
}

export default ChannelMessages;