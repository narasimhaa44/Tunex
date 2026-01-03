import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCompactDisc, FaImage, FaArrowLeft, FaCheck } from 'react-icons/fa';

export default function CreateAlbum() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Song Selection State
    const [availableSongs, setAvailableSongs] = useState([]);
    const [selectedSongs, setSelectedSongs] = useState([]);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const res = await axios.get("https://tunex-15at.onrender.com/api/songs/all", {
                    withCredentials: true
                });
                if (res.data.songs) {
                    setAvailableSongs(res.data.songs);
                }
            } catch (err) {
                console.error("Failed to fetch songs", err);
            }
        };
        fetchSongs();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ... (handlers same)

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setCoverPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setCoverFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setCoverPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const toggleSongSelection = (songId) => {
        setSelectedSongs(prev =>
            prev.includes(songId)
                ? prev.filter(id => id !== songId)
                : [...prev, songId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !coverFile) {
            alert("Title and Cover Image are required!");
            return;
        }

        setLoading(true);
        const fd = new FormData();
        fd.append('title', formData.title);
        fd.append('description', formData.description);
        fd.append('cover', coverFile);
        fd.append('songs', JSON.stringify(selectedSongs));

        try {
            await axios.post('https://tunex-15at.onrender.com/api/albums', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            navigate('/home');
        } catch (err) {
            console.error(err);
            alert('Failed to create album');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            padding: '40px',
            fontFamily: "'Inter', sans-serif"
        }}>
            <button
                onClick={() => navigate('/home')}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '1.2rem',
                    marginBottom: '40px',
                    width: 'fit-content'
                }}
            >
                <FaArrowLeft /> Back
            </button>

            <div style={{
                maxWidth: '800px',
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '40px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '10px', letterSpacing: '-1px' }}>Create Album</h1>
                    <p style={{ color: '#888', fontSize: '1.1rem' }}>Curate your collection in monochrome.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

                    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {/* Cover Upload */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <label style={{
                                width: '250px',
                                height: '250px',
                                border: `2px dashed ${isDragging ? '#fff' : '#333'}`,
                                borderRadius: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                position: 'relative',
                                transition: 'all 0.3s',
                                backgroundColor: isDragging ? '#111' : 'transparent'
                            }}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = '#fff'}
                                onMouseOut={(e) => !isDragging && (e.currentTarget.style.borderColor = '#333')}
                            >
                                {coverPreview ? (
                                    <img src={coverPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <>
                                        <FaImage size={40} color="#333" />
                                        <span style={{ marginTop: '10px', color: '#555', fontSize: '0.9rem' }}>
                                            {isDragging ? "Drop Image Here" : "Upload Cover"}
                                        </span>
                                    </>
                                )}
                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                            </label>
                        </div>

                        {/* Inputs */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minWidth: '300px' }}>
                            <div style={{ position: 'relative' }}>
                                <FaCompactDisc style={{ position: 'absolute', top: '15px', left: '15px', color: '#555' }} />
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Album Title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '15px 15px 15px 45px',
                                        background: '#111',
                                        border: '1px solid #333',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <textarea
                                name="description"
                                placeholder="Description (Optional)"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    background: '#111',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    resize: 'none'
                                }}
                            />
                        </div>
                    </div>

                    {/* Song Selection */}
                    <div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Select Songs</h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '15px',
                            maxHeight: '400px',
                            overflowY: 'auto',
                            paddingRight: '10px'
                        }}>
                            {availableSongs.length === 0 ? (
                                <p style={{ color: '#888', fontStyle: 'italic' }}>No songs available. Upload some songs first!</p>
                            ) : (
                                availableSongs.map(song => (
                                    <div
                                        key={song._id}
                                        onClick={() => toggleSongSelection(song._id)}
                                        style={{
                                            background: selectedSongs.includes(song._id) ? '#fff' : '#111',
                                            color: selectedSongs.includes(song._id) ? '#000' : '#fff',
                                            padding: '15px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            border: '1px solid #333',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            border: `2px solid ${selectedSongs.includes(song._id) ? '#000' : '#555'}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {selectedSongs.includes(song._id) && <FaCheck size={10} />}
                                        </div>
                                        <div style={{ overflow: 'hidden' }}>
                                            <p style={{ fontWeight: 'bold', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</p>
                                            <p style={{ fontSize: '0.8rem', margin: 0, opacity: 0.7 }}>{song.artist}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '18px',
                            background: '#FFFFFF',
                            color: '#000000',
                            border: 'none',
                            borderRadius: '50px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'transform 0.2s',
                            marginTop: '20px'
                        }}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {loading ? 'Creating...' : 'Create Album'}
                    </button>
                </form>
            </div>
        </div>
    );
}
