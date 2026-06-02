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
  Zap,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversations, useMessages, useSendMessage, useMarkAsRead } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';

export const MessagesPage = () => {
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
        <div className="card-geometric h-full flex overflow-hidden bg-white border-slate-200 shadow-2xl">
          {/* Chat List */}
          <aside className={cn(
             "w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col bg-white shrink-0 transition-all",
             selectedChat !== null ? "hidden md:flex" : "flex"
          )}>
            <header className="p-6 border-b border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                 <h2 className="text-xl font-black text-slate-950">Inbox</h2>
                 <Button variant="ghost" size="sm" className="p-2"><MoreVertical className="w-4 h-4" /></Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search conversations..." 
                  className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-kefit-primary/20 placeholder:text-slate-400 font-bold"
                />
              </div>
            </header>
            
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50 pb-20 md:pb-0">
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
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-kefit-primary font-black shadow-lg">
                      {chat.userAvatar || chat.userName.substring(0, 2).toUpperCase()}
                    </div>
                    {chat.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-black text-slate-930 truncate tracking-tight">{chat.userName}</h4>
                      <span className="text-[10px] font-bold text-slate-400">{chat.lastMessageTime}</span>
                    </div>
                    <p className="text-[9px] text-kefit-primary font-black uppercase tracking-[0.2em] mb-1">Client</p>
                    <p className="text-xs text-slate-500 truncate font-medium leading-relaxed">{chat.lastMessage}</p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-kefit-primary rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 mt-1">
                      {chat.unreadCount}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </aside>

{/* Chat Window */}
          {selectedChat !== null && activeConversation ? (
            <main className="flex-1 flex flex-col bg-white overflow-hidden">
              {/* Chat Header */}
              <header className="p-4 lg:p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden p-2 text-slate-400 hover:text-slate-950"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-kefit-primary font-black shadow-lg">
                    {activeConversation.userAvatar || activeConversation.userName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-950 flex items-center gap-2 tracking-tight">
                       {activeConversation.userName}
                       <ShieldCheck className="w-4 h-4 text-emerald-500 fill-current" />
                    </h3>
                    <div className="flex items-center gap-1.5">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 scale-100 animate-pulse" />
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{activeConversation.online ? 'Active Now' : 'Last seen 2h ago'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-3 text-slate-400 hover:text-slate-950 transition-colors hidden sm:block">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-3 text-slate-400 hover:text-slate-950 transition-colors">
                    <Info className="w-5 h-5" />
                  </button>
                </div>
              </header>

              {/* Messages Area */}
              <div className="flex-1 p-6 lg:p-10 overflow-y-auto space-y-8 bg-slate-50/50">
                <div className="flex flex-col items-center justify-center py-10 opacity-30">
                   <div className="h-px w-32 bg-slate-300 mb-6" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                      Conversation Started
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
                      "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 shadow-lg",
                      message.senderId === user?.id ? "bg-kefit-primary text-white" : "bg-slate-950 text-kefit-primary"
                    )}>
                      {message.senderId === user?.id ? user?.name?.substring(0, 2).toUpperCase() : activeConversation.userName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="space-y-2">
                      <div className={cn(
                        "p-6 rounded-[2rem] shadow-sm",
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
              <footer className="p-6 lg:p-8 border-t border-slate-100 bg-white">
                <div className="flex gap-4 p-3 bg-slate-50 border border-slate-100 rounded-[2rem] items-end focus-within:ring-4 focus-within:ring-kefit-primary/10 focus-within:border-kefit-primary/20 transition-all">
                   <div className="flex items-center gap-1 mb-1 ml-1">
                      <button className="p-3 text-slate-400 hover:text-kefit-primary transition-colors hover:bg-white rounded-xl">
                        <Paperclip className="w-5 h-5" />
                      </button>
                   </div>
                   <textarea
                     placeholder="Type your reply..."
                     rows={1}
                     value={messageText}
                     onChange={(e) => setMessageText(e.target.value)}
                     onKeyPress={handleKeyPress}
                     className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 font-medium resize-none max-h-32 py-3 text-base"
                   />
                   <div className="flex items-center gap-2 mb-1 mr-1">
                      <button className="p-3 text-slate-400 hover:text-kefit-primary transition-colors hover:bg-white rounded-xl hidden sm:block">
                        <Smile className="w-5 h-5" />
                      </button>
                      <Button
                        size="sm"
                        onClick={handleSend}
                        disabled={!messageText.trim()}
                        isLoading={sendMessage.isPending}
                        className="h-12 w-12 p-0 rounded-2xl bg-slate-950 shadow-xl flex items-center justify-center shrink-0"
                      >
                         <Send className="w-5 h-5 text-white ml-0.5" />
                      </Button>
                   </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Kefit Secure Messenger - Protected by Escrow
                </div>
              </footer>
            </main>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 text-slate-400 text-center p-10">
              <div className="w-32 h-32 bg-white rounded-[3rem] border border-slate-100 flex items-center justify-center text-slate-200 shadow-xl mb-8 relative">
                <MessageSquare className="w-12 h-12" />
                <div className="absolute top-6 right-6 w-3 h-3 bg-kefit-primary rounded-full animate-ping" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your Control Center</h3>
                <p className="max-w-xs text-sm font-medium leading-relaxed text-slate-500 mx-auto">
                   Select a project conversation to view your message history and coordinate with clients.
                </p>
                <div className="pt-4">
                   <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-kefit-primary">Browse Jobs</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
