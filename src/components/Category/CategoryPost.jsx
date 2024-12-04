import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CategoryPosts = () => {
    const { category_id } = useParams();
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(`/api/categories/${category_id}/posts`)
            .then((response) => setPosts(response.data))
            .catch(() => setError('Failed to load posts for this category'));
    }, [category_id]);

    return (
        <div>
            <h2>Posts in Category</h2>
            {error && <p className="error">{error}</p>}
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <Link to={`/posts/${post.id}`}>{post.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryPosts;
