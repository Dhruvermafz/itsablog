import clubService from "./club.service.js";
class ClubController {
  async createClub(req, res, next) {
    try {
      const club = await clubService.createClub(req.body, req.user.id);
      res.status(201).json({ success: true, data: club });
    } catch (err) {
      next(err);
    }
  }

  async getClubs(req, res, next) {
    try {
      const result = await clubService.getClubs(req.query);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async getClub(req, res, next) {
    try {
      const club = await clubService.getClubById(req.params.id);
      if (!club) return res.status(404).json({ message: "Club not found" });
      res.json({ success: true, data: club });
    } catch (err) {
      next(err);
    }
  }

  async joinClub(req, res, next) {
    try {
      const result = await clubService.joinClub(req.params.id, req.user.id);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // Posts
  async createPost(req, res, next) {
    try {
      const post = await clubService.createPost(
        req.params.clubId,
        req.user.id,
        req.body,
      );
      res.status(201).json({ success: true, data: post });
    } catch (err) {
      next(err);
    }
  }

  async getClubPosts(req, res, next) {
    try {
      const posts = await clubService.getClubPosts(
        req.params.clubId,
        req.query,
      );
      res.json({ success: true, data: posts });
    } catch (err) {
      next(err);
    }
  }

  async toggleLike(req, res, next) {
    try {
      const result = await clubService.toggleLike(
        req.params.postId,
        req.user.id,
      );
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async createComment(req, res, next) {
    try {
      const comment = await clubService.createComment(
        req.params.postId,
        req.user.id,
        req.body.content,
        req.body.parent,
      );
      res.status(201).json({ success: true, data: comment });
    } catch (err) {
      next(err);
    }
  }

  async getPostComments(req, res, next) {
    try {
      const comments = await clubService.getPostComments(
        req.params.postId,
        req.query,
      );
      res.json({ success: true, data: comments });
    } catch (err) {
      next(err);
    }
  }
}

export default new ClubController();
