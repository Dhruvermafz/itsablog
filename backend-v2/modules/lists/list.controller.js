import listService from "./list.service.js";
class ListController {
  async createList(req, res, next) {
    try {
      const list = await listService.createList(req.user.id, req.body);
      res.status(201).json({ success: true, data: list });
    } catch (err) {
      next(err);
    }
  }

  async getLists(req, res, next) {
    try {
      const result = await listService.getLists(req.query);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async getUserLists(req, res, next) {
    try {
      const lists = await listService.getUserLists(
        req.params.userId || req.user.id,
        req.query,
      );
      res.json({ success: true, data: lists });
    } catch (err) {
      next(err);
    }
  }

  async getList(req, res, next) {
    try {
      const list = await listService.getListById(req.params.id);
      if (!list) {
        return res.status(404).json({
          success: false,
          message: "List not found",
        });
      }
      res.json({ success: true, data: list });
    } catch (err) {
      next(err);
    }
  }

  async updateList(req, res, next) {
    try {
      const list = await listService.updateList(
        req.params.id,
        req.user.id,
        req.body,
      );
      res.json({ success: true, data: list });
    } catch (err) {
      next(err);
    }
  }

  async deleteList(req, res, next) {
    try {
      const result = await listService.deleteList(req.params.id, req.user.id);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // ====================== List Items ======================
  async addItem(req, res, next) {
    try {
      const item = await listService.addItemToList(
        req.params.listId,
        req.user.id,
        req.body.bookId,
        req.body.note,
      );
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }

  async removeItem(req, res, next) {
    try {
      const result = await listService.removeItemFromList(
        req.params.listId,
        req.user.id,
        req.params.bookId,
      );
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async getListItems(req, res, next) {
    try {
      const items = await listService.getListItems(
        req.params.listId,
        req.query,
      );
      res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  }

  // ====================== Like ======================
  async toggleLike(req, res, next) {
    try {
      const result = await listService.toggleLike(
        req.params.listId,
        req.user.id,
      );
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
}

export default new ListController();
