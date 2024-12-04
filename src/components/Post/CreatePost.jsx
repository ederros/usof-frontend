import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


const CreatePost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(!!id);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('/api/categories')
      .then((response) => setCategories(response.data))
      .catch(() => setError('Failed to load categories'));
  }, []);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      axios
        .get(`/api/posts/${id}`)
        .then((response) => {
          const post = response.data;
          setTitle(post.title);
          setContent(post.content);
          setStatus(post.status);
          setSelectedCategories(post.categories.map((cat) => cat.id));
          setIsLoading(false);
        })
        .catch(() => {
          setError('Failed to load the post.');
          setIsLoading(false);
        });
    }
  }, [id]);

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedCategories(selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.patch(`/api/posts/${id}`, {
          title,
          content,
          status,
          categories: selectedCategories,
        }).catch(() => setError((err) => err.response?.data?.error));
        setSuccess('Post updated successfully!');
        navigate(`/posts/${id}`);
      } else {
        const response = await axios.post('/api/posts', {
          title,
          content,
          status,
          categories: selectedCategories,
        });
        setSuccess('Post created successfully!');
        setTitle('');
        setContent('');
        setSelectedCategories([]);
        navigate(`/posts/${id}`);
      }
    } catch (err) {
      setError('Failed to save the post.');
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="create-post-container">
      <h2>{id ? 'Edit Post' : 'Create a New Post'}</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="categories">Categories:</label>
          <select
            id="categories"
            name="categories"
            multiple
            value={selectedCategories}
            onChange={handleCategoryChange}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">{id ? 'Update Post' : 'Create Post'}</button>
      </form>
    </div>
  );
};

export default CreatePost;
