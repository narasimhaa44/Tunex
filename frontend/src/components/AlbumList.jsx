import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AlbumsList() {
    const [albums, setAlbums] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:5000/api/albums')
            .then(res => setAlbums(res.data.albums))
            .catch(console.error);
    }, []);
    return (
        <div>
            <h2>Albums</h2>
            <div className="grid">
                {albums.map(a => (
                    <Link key={a._id} to={`/album/${a._id}`} className="albumCard">
                        <img src={a.coverUrl} alt={a.title} />
                        <h3>{a.title}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
}
