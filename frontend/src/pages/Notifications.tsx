import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Bell, Check, Trash2, Info, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  status: string;
  createdAt: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.data || []);
    } catch (err) { console.error(err);
    } finally { setLoading(false); }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, status: 'READ' } : n));
    } catch (err) { console.error(err); }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, status: 'READ' })));
    } catch (err) { console.error(err); }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) { console.error(err); }
  };

  const getTypeIcon = (type: string) => {
    const map: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
      INFO: { icon: <Info className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-100' },
      WARNING: { icon: <AlertTriangle className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-100' },
      ERROR: { icon: <AlertCircle className="w-5 h-5" />, color: 'text-red-600', bg: 'bg-red-100' },
      SUCCESS: { icon: <CheckCircle className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
      AUDIT_ASSIGNED: { icon: <Bell className="w-5 h-5" />, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    };
    return map[type] || map.INFO;
  };

  const unreadCount = notifications.filter(n => n.status === 'UNREAD').length;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="page-title">Notifications</h1>
            <p className="page-subtitle">Stay updated with system alerts</p>
          </div>
          {unreadCount > 0 && (
            <span className="badge-danger text-sm px-3 py-1">{unreadCount} unread</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn-secondary">
            <Check className="w-5 h-5" /> Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 w-full rounded-xl" />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Bell className="empty-state-icon" />
            <h3 className="empty-state-title">No notifications</h3>
            <p className="empty-state-text">You're all caught up! Notifications will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const typeStyle = getTypeIcon(notification.type);
            return (
              <div
                key={notification._id}
                className={`card p-5 transition-all duration-200 ${
                  notification.status === 'UNREAD'
                    ? 'border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-50/30 to-white'
                    : 'opacity-75'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${typeStyle.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className={typeStyle.color}>{typeStyle.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
                      {notification.status === 'UNREAD' && (
                        <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {notification.status === 'UNREAD' && (
                      <button onClick={() => markAsRead(notification._id)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Mark as read">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => deleteNotification(notification._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
