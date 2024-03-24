import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Utils from '../modules/Utils';
import Api from "../modules/Api";
import '../style/Login.css';


const Login = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (username.trim() !== '') {
            
            const user = await Api.Users.getUser(username.trim())
            if(user == null){
                const body = {
                    'username': username.trim(),
                    'channel_ids': []
                }
                await Api.Users.addUser(body);
                const userCreated = await Api.Users.getUser(username.trim());
                localStorage.setItem('id', userCreated._id);
                localStorage.setItem('username', username.trim());
                navigate("/");
            }
            else {
                localStorage.setItem('username', username.trim());
                localStorage.setItem('id',user._id);
                navigate("/");
            }
        } else {
            alert('Please enter a username.');
        }
    };

    useEffect(() => {
        if(Utils.isLoggedIn()){
            navigate("/");
        }
    }, [])

    return (
        <section className="bg-gray-50 dark:bg-gray-900 bg-chatte-gpt">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                    Chat GPT
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Log in to chat !
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#" id="loginForm">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your username</label>
                            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ex: chatteur_extrême" required />
                            
                            <button onClick={handleSubmit} type="submit" className="w-full login-button text-black bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
