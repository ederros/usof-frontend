import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login.jsx';
import Posts from './components/Post/Posts.jsx';
import Profile from './components/Profile/ProfilePage.jsx';
import Users from './components/User/Users.jsx';
import User from './components/User/User.jsx';
import PostDetail from './components/Post/PostDetail.jsx';
import Register from './components/Registration/Register.jsx';
import ConfirmRegister from './components/Registration/ConfirmRegister.jsx';
import Header from './components/Header/Header.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import CreatePost from './components/Post/CreatePost.jsx';
import Favorites from './components/Post/Favorites.jsx';
import Categories from './components/Category/Categories.jsx';
import CategoryPosts from './components/Category/CategoryPost.jsx';
import CategoryForm from './components/Category/CategoryForm.jsx';
import EditPost from './components/Post/EditPost.jsx';
import EditUser from './components/User/EditUser.jsx';
import './styles/styles.css';

const App = () => {
  return (
    <div>
      <Router>
        <Header />
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <main style={{ flex: 1, padding: '20px' }}>
            <Routes>
              <Route path="/" element={<Posts />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<Profile />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/users/:id/edit" element={<EditUser />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/:token" element={<ConfirmRegister />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/posts/:id/edit" element={<CreatePost />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:category_id/posts" element={<CategoryPosts />} />
              <Route path="/categories/add" element={<CategoryForm />} />
              <Route path="/categories/:category_id/edit" element={<CategoryForm isEditing={true} />} />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
};

export default App;
