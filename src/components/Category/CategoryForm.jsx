import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CategoryForm = ({ isEditing = false }) => {
    const { category_id } = useParams();
    const navigate = useNavigate();
    const [title, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditing) {
            axios
                .get(`/api/categories/${category_id}`)
                .then((response) => {
                    setName(response.data.title);
                    setDescription(response.data.description);
                    console.log(response.data);
                })
                .catch(() => setError('Failed to load category details'));
        }
    }, [isEditing, category_id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const request = isEditing
            ? axios.patch(`/api/categories/${category_id}`, { title, description })
            : axios.post('/api/categories', { title, description });

        request
            .then(() => navigate('/categories'))
            .catch(() => setError('Failed to save category'));
    };

    return (
        <div>
            <h2>{isEditing ? 'Edit Category' : 'Add Category'}</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <br/>
                    <label>Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default CategoryForm;
