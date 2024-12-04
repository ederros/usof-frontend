import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorHandler from '../ErrorHandler';
import LikeDislike from '../LikeDislike/LikeDislike';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';
import '../../styles/PostDetail.css';
import Avatar from '../Avatar';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [authorLogin, setAuthorLogin] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const token = useSelector((state) => state.auth.user ? jwtDecode(state.auth.user.jwt) : null);    
    const [editCommentId, setEditCommentId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedPost, setEditedPost] = useState({ title: '', content: '' });
    const [isActive, setIsActive] = useState(post?.isActive ?? true);
    const [categories, setCategories] = useState([]);  // New state for categories

    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`/api/posts/${id}`)
            .then((response) => {
                setPost(response.data);
                if (response.data.author_id) {
                    fetchAuthor(response.data.author_id);
                }
                setEditedPost({ title: response.data.title, content: response.data.content });
                if (token) {
                    checkIfFavorite(response.data.id);
                }
                fetchCategories(response.data.id);  // Fetch categories when post is loaded
                setLoading(false);
            })
            .catch(() => {
                setError('Cannot load post');
                setLoading(false);
            });

        fetchComments();
    }, [id]);

    const fetchCategories = (postId) => {
        axios
            .get(`/api/posts/${postId}/categories`)
            .then((response) => setCategories(response.data))
            .catch(() => setError('Failed to load categories'));
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`/api/posts/${id}/comments`);
            const commentsData = response.data || [];
            setComments(commentsData);
        } catch (error) {
            setError('Cannot load comments');
        }
    };


    const fetchAuthor = (authorId) => {
        axios
            .get(`/api/users/${authorId}`)
            .then((response) => setAuthorLogin(response.data.login))
            .catch(() => setAuthorLogin('Unknown'));
    };

    const handleNewComment = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        axios
            .post(`/api/posts/${id}/comments`, { content: newComment })
            .then((response) => {
                setComments((prev) => [...prev, response.data]);
                setNewComment('');
            })
            .catch(() => setError('Failed to post comment'));
        window.location.reload();
    };

    const checkIfFavorite = (postId) => {
        try {
            axios
                .get(`/api/favorites/${postId}`)
                .then((resp) => setIsFavorite(resp.data))
                .catch(() => setError('Relogin please'));
        } catch (err) {
            console.log(err);
        }
    };

    const handleEditComment = (commentId, content) => {
        setEditCommentId(commentId);
        setEditContent(content);
    };
    const handleSaveComment = (commentId) => {
        if (!editContent.trim()) return;

        axios
            .patch(`/api/comments/${commentId}`, { content: editContent })
            .then(() => {
                setComments((prev) =>
                    prev.map((comment) =>
                        comment.id === commentId ? { ...comment, content: editContent } : comment
                    )
                );
                setEditCommentId(null);
                setEditContent('');
            })
            .catch(() => setError('Failed to update comment'));
    };
    const handleCancelEditComment = () => {
        setEditCommentId(null);
        setEditContent('');
    };
    const handleDeleteComment = (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            axios
                .delete(`/api/comments/${commentId}`)
                .then(() => {
                    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
                })
                .catch(() => setError('Failed to delete comment'));
        }
    };

    const toggleFavorite = () => {
        if (isFavorite) {
            axios
                .delete(`/api/favorites/${id}`)
                .then(() => setIsFavorite(false))
                .catch(() => setError('Failed to remove from favorites'));
        } else {
            axios
                .post(`/api/favorites/${id}`)
                .then(() => setIsFavorite(true))
                .catch(() => setError('Failed to add to favorites'));
        }
    };

    const handleDeletePost = () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            axios
                .delete(`/api/posts/${id}`)
                .then(() => {
                    navigate('/');
                })
                .catch(() => setError('Failed to delete post'));
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="post-detail-container">
            <ErrorHandler error={error} />
            {post && (
                <div className="post-detail">
                    <h2 className='dark-text'>{post.title}</h2>
                    <div className="post-meta">
                        <span>By: {authorLogin || 'Unknown'}</span>
                        <span>{new Date(post.publish_date).toLocaleDateString()}</span>
                        <span>Status: {post.status}</span>
                    </div>
                    <div className="post-content">
                        <p className='dark-text'>{post.content}</p>
                    </div>
                    <div className="post-categories">
                        {categories.length > 0 ? (
                            <span>
                                Categories: {categories.map((cat) => cat.title).join(', ')}
                            </span>
                        ) : (
                            <span>No categories</span>
                        )}
                    </div>
                    <LikeDislike id={post.id} type="post"/>
                    {token && (
                        <button onClick={toggleFavorite} className="favorite-btn">
                            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
                    )}
                    {token && (token.id === post.author_id || token.role === 'admin') && (
                        <button onClick={handleDeletePost} className="delete-btn">
                            Delete
                        </button>
                    )}
                </div>
            )}

            
            {token && (token.id === post.author_id || token.role === 'admin') && 
                <Link to={`/posts/${id}/edit`}>
                    <p>Edit</p>
                </Link>
            }

            <div className="comments-section">
                <h3 className='dark-text'>Comments</h3>
                <form onSubmit={handleNewComment} className="new-comment-form">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                    />
                    <button type="submit">Post Comment</button>
                </form>

                {comments.length === 0 && <p>No comments yet</p>}
                {comments.map((comment) => (
                    <div key={comment.id} className="comment">
                        <Avatar imagePath={comment.authorAvatar}/>
                        <p>
                            <strong>{comment.authorLogin}</strong> - {new Date(comment.publish_date).toLocaleDateString()}
                        </p>
                        {editCommentId === comment.id ? (
                            <div className="edit-comment-form">
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                ></textarea>
                                <button onClick={() => handleSaveComment(comment.id)}>Save</button>
                                <button onClick={handleCancelEditComment}>Cancel</button>
                            </div>
                        ) : (
                            <p>{comment.content}</p>
                        )}
                        {token && <LikeDislike id={comment.id} type="comment" />}
                        {token && (token.id === comment.author_id || token.role === 'admin') && (
                            <div className="comment-actions">
                                <button onClick={() => handleEditComment(comment.id, comment.content)}>
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostDetail;
