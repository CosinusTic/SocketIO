import {Button, Grid, Input, styled, Textarea} from "@mui/joy";
import {useEffect, useState} from "react";
import Api from "../modules/Api";
import Utils from "../modules/Utils";
import {json} from "react-router-dom";

const GridForm = styled(Grid)({
    width: '100%',
});

//@TODO make a user join the channel he created
//@TODO check that the channel is added to the user info in /join cmd
export default function InputBar({socket, channel_id, channelSetter}){
    const [value, setValue] = useState("");
    const [id, setId] = useState("");
    let content;
    let author_username;
    let creation_date;

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    useEffect(() => {
        setId(localStorage.getItem('id'));
        author_username = localStorage.getItem('username');
    })

    useEffect(() => {
        setId(localStorage.getItem('id'));
    }, [localStorage.getItem('id')]);

  useEffect(() => {
      author_username = localStorage.getItem('username');
  }, [localStorage.getItem('username')])

    const handleSubmit = (event) => {
        event.preventDefault();
        setId(localStorage.getItem("id"));
        creation_date = Utils.actualDate();
        const command = value.trim().replaceAll(" ","").toLowerCase();
        if (command[0] === "/") {
            handleCommands(command);
            setValue('');
        }else{
            if (value.trim() !== '') {
                content = value.trim();
                socket.current.emit('chat message', { author_username, content, channel_id, creation_date });
                setValue('');
            }
        }
    };

    const handleCommands = async (str) => {
        if(str.substring(0,5) === "/nick"){
            await Utils.nick(value, channel_id, socket);
        }else if(str.substring(0,5) === "/list"){
            await Utils.list(value,channel_id,socket);
        }else if(str.substring(0,7) === "/create"){
            await Utils.create(value, channel_id, socket);
        }else if(str.substring(0,7) === "/delete"){
            await Utils.deletes(value, channel_id, socket);
        }else if(str.substring(0,5) === "/join"){
            const res = await Utils.join(value, channel_id, socket);
            if(res){
                channelSetter(res);
            }
        }else if(str.substring(0,5) === "/quit"){
            await Utils.quit(value, channel_id, socket);
        }else if(str.substring(0,6) === "/users"){
            await Utils.users(value, channel_id, socket);
        }
    }

    return (
        <div className='flex flex-row w-full'>
            <div className ='flex flex-row flex-start w-full flex-grow'>
                <input value={value} onChange={handleChange} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="type you message"></input>
            </div>
            <div className='flex flex-row flex-start flex-grow pl-4 '>
                <button type="submit" onClick={handleSubmit} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </div>
        </div>
    );
}

