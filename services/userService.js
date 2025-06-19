import jwt from 'jsonwebtoken';

class UserService {
  constructor() {
    this.users = [];
    this.secretKey = process.env.JWT_SECRET || "fallback-secret-token-for-dev";
  }

  createUser(username, password) {
    const newUser = {
      username,
      password,
    };
    this.users.push(newUser);
    return newUser;
  }

  validateCredentials(username, password) {
    const user = this.users.find(
      (user) => user.username === username && user.password === password
    );
    return user || null;
  }

  generateToken(user) {
    const token = jwt.sign(
      { id: user.id, username: user.username },
      this.secretKey,
      { expiresIn: "1h" }
    );
    return token;
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.secretKey);
      return decoded;
    } catch (error) {
      return null;
    }
  }

  getUserById(id) {
    return this.users.find((user) => user.id === id);
  }

  updateUser(id, username, password) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = { id, username, password };
      return this.users[userIndex];
    }
    return null;
  }

  deleteUser(id) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      return true;
    }
    return false;
  }
}

export default UserService;
