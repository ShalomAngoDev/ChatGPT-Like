const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/users.json');

function loadUsers() {
  return JSON.parse(fs.readFileSync(dataPath));
}

function saveUsers(users) {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
}

module.exports = {
  Query: {
    login: (_, { username, password }) => {
      const users = loadUsers();
      return users.find(u => u.username === username && u.password === password) || null;
    },
    getConversations: (_, { userId }) => {
      const users = loadUsers();
      const user = users.find(u => u.id === userId);
      return user?.conversations || [];
    }
  },
  Mutation: {
    sendMessage: (_, { userId, text }) => {
      const users = loadUsers();
      const user = users.find(u => u.id === userId);
      if (!user) return null;

      const conversation = user.conversations[0];
      conversation.messages.push({ from: "user", text });
      conversation.messages.push({ from: "bot", text: "Je suis une IA simplifiée 👋" });

      saveUsers(users);
      return conversation;
    }
  }
};
