import { useEffect, useState } from "react";
import Api from "../modules/Api";
import Header from "./Header";

function SearchResults({ searchResults, channelSetter }) {
    const [selectedChannel, setSelectedChannel] = useState("");

    const handleSelectChannel = (channel) => {
        setSelectedChannel(channel);
        channelSetter(channel);
    };

    return (
        <div>
            <Header />
            {searchResults.length > 0 ? (
                <ul className="space-y-4">
                    {searchResults.map((result) => (
                        <li key={result._id} onClick={() => handleSelectChannel(result)}
                            className="bg-slate-700 drop-shadow rounded-lg overflow-hidden w-full p-4 transition-transform hover:scale-[1.05] duration-300">
                            <p className="font-bold text-m mb-2 text-white">{result.name}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>There is an error with the user creation</p>
            )}
        </div>
    );
}

export default SearchResults;
