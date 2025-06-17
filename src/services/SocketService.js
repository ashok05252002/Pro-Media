import { io } from "socket.io-client";

class SocketService {
  socket = null;

  connect() {
    if (!this.socket) {
      this.socket = io(import.meta.env.VITE_BASE_API_URL);  
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(userId) {
    if (this.socket) {
      this.socket.emit("join", userId);
    }
  }

  onNotification(callback) {
    if (this.socket) {
      this.socket.on("notification", callback);
    }
  }

  offNotification() {
    if (this.socket) {
      this.socket.off("notification");
    }
  }
}

const socketService = new SocketService();
export default socketService;
