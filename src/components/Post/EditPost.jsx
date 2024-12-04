import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [isActive, setActive] = useState(true);

    useEffect(() => {
        axios
            .get(`/api/posts/${id}`)
            .then((response) => {
                const { title, content, categories, status } = response.data;
                setTitle(title);
                setContent(content);
                setCategories(categories || []);
                setActive(status);
            })
            .catch(() => setError('Failed to load post details'));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            title,
            content,
            categories: categories.filter((cat) => cat.trim() !== ''), 
            isActive,
        };
        axios
            .patch(`/api/posts/${id}`, payload)
            .then(() => navigate(`/posts/${id}`))
            .catch(() => setError('Failed to update post'));
    };

    const handleCategoryChange = (e) => {
        setCategories(e.target.value.split(',').map((cat) => cat.trim()));
    };

    return (
        <div className="edit-post-container">
            <h2>Edit Post</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="edit-post-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="categories">Categories</label>
                    <input
                        type="text"
                        id="categories"
                        value={categories.join(', ')}
                        onChange={handleCategoryChange}
                        placeholder="Separate categories with commas"
                    />
                </div>
                <div className="form-group">
                    <label>
                        Active:
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setActive(e.target.checked)}
                        />
                    </label>
                </div>
                <button type="submit" className="submit-btn">Save Changes</button>
            </form>
        </div>
    );
};

export default EditPost;
