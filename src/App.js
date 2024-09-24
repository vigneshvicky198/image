import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const res = await axios.get('/api/images');
    setImages(res.data);
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', imageFile);

    try {
      await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchImages();
      setTitle('');
      setImageFile(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/images/${id}`);
      fetchImages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <h1>Image Gallery</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Image title"
          required
        />
        <input type="file" onChange={handleFileChange} required />
        <button type="submit">Upload</button>
      </form>

      <div className="gallery">
        {images.map((image) => (
          <div key={image._id} className="image-item">
            <img src={image.imageUrl} alt={image.title} width="200" />
            <h3>{image.title}</h3>
            <button onClick={() => handleDelete(image._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
