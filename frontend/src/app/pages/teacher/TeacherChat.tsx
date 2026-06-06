import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { Send, Paperclip, Search, Plus, X } from "lucide-react";
import api from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";

interface Message {
  id: string;
  content: string;
  sender_id: string | number;
  sender_name: string;
  created_at: string;
  sender?: { id: number; first_name: string; last_name: string };
}

interface Room {
  id: string;
  name: string;
  is_group: boolean;
  participants: any[];
  updated_at: string;
}

export function TeacherChat() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
  const [creating, setCreating] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetchRooms();
    fetchStudents();
    return () => {
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchRooms = async () => {
    try {
      setIsLoadingRooms(true);
      const res = await api.get('/chat/rooms/');
      const data = res.data.results || res.data || [];
      setRooms(data);
      if (data.length > 0 && !selectedRoom) {
        selectRoom(data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch chat rooms", err);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get('/users/?role=student');
      setStudents(res.data.results || res.data || []);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

  const fetchMessages = async (roomId: string) => {
    try {
      setIsLoadingMessages(true);
      const res = await api.get(`/chat/messages/?room=${roomId}`);
      setMessages(res.data.results || res.data || []);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const connectWebSocket = useCallback((roomId: string) => {
    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    const wsUrl = `ws://localhost:8000/ws/chat/${roomId}/?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log(`Connected to chat room: ${roomId}`);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chat_message') {
        const newMsg: Message = {
          id: data.message_id,
          content: data.message,
          sender_id: data.sender_id,
          sender_name: data.sender_name,
          created_at: data.created_at,
        };
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = (e) => {
      console.log(`WebSocket closed: ${e.code} ${e.reason}`);
    };
  }, [token]);

  const selectRoom = (room: Room) => {
    setSelectedRoom(room);
    setMessages([]);
    fetchMessages(room.id);
    connectWebSocket(room.id);
  };

  const sendMessage = () => {
    if (!messageText.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      // Fallback: try REST if WS not connected
      if (messageText.trim() && selectedRoom) {
        api.post('/chat/messages/', {
          room: selectedRoom.id,
          content: messageText.trim(),
        }).then(() => {
          setMessageText("");
          fetchMessages(selectedRoom.id);
        });
      }
      return;
    }

    wsRef.current.send(JSON.stringify({ message: messageText.trim() }));
    setMessageText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim() || selectedParticipants.length === 0) return;
    setCreating(true);
    try {
      const res = await api.post('/chat/rooms/', {
        name: newRoomName,
        is_group: selectedParticipants.length > 1,
        participants: [...selectedParticipants, user?.id],
      });
      setShowCreateRoom(false);
      setNewRoomName("");
      setSelectedParticipants([]);
      fetchRooms();
      selectRoom(res.data);
    } catch (err) {
      console.error("Failed to create room", err);
    } finally {
      setCreating(false);
    }
  };

  const getRoomName = (room: Room) => {
    if (room.name) return room.name;
    // For 1-on-1 chats, show the other participant's name
    const other = room.participants?.find((p) => p.id !== user?.id);
    return other ? `${other.first_name} ${other.last_name}` : "Chat";
  };

  const getRoomInitials = (room: Room) => {
    const name = getRoomName(room);
    return name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const isMyMessage = (msg: Message) => {
    return String(msg.sender_id) === String(user?.id) ||
      String(msg.sender?.id) === String(user?.id);
  };

  const filteredRooms = rooms.filter((r) =>
    getRoomName(r).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-[calc(100vh-180px)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Left Panel - Rooms List */}
        <div className="lg:col-span-1 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-bold">Chat Rooms</h2>
              <button
                onClick={() => setShowCreateRoom(!showCreateRoom)}
                className="p-1.5 rounded-lg bg-orange-500/15 text-orange-400 hover:bg-orange-500/25 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 text-sm"
              />
            </div>
          </div>

          {/* Create Room Form */}
          {showCreateRoom && (
            <div className="p-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white text-sm font-semibold">New Chat</span>
                <button onClick={() => setShowCreateRoom(false)}>
                  <X className="w-4 h-4 text-white/50" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Room name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="w-full px-3 py-2 bg-white/[0.05] border border-white/15 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 text-sm mb-2"
              />
              <div className="max-h-32 overflow-y-auto space-y-1 mb-2">
                {students.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-white/[0.05]">
                    <input
                      type="checkbox"
                      className="rounded accent-orange-500"
                      checked={selectedParticipants.includes(s.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedParticipants([...selectedParticipants, s.id]);
                        } else {
                          setSelectedParticipants(selectedParticipants.filter((id) => id !== s.id));
                        }
                      }}
                    />
                    <span className="text-white/70 text-xs">{s.first_name} {s.last_name}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={handleCreateRoom}
                disabled={creating}
                className="w-full py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #FF5C00, #FF3A00)" }}
              >
                {creating ? "Creating..." : "Create Chat"}
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {isLoadingRooms ? (
              <div className="text-center py-10 text-white/50 text-sm">Loading rooms...</div>
            ) : filteredRooms.length === 0 ? (
              <div className="text-center py-10 text-white/50 text-sm">
                No chat rooms yet. Create one with the + button!
              </div>
            ) : (
              filteredRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => selectRoom(room)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    selectedRoom?.id === room.id
                      ? "bg-orange-500/15 border border-orange-500/30"
                      : "bg-white/[0.03] hover:bg-white/[0.06] border border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      room.is_group
                        ? 'bg-blue-500'
                        : 'bg-gradient-to-br from-orange-500 to-red-600'
                    }`}>
                      {getRoomInitials(room)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate text-sm">{getRoomName(room)}</div>
                      <div className="text-white/40 text-xs">
                        {room.is_group ? `${room.participants?.length || 0} members` : 'Direct Message'}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Chat Window */}
        <div className="lg:col-span-2 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          {selectedRoom ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    selectedRoom.is_group ? 'bg-blue-500' : 'bg-gradient-to-br from-orange-500 to-red-600'
                  }`}>
                    {getRoomInitials(selectedRoom)}
                  </div>
                  <div>
                    <div className="text-white font-bold">{getRoomName(selectedRoom)}</div>
                    <div className="text-white/40 text-sm">
                      {selectedRoom.is_group
                        ? `${selectedRoom.participants?.length || 0} participants`
                        : 'Direct Message'} • Live
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {isLoadingMessages ? (
                  <div className="text-center py-10 text-white/50 text-sm">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-10 text-white/50 text-sm">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const mine = isMyMessage(msg);
                    return (
                      <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        {!mine && (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-2 mt-1 shrink-0">
                            {(msg.sender_name || msg.sender?.first_name || 'U')[0].toUpperCase()}
                          </div>
                        )}
                        <div className="max-w-[70%]">
                          {!mine && (
                            <div className="text-white/40 text-xs mb-1 ml-1">
                              {msg.sender_name || `${msg.sender?.first_name} ${msg.sender?.last_name}`}
                            </div>
                          )}
                          <div className={`rounded-2xl p-3 ${
                            mine
                              ? 'bg-orange-500/20 border border-orange-500/30 rounded-tr-sm'
                              : 'bg-white/[0.06] border border-white/10 rounded-tl-sm'
                          }`}>
                            <p className={`text-sm ${mine ? 'text-white/90' : 'text-white/80'}`}>
                              {msg.content}
                            </p>
                            <div className={`text-xs mt-1 ${mine ? 'text-white/30 text-right' : 'text-white/30'}`}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10 shrink-0">
                <div className="flex gap-2">
                  <button className="p-2 text-white/70 hover:text-white transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message... (Enter to send)"
                    className="flex-1 px-4 py-2 bg-white/[0.05] border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!messageText.trim()}
                    className="p-2 rounded-xl disabled:opacity-40 transition-opacity"
                    style={{ background: "linear-gradient(135deg, #FF5C00, #FF3A00)" }}
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/40">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Select a chat room to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Missing import fix
function MessageSquare({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  );
}
