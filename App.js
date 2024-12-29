import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, MessageCircle, Share2, MoreVertical, Image, Send, Search, Bell, Home, User, Settings, LogOut, Bookmark, Trending, Hash } from 'lucide-react';

const SocialApp = () => {
  // State Management
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    username: 'CurrentUser',
    name: 'John Doe',
    avatar: '/api/placeholder/40/40',
    bio: 'Software Developer | React Enthusiast',
    following: 234,
    followers: 456
  });

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [activeTab, setActiveTab] = useState('feed');
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showComments, setShowComments] = useState({});
  const [comments, setComments] = useState({});

  // Simulated Data
  useEffect(() => {
    setPosts([
      {
        id: 1,
        author: 'Sarah Wilson',
        avatar: '/api/placeholder/32/32',
        content: 'Just launched my new portfolio! Check it out 🚀',
        likes: 42,
        comments: 8,
        timestamp: '2 hours ago',
        tags: ['portfolio', 'design'],
        isLiked: false,
        isSaved: false
      },
      // Add more sample posts...
    ]);

    setNotifications([
      {
        id: 1,
        type: 'like',
        user: 'Alex Thompson',
        content: 'liked your post',
        timestamp: '5m ago'
      },
      // Add more notifications...
    ]);
  }, []);

  // Post Management
  const handleNewPost = () => {
    if (newPost.trim()) {
      setPosts([{
        id: Date.now(),
        author: currentUser.name,
        avatar: currentUser.avatar,
        content: newPost,
        likes: 0,
        comments: 0,
        timestamp: 'Just now',
        tags: extractTags(newPost),
        isLiked: false,
        isSaved: false
      }, ...posts]);
      setNewPost('');
    }
  };

  const extractTags = (content) => {
    const tags = content.match(/#[\w]+/g);
    return tags ? tags.map(tag => tag.slice(1)) : [];
  };

  // Interaction Handlers
  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleSave = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, isSaved: !post.isSaved };
      }
      return post;
    }));
  };

  const handleComment = (postId, comment) => {
    if (!comments[postId]) {
      setComments({ ...comments, [postId]: [] });
    }
    setComments({
      ...comments,
      [postId]: [...(comments[postId] || []), {
        id: Date.now(),
        user: currentUser.name,
        avatar: currentUser.avatar,
        content: comment,
        timestamp: 'Just now'
      }]
    });
  };

  // UI Components
  const Sidebar = () => (
    <div className="w-64 fixed left-0 top-0 h-full border-r p-4 space-y-6">
      <div className="flex items-center space-x-2 mb-8">
        <Avatar className="w-10 h-10">
          <img src={currentUser.avatar} alt={currentUser.name} className="rounded-full" />
        </Avatar>
        <div>
          <h3 className="font-medium">{currentUser.name}</h3>
          <p className="text-sm text-gray-500">@{currentUser.username}</p>
        </div>
      </div>

      <nav className="space-y-2">
        <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('feed')}>
          <Home className="w-4 h-4 mr-2" /> Home
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('explore')}>
          <Hash className="w-4 h-4 mr-2" /> Explore
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('notifications')}>
          <Bell className="w-4 h-4 mr-2" /> Notifications
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('profile')}>
          <User className="w-4 h-4 mr-2" /> Profile
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('bookmarks')}>
          <Bookmark className="w-4 h-4 mr-2" /> Bookmarks
        </Button>
      </nav>
    </div>
  );

  const PostCard = ({ post }) => (
    <Card key={post.id}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Avatar>
              <img src={post.avatar} alt={post.author} className="rounded-full" />
            </Avatar>
            <div>
              <h3 className="font-medium">{post.author}</h3>
              <p className="text-sm text-gray-500">{post.timestamp}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{post.content}</p>
        {post.tags.length > 0 && (
          <div className="flex gap-2 mt-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-blue-500 text-sm">#{tag}</span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex items-center space-x-6 w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center ${post.isLiked ? 'text-red-500' : ''}`}
            onClick={() => handleLike(post.id)}
          >
            <Heart className="w-4 h-4 mr-2" fill={post.isLiked ? 'currentColor' : 'none'} />
            {post.likes}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center"
            onClick={() => setShowComments({ ...showComments, [post.id]: !showComments[post.id] })}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {(comments[post.id] || []).length}
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center ${post.isSaved ? 'text-yellow-500' : ''}`}
            onClick={() => handleSave(post.id)}
          >
            <Bookmark className="w-4 h-4" fill={post.isSaved ? 'currentColor' : 'none'} />
          </Button>
        </div>

        {showComments[post.id] && (
          <div className="w-full space-y-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Write a comment..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleComment(post.id, e.target.value);
                    e.target.value = '';
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              {(comments[post.id] || []).map(comment => (
                <div key={comment.id} className="flex items-start space-x-2">
                  <Avatar className="w-6 h-6">
                    <img src={comment.avatar} alt={comment.user} className="rounded-full" />
                  </Avatar>
                  <div className="flex-1 bg-gray-100 rounded-lg p-2">
                    <p className="font-medium text-sm">{comment.user}</p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );

  const NotificationsPanel = () => (
    <div className="space-y-4">
      {notifications.map(notification => (
        <Card key={notification.id}>
          <CardContent className="flex items-center space-x-4 py-4">
            <Avatar>
              <img src="/api/placeholder/32/32" alt={notification.user} className="rounded-full" />
            </Avatar>
            <div className="flex-1">
              <p>
                <span className="font-medium">{notification.user}</span>
                {' '}{notification.content}
              </p>
              <p className="text-sm text-gray-500">{notification.timestamp}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ProfilePanel = () => (
    <Card>
      <CardHeader>
        <div className="text-center space-y-4">
          <Avatar className="w-24 h-24 mx-auto">
            <img src={currentUser.avatar} alt={currentUser.name} className="rounded-full" />
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{currentUser.name}</h2>
            <p className="text-gray-500">@{currentUser.username}</p>
          </div>
          <p>{currentUser.bio}</p>
          <div className="flex justify-center space-x-6">
            <div className="text-center">
              <p className="font-bold">{currentUser.following}</p>
              <p className="text-gray-500">Following</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{currentUser.followers}</p>
              <p className="text-gray-500">Followers</p>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
              prefix={<Search className="w-4 h-4" />}
            />
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="feed">
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Avatar>
                      <img src={currentUser.avatar} alt={currentUser.name} className="rounded-full" />
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <Input
                        placeholder="What's happening?"
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="w-full"
                      />
                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm">
                          <Image className="w-4 h-4 mr-2" />
                          Photo
                        </Button>
                        <Button onClick={handleNewPost}>
                          <Send className="w-4 h-4 mr-2" />
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationsPanel />
            </TabsContent>

            <TabsContent value="profile">
              <ProfilePanel />
            </TabsContent>

            <TabsContent value="bookmarks">
              <div className="space-y-4">
                {posts.filter(post => post.isSaved).map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SocialApp;