import userService from "./user.service.js";
class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await userService.getUserProfile(req.params.username);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateProfile(req.user.id, req.body);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  // Follow
  async follow(req, res, next) {
    try {
      const result = await userService.followUser(
        req.user.id,
        req.params.userId,
      );
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async unfollow(req, res, next) {
    try {
      const result = await userService.unfollowUser(
        req.user.id,
        req.params.userId,
      );
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async getFollowers(req, res, next) {
    try {
      const result = await userService.getFollowers(
        req.params.userId,
        req.query,
      );
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async getFollowing(req, res, next) {
    try {
      const result = await userService.getFollowing(
        req.params.userId,
        req.query,
      );
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // Reading Logs
  async upsertReadingLog(req, res, next) {
    try {
      const log = await userService.createOrUpdateReadingLog(
        req.user.id,
        req.params.bookId,
        req.body,
      );
      res.json({ success: true, data: log });
    } catch (err) {
      next(err);
    }
  }

  async getReadingLogs(req, res, next) {
    try {
      const logs = await userService.getUserReadingLogs(req.user.id, req.query);
      res.json({ success: true, data: logs });
    } catch (err) {
      next(err);
    }
  }

  async addLogEntry(req, res, next) {
    try {
      const entry = await userService.addLogEntry(
        req.params.logId,
        req.user.id,
        req.body,
      );
      res.status(201).json({ success: true, data: entry });
    } catch (err) {
      next(err);
    }
  }

  async getLogEntries(req, res, next) {
    try {
      const entries = await userService.getLogEntries(
        req.params.logId,
        req.query,
      );
      res.json({ success: true, data: entries });
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
