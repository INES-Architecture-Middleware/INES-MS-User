import UserService from "../services/UserService.js";

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async create(req, res) {
    try {
      const user = await this.userService.createUser(req, res);
      //   res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ code: "BadRequest", message: error.message });
    }
  }

  async login(req, res) {
    try {
      const token = await this.userService.login(req.body);
      res.status(200).json({ token });
    } catch (error) {
      res
        .status(400)
        .json({ code: "InvalidCredentials", message: error.message });
    }
  }

  async logout(req, res) {
    // Implement logout logic if needed (e.g., invalidate token)
    res.status(200).send("User logged out successfully");
  }

  async getUserById(req, res) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ code: "NotFound", message: error.message });
    }
  }

  async findOne(req, res) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) res.status(400).send("User not found");
      res.json(user);
    } catch (error) {
      res.status(400).json({ code: "BadRequest", message: error.message });
    }
  }

  async update(req, res) {
    try {
      await this.userService.updateUser(req.params.id, req.body);
      res.status(200).send("User updated successfully");
    } catch (error) {
      res.status(400).json({ code: "BadRequest", message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await this.userService.deleteUser(req.params.id);
      res.status(200).send("User deleted successfully");
    } catch (error) {
      res.status(404).json({ code: "NotFound", message: error.message });
    }
  }
}

export {UserController};
