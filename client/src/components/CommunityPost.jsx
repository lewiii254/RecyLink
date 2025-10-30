import { useState } from "react";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { communityAPI } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";

const CommunityPost = ({ post, onDeleted, onLikeToggled, onCommentAdded }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);
  const [liking, setLiking] = useState(false);

  const handleLike = async () => {
    if (!user) return;
    setLiking(true);
    try {
      const res = await communityAPI.likePost(post._id);
      if (res.data.success) {
        onLikeToggled(post._id, res.data.likesCount, res.data.likedByUser);
      }
    } catch (err) {
      console.error("Like failed", err);
    } finally {
      setLiking(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setLoadingComment(true);
    try {
      const res = await communityAPI.commentPost(post._id, commentText.trim());
      if (res.data.success) {
        onCommentAdded(post._id, res.data.comment);
        setCommentText("");
      }
    } catch (err) {
      console.error("Comment failed", err);
    } finally {
      setLoadingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    try {
      const res = await communityAPI.deletePost(post._id);
      if (res.data.success) {
        onDeleted(post._id);
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <article className="border border-gray-200 rounded-lg p-4">
      <header className="flex items-start justify-between mb-3">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {post.author?.username || "Unknown"}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 text-sm ${
              post.likedByUser ? "text-red-600" : "text-gray-600"
            }`}
            disabled={liking}
          >
            <Heart className="w-4 h-4" />
            <span>{post.likesCount || 0}</span>
          </button>
          {user && (user.id === post.author?._id || user.role === "admin") && (
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-600"
              title="Delete post"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      <div className="text-gray-800 mb-3 whitespace-pre-wrap">
        {post.content}
      </div>

      <div className="text-sm text-gray-600 mb-3">
        {post.commentsCount || 0} comments
      </div>

      <form onSubmit={handleComment} className="flex items-center space-x-2">
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
          placeholder="Write a comment..."
        />
        <button
          className="btn btn-primary"
          disabled={loadingComment || !commentText.trim()}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Comment
        </button>
      </form>
    </article>
  );
};

export default CommunityPost;
