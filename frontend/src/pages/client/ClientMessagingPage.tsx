import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Send,
  MoreVertical,
  User,
  MessageSquare,
  Phone,
  Video,
  Info,
  Paperclip,
  Smile,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConversations, useMessages, useSendMessage, useMarkAsRead } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';

export const ClientMessagingPage = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations } = useConversations();
  const { data: messages } = useMessages(selectedChat || '');
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages) {
      scrollToBottom();
      const unreadMessages = messages.filter(m => !m.read && m.senderId !== user?.id);
      unreadMessages.forEach(m => markAsRead.mutate(m.id));
    }
  }, [messages, user?.id]);

  const handleSend = async () => {
    if (!messageText.trim() || !selectedChat) return;
    try {
      await sendMessage.mutateAsync({ receiverId: selectedChat, content: messageText });
      setMessageText('');
    } catch (e) {
      alert('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const activeConversation = conversations?.find(c => c.userId === selectedChat);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-160px)]">
        <div className="card-geometric h-full flex overflow-hidden bg-white border-slate-200">
          {/* Chat List */}
          <aside className="w-80 lg:w-96 border-r border-slate-100 flex flex-col bg-white shrink-0">
            <header className="p-6 border-b border-slate-100 space-y-4">
              <h2 className="text-xl font-black text-slate-950">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search chats..." 
                  className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-kefit-primary/20 placeholder:text-slate-400 font-bold"
                />
              </div>
            </header>
            
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {conversations?.map((chat) => (
                <button
                  key={chat.userId}
                  onClick={() => setSelectedChat(chat.userId)}
                  className={cn(
                    "w-full p-6 flex gap-4 text-left transition-all hover:bg-slate-50",
                    selectedChat === chat.userId ? "bg-kefit-primary/5 border-l-4 border-l-kefit-primary" : "border-l-4 border-l-transparent"
                  )}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black">
                      {chat.userAvatar || chat.userName.substring(0, 2).toUpperCase()}
                    </div>
                    {chat.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-black text-slate-930 truncate">{chat.userName}</h4>
                      <span className="text-[10px] font-bold text-slate-400">{chat.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-kefit-primary font-black uppercase tracking-widest mb-1">Freelancer</p>
                    <p className="text-xs text-slate-500 truncate font-medium">{chat.lastMessage}</p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-kefit-primary rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0">
                      {chat.unreadCount}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </aside>

{/* Chat Window */}
          {selectedChat !== null && activeConversation ? (
            <main className="flex-1 flex flex-col bg-white">
              {/* Chat Header */}
              <header className="p-4 lg:p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black">
                    {activeConversation.userAvatar || activeConversation.userName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-950 flex items-center gap-2">
                       {activeConversation.userName}
                       <ShieldCheck className="w-4 h-4 text-blue-500 fill-current" />
                    </h3>
                    <p className="text-xs font-black text-kefit-primary uppercase tracking-[0.1em]">{activeConversation.online ? 'Online' : 'Away'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-slate-950 transition-colors hidden sm:block">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-950 transition-colors hidden sm:block">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-950 transition-colors">
                    <Info className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-950 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </header>

              {/* Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
                <div className="flex flex-col items-center justify-center py-8">
                  <span className="px-4 py-1.5 bg-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                    Conversation started
                  </span>
                </div>

                {messages?.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-4 max-w-2xl",
                      message.senderId === user?.id ? "flex-row-reverse ml-auto items-end" : ""
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0",
                      message.senderId === user?.id ? "bg-kefit-primary text-white" : "bg-slate-100 text-slate-400"
                    )}>
                      {message.senderId === user?.id ? user?.name?.substring(0, 2).toUpperCase() : activeConversation.userName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="space-y-2">
                      <div className={cn(
                        "p-4 rounded-2xl shadow-sm",
                        message.senderId === user?.id
                          ? "bg-kefit-primary text-white rounded-tr-none"
                          : "bg-white border border-slate-100 rounded-tl-none"
                      )}>
                        <p className="text-sm font-medium leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold text-slate-400 ml-1",
                        message.senderId === user?.id && "mr-1 text-right"
                      )}>
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {message.senderId === user?.id && message.read && ' • Read'}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <footer className="p-4 lg:p-6 border-t border-slate-100 bg-white">
                <div className="flex gap-4 p-2 bg-slate-50 border border-slate-100 rounded-[1.5rem] items-end focus-within:ring-2 focus-within:ring-kefit-primary/20 focus-within:border-kefit-primary/20 transition-all">
                   <div className="flex items-center gap-1 mb-1">
                      <button className="p-2 text-slate-400 hover:text-kefit-primary transition-colors">
                        <Paperclip className="w-5 h-5" />
                      </button>
                   </div>
                   <textarea
                     placeholder="Type a message..."
                     rows={1}
                     value={messageText}
                     onChange={(e) => setMessageText(e.target.value)}
                     onKeyPress={handleKeyPress}
                     className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 font-medium resize-none max-h-32 py-2"
                   />
                   <div className="flex items-center gap-2 mb-1 mr-1">
                      <button className="p-2 text-slate-400 hover:text-kefit-primary transition-colors">
                        <Smile className="w-5 h-5" />
                      </button>
                      <Button
                        size="sm"
                        onClick={handleSend}
                        disabled={!messageText.trim()}
                        isLoading={sendMessage.isPending}
                        className="h-10 w-10 p-0 rounded-xl"
                        leftIcon={<Send className="w-5 h-5 ml-1" />}
                      />
                   </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">
                  <Zap className="w-3 h-3 text-kefit-primary" />
                  Kefit Direct messaging - Encrypted and secure
                </div>
              </footer>
            </main>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-10 h-10" />
              </div>
              <div>
                <p className="text-slate-900 font-bold text-lg text-slate-900">Your Communication Hub</p>
                <p className="max-w-xs text-sm mt-1">Select a chat to start discussing projects with top freelancers.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
