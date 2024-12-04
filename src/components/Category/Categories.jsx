import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import '../../styles/Categories.css'; // Assuming you have a separate CSS file

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const token = useSelector((state) => state.auth.user ? jwtDecode(state.auth.user.jwt) : null);

    useEffect(() => {
        axios
            .get('/api/categories')
            .then((response) => {
                setCategories(response.data);
            })
            .catch(() => setError('Failed to load categories'));
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await axios.delete(`/api/categories/${id}`, { withCredentials: true });
                setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
            } catch (err) {
                setError('Failed to delete category.');
            }
        }
    };

    return (
        <div className="categories-container">
            <h2 className='dark-text'>Categories</h2>
            {error && <p className="error-message">{error}</p>}

            {token?.role === 'admin' && (
                <div className="add-category">
                    <Link to="/categories/add" className="add-category-button">
                        + Add Category
                    </Link>
                </div>
            )}

            <ul className="categories-list">
                {categories.length === 0 ? (
                    <p className="no-categories">No categories available.</p>
                ) : (
                    categories.map((category) => (
                        <li className="category-item" key={category.id}>
                            <Link to={`/categories/${category.id}/posts`} className="category-link">
                                <div className="category-title">{category.title}</div>
                                <div className="category-description">{category.description}</div>
                            </Link>
                            {token?.role === 'admin' && (
                                <div>
                                    <Link to={`/categories/${category.id}/edit`} className="edit-link">
                                        <button
                                        >
                                            Edit
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="delete-button"
                                    >
                                        Delete
                                    </button>
                                </div>
                                

                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default Categories;
