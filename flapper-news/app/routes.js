var Post = require('./models/Posts');
var Comment = require('./models/Comments');

module.exports = function(app) {

  app.get('/posts', function(req, res, next) {
    Post.find(function(err, posts) {
      if (err) {
        return next(err);
      }

      res.json(posts);
    });
  });

  app.post('/posts', function(req, res, next) {
    var post = new Post(req.body);

    post.save(function(err, post) {
      if (err) {
        return next(err);
      }

      res.json(post);
    });
  });

  app.param('post', function(req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function(err, post) {
      if (err) {
        return next(err);
      }

      if (!post) {
        return next(new Error('can\'t find post'));
      }

      req.post = post;
      return next();
    });
  });

  app.get('/posts/:post', function(req, res) {
    res.json(req.post);
  });

  app.put('/posts/:post/upvote', function(req, res, next) {
    req.post.upvote(function(err, post) {
      if (err) {
        return next(err);
      }

      res.json(post);
    });
  });

  app.post('/posts/:post/comments', function(req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;

    comment.save(function(err, comment) {
      if (err) {
        return next(err);
      }

      req.post.comments.push(comment);
      req.post.save(function(err, post) {
        if (err) {
          return next(err);
        }

        res.json(comment);
      });
    });
  });

  app.get('/posts/:post', function(req, res, next) {
    req.post.populate('comments', function(err, post) {
      if (err) {
        return next(err);
      }

      res.json(post);
    });
  });

  app.param('comment', function(req, res, next, id) {
    var query = Comment.findById(id);

    query.exec(function(err, post) {
      if (err) {
        return next(err);
      }

      if (!post) {
        return next(new Error('can\'t find comment'));
      }

      req.comment = comment;
      return next();
    });
  });

  app.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
    req.comment.upvote(function(err, comment) {
      if (err) {
        return next(err);
      }

      res.json(comment);
    });
  });

  /* GET home page. */
  app.get('*', function(req, res) {
    res.sendfile('./public/views/index.html'); // load our public/index.html file
  });

};
