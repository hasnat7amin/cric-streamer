// create all post controller

const Post = require("../models/Post");
const CommentPost = require("../models/CommentPost");
const LikePost = require("../models/LikePost");
const User = require("../models/User");
const Team = require("../models/Team");
const Match = require("../models/Match");
const ScoreCard = require("../models/ScoreCard");
const VerifyToken = require("../validation/verifyToken");

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
exports.getPosts = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const posts = await Post.find()
      .populate("user")
      .populate({ path: "comments", populate: { path: "user" } })
      .populate({ path: "likes", populate: { path: "user" } })
      .sort({ date: -1 });
    res.status(200).json({
      status: true,
      data: posts,
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Private
exports.getPostById = async (req, res) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const post = await Post.findById(req.params.id)
      .populate("user")
      .populate({ path: "comments", populate: { path: "user" } })
      .populate({ path: "likes", populate: { path: "user" } })
      .sort({ date: -1 });
    res.status(200).json({
      status: true,
      data: post,
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   POST api/posts
// @desc    Create post
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const validatedUser = await VerifyToken(req, res).then(async (user) => {
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found",
        });
      }
      return user;
    });
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const user = validatedUser._id;
    const { text, avatar, video } = req.body;

    const newPost = new Post({
      text,
      avatar,
      video,
      user,
    });

    await newPost.save().then((post) => {
      res.status(200).json({
        status: true,
        data: post,
        message: "Post created successfully",
      });
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   PUT api/posts/:id
// @desc    Update post
// @access  Private
exports.updatePost = async (req, res) => {
  try {
    const validatedUser = await VerifyToken(req, res).then(async (user) => {
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found",
        });
      }
      return user;
    });
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    //const post = await Post.findByIdAndUpdate(req.params.id, req.body).where({ user: validatedUser._id });
    await Post.findByIdAndUpdate(req.params.id, {
      text: req.body.text,
      avatar: req.body.avatar,
    })
      .where({ user: validatedUser._id })
      .then(async (post) => {

        res.status(200).json({
          status: true,
          data: await Post.findById(req.params.id).where({ user: validatedUser._id }),
          message: "Post updated successfully",
        });
      });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const validatedUser = await VerifyToken(req, res).then(async (user) => {
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found",
        });
      }
      return user;
    });
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const post = await Post.findByIdAndDelete(req.params.id).where({
      user: validatedUser._id,
    });
    res.status(200).json({
      status: true,
      data: post,
      message: "Post deleted successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   POST api/posts/:id/comments
// @desc    Create comment
// @access  Private
exports.createComment = async (req, res) => {
  try {
    const validatedUser = await VerifyToken(req, res).then(async (user) => {
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found",
        });
      }
      return user;
    });
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const user = validatedUser._id;
    //console.log(user)
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    const newComment = new CommentPost({
      text,
      user,
    });
    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();
    res.status(200).json({
      status: true,
      data: post,
      message: "Comment created successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   POST api/posts/:id/likes
// @desc    Create like
// @access  Private
exports.createLike = async (req, res) => {
  try {
    const validatedUser = await VerifyToken(req, res).then(async (user) => {
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found",
        });
      }
      return user;
    });
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const user = validatedUser._id;
    const { reaction } = req.body;
    const post = await Post.findById(req.params.id);
    const newLike = new LikePost({
      user,
      reaction,
    });
    await newLike.save();
    post.likes.push(newLike._id);
    await post.save();
    res.status(200).json({
      status: true,
      data: post,
      message: "Like created successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route Put api/posts/:id/likes/:likeId
// @desc Update like
// @access Private
exports.updateLike = async (req, res) => {
  try {
    const validatedUser = await VerifyToken(req, res).then(async (user) => {
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found",
        });
      }
      return user;
    });
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }

    const post = await Post.findById(req.params.id);
    const like = await LikePost.findById(req.params.likeId).where({
      user: validatedUser._id,
    });
    like.reaction = req.body.reaction;
    await like.save();
    res.status(200).json({
      status: true,
      data: post,
      message: "Like updated successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   DELETE api/posts/:id/likes/:likeId
// @desc    Delete like
// @access  Private
exports.deleteLike = async (req, res) => {
  try {
    const validatedUser = await VerifyToken(req, res).then(async (user) => {
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found",
        });
      }
      return user;
    });
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const post = await Post.findById(req.params.id);
    const like = await LikePost.findById(req.params.likeId).where({
      user: validatedUser._id,
    });
    await like.remove();
    post.likes.pull(like._id);
    await post.save();
    res.status(200).json({
      status: true,
      data: post,
      message: "Like deleted successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   PUT api/posts/:id/comment/:commentId
// @desc    Update comment
// @access  Private
exports.updateComment = async (req, res) => {
  try {
    const validatedUser = await VerifyToken(req, res).then(async (user) => {
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found",
        });
      }
      return user;
    });
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const post = await Post.findById(req.params.id);
    const comment = await CommentPost.findById(req.params.commentId).where({
      user: validatedUser._id,
    });
    comment.text = req.body.text;
    await comment.save();
    res.status(200).json({
      status: true,
      data: post,
      message: "Comment updated successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

// @route   DELETE api/posts/:id/comment/:commentId
// @desc    Delete comment
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const validatedUser = await VerifyToken(req, res).then(async (user) => {
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found",
        });
      }
      return user;
    });
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const post = await Post.findById(req.params.id);
    const comment = await CommentPost.findById(req.params.commentId).where({
      user: validatedUser._id,
    });
    await comment.remove();
    post.comments.pull(comment._id);
    await post.save();
    res.status(200).json({
      status: true,
      data: post,
      message: "Comment deleted successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};
