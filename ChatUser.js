/** Functionality related to chatting. */

// Room is an abstraction of a chat channel
const Room = require("./Room");

// Get joke if requested
const getJoke = require("./jokes");

/** ChatUser is a individual connection from client -> server to chat. */

class ChatUser {
  /** make chat: store connection-device, rooom */

  constructor(send, roomName) {
    this._send = send; // "send" function for this user
    this.room = Room.get(roomName); // room user will be in
    this.name = null; // becomes the username of the visitor

    console.log(`created chat in ${this.room.name}`);
  }

  /** send msgs to this client using underlying connection-send-function */

  send(data) {
    try {
      this._send(data);
    } catch {
      // If trying to send to a user fails, ignore it
    }
  }

  /** handle joining: replace spaces in name with dashes,
   * add to room members, announce join */

  handleJoin(name) {
    const validName = name.split(" ").join("-");
    this.name = validName;
    this.room.join(this);
    this.room.broadcast({
      type: "note",
      text: `${this.name} joined "${this.room.name}".`,
    });
  }

  /** handle a chat: broadcast to room. */

  handleChat(text) {
    this.room.broadcast({
      name: this.name,
      type: "chat",
      text: text,
    });
  }

  /** handle joke request */

  handleJoke() {
    this.send(
      JSON.stringify({
        name: "Server",
        type: "chat",
        text: getJoke(),
      })
    );
  }

  /** send list of room members */
  sendMemberList() {
    const memberNameList = [...this.room.members].map((m) => m.name);
    const memberString = memberNameList.join(", ");
    this.send(
      JSON.stringify({
        type: "note",
        text: `In room: ${memberString}`,
      })
    );
  }

  /** message shows for sender and recipient only
   *  Note: if more than one room member with same name, can't specify who gets message
   */

  sendPrivateMsg(recipientName, text) {
    try {
      const recipient = [...this.room.members].filter(
        (m) => m.name === recipientName
      )[0];
      const data = JSON.stringify({
        name: this.name,
        type: "chat",
        text: `(to ${recipientName} only): ${text}`,
      });
      recipient.send(data);
      this.send(data);
    } catch {
      // if recipient doesn't exist or other error, do nothing
    }
  }

  /** Handle messages from client:
   *
   * - {type: "join", name: username} : join
   * - {type: "chat", text: msg }     : chat
   * - {type: "joke"} : send joke
   * - {type: "members"} : send member list
   * - {type: "priv"} : send private message
   */

  handleMessage(jsonData) {
    let msg = JSON.parse(jsonData);

    if (msg.type === "join") this.handleJoin(msg.name);
    else if (msg.type === "chat") this.handleChat(msg.text);
    else if (msg.type === "joke") this.handleJoke();
    else if (msg.type === "members") this.sendMemberList();
    else if (msg.type === "priv") this.sendPrivateMsg(msg.member, msg.text);
    else throw new Error(`bad message: ${msg.type}`);
  }

  /** Connection was closed: leave room, announce exit to others */

  handleClose() {
    this.room.leave(this);
    this.room.broadcast({
      type: "note",
      text: `${this.name} left ${this.room.name}.`,
    });
  }
}

module.exports = ChatUser;
