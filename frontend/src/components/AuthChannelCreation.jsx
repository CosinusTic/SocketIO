import { Button, FormControl, FormLabel, Input } from "@mui/joy";
import { useState } from "react";
import Api from "../modules/Api";

export default function AuthChannelCreation() {
    const [value, setValue] = useState("");

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const date = new Date().toISOString();
        const body = {
            admin_id: localStorage.getItem("id"),
            creation_date : date,
            name : value
        };
       await Api.Channels.addChannel(body);
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormControl>
                <FormLabel>Channel name</FormLabel>
                <Input
                    value={value}
                    onChange={handleChange}
                />
                <Button type="submit">Enter</Button>
            </FormControl>
        </form>
    );
}
