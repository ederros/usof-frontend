import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import ErrorHandler from '../ErrorHandler';
import { fetchCategories as Categories } from '../../slices/categorySlice';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../../styles/Posts.css';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderBy, setOrderBy] = useState('likes');
    const [orderType, setOrderType] = useState('ASC');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [search, setSearch] = useState('');
    const categories = useSelector((state) => state.categories.categories);
    const dispatch = useDispatch();
    const location = useLocation();

    const navigate = useNavigate();
    const page = parseInt(location.state?.page || 1);

    useEffect(() => {
        dispatch(Categories());
        axios
            .get('/api/posts', {
                params: {
                    page,
                    orderBy,
                    categories: categoryFilter,
                    search,
                    orderType: orderType === 'ASC' ? false : true,
                },
            })
            .then((response) => {
                const fetchedPosts = response.data.map((post) => ({
                    ...post,
                    comments: [],
                    categories: [],
                    authorLogin: 'Unknown',
                    loadingComments: true,
                    loadingCategories: true,
                }));
                setPosts(fetchedPosts);
                setLoading(false);

                fetchedPosts.forEach((post) => {
                    fetchComments(post.id);
                    fetchCategories(post.id);
                    if (post.author_id) fetchAuthor(post.id, post.author_id);
                });
            })
            .catch((err) => {
                setError('Cannot connect to server');
                setLoading(false);
            });
    }, [page, orderBy, categoryFilter, search, orderType]);

    const fetchComments = (postId) => {
        axios
            .get(`/api/posts/${postId}/comments`)
            .then((response) =>
                updatePost(postId, { comments: response.data, loadingComments: false })
            )
            .catch(() => updatePost(postId, { loadingComments: false }));
    };

    const fetchCategories = (postId) => {
        axios
            .get(`/api/posts/${postId}/categories`)
            .then((response) =>
                updatePost(postId, { categories: response.data, loadingCategories: false })
            )
            .catch(() => updatePost(postId, { loadingCategories: false }));
    };

    const fetchAuthor = (postId, authorId) => {
        axios
            .get(`/api/users/${authorId}`)
            .then((response) =>
                updatePost(postId, { authorLogin: response.data.login })
            )
            .catch(() => updatePost(postId, { authorLogin: 'Unknown' }));
    };

    const updatePost = (postId, data) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) => (post.id === postId ? { ...post, ...data } : post))
        );
    };

    const handlePagination = (newPage) => {
        navigate('/', { state: { page: newPage } });
        window.location.reload();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <ErrorHandler error={error} />
            <h2 className="page-title">Posts</h2>

            {/* Search and Filters */}
            <div className="filters-container">
                <div className="filter-item">
                    <label htmlFor="search">Search by Name:</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Search posts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="filter-item">
                    <label htmlFor="orderBy">Sort By:</label>
                    <select
                        id="orderBy"
                        value={orderBy}
                        onChange={(e) => setOrderBy(e.target.value)}
                    >
                        <option value="likes">Likes</option>
                        <option value="date">Date</option>
                        <option value="title">Title</option>
                    </select>
                </div>
                <div className="filter-item">
                    <label htmlFor="categoryFilter">Filter by Category:</label>
                    <select
                        id="categoryFilter"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="filter-item">
                    <label htmlFor="orderType">Order Type:</label>
                    <select
                        id="orderType"
                        value={orderType}
                        onChange={(e) => setOrderType(e.target.value)}
                    >
                        <option value="ASC">Ascending</option>
                        <option value="DESC">Descending</option>
                    </select>
                </div>
            </div>

            {/* Posts List */}
            <div className="posts-container">
                {posts.map((post) => (
                    <div key={post.id} className="post-card">
                        <Link to={`/posts/${post.id}`} className="post-link">
                            <h3 className="dark-text">{post.title}</h3>
                            <div className="post-meta">
                                <span>By: {post.authorLogin}</span>
                                <span>{new Date(post.publish_date).toLocaleDateString()}</span>
                                <span>Status: {post.status}</span>
                            </div>
                            <div className="post-categories">
                                {post.loadingCategories ? (
                                    <p>Loading categories...</p>
                                ) : (
                                    <span>
                                        Categories:{' '}
                                        {post.categories.length
                                            ? post.categories.map((cat) => cat.title).join(', ')
                                            : 'None'}
                                    </span>
                                )}
                            </div>
                            <div className="post-comments">
                                {post.loadingComments ? (
                                    <p>Loading comments...</p>
                                ) : (
                                    <span>Comments: {post.comments?.length || 'None'}</span>
                                )}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
                {page > 1 && (
                    <button onClick={() => handlePagination(page - 1)}>Previous</button>
                )}
                {posts.length === 10 && (
                    <button onClick={() => handlePagination(page + 1)}>Next</button>
                )}
            </div>
        </div>
    );
};

export default Posts;
