import { useEffect, useState } from 'react';
import { communityAPI } from '../utils/api';
import CommunityPost from '../components/CommunityPost';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const fetchPosts = async (pg = 1) => {
    setLoading(true);
    try {
      const res = await communityAPI.getPosts(pg, 10);
      if (res.data.success) {
        setPosts(res.data.posts || []);
        setTotal(res.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load posts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const res = await communityAPI.createPost(content.trim());
      if (res.data.success) {
        // prepend new post
        setPosts((p) => [res.data.post, ...p]);
        setContent('');
      }
    } catch (err) {
      console.error('Create post failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleted = (id) => {
    setPosts((p) => p.filter((x) => x._id !== id));
  };

  const handleLikeToggled = (id, likesCount, likedByUser) => {
    setPosts((p) => p.map((x) => (x._id === id ? { ...x, likesCount, likedByUser } : x)));
  };

  const handleCommentAdded = (id, comment) => {
    setPosts((p) => p.map((x) => (x._id === id ? { ...x, commentsCount: (x.commentsCount || 0) + 1 } : x)));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Community Feed</h1>
          <p className="text-gray-600">Share updates, tips, and coordinate cleanups with neighbors.</p>
        </div>

        {user ? (
          <form onSubmit={handleSubmit} className="mb-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-md p-3"
              placeholder="What's happening in your neighborhood?"
            />
            <div className="mt-3 flex justify-end">
              <button className="btn btn-primary" disabled={submitting || !content.trim()}>
                Post
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-6 text-sm text-gray-600">Sign in to post and interact with the community.</div>
        )}

        {loading ? (
          <div className="py-12">
            <LoadingSpinner />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-gray-600">No posts yet — be the first to share!</div>
        ) : (
          <div className="space-y-4">
            {posts.map((p) => (
              <CommunityPost
                key={p._id}
                post={p}
                onDeleted={handleDeleted}
                onLikeToggled={handleLikeToggled}
                onCommentAdded={handleCommentAdded}
              />
            ))}
          </div>
        )}

        {/* Simple pagination controls */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">Showing page {page}</div>
          <div className="space-x-2">
            <button className="btn btn-outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </button>
            <button className="btn btn-outline" disabled={posts.length === 0} onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
