import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [playerAccount, setPlayerAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  // Synchronize state from localStorage
  const syncFromStorage = () => {
    try {
      const storedUser = localStorage.getItem('user');
      const savedPlayer = localStorage.getItem('player_account');

      let parsedUser = null;
      let parsedPlayer = null;

      if (storedUser) {
        try {
          parsedUser = JSON.parse(storedUser);
        } catch {}
      }

      if (savedPlayer) {
        try {
          parsedPlayer = JSON.parse(savedPlayer);
        } catch {}
      }

      // If playerAccount not explicit, try to resolve from user
      if (!parsedPlayer && parsedUser) {
        let pId = parsedUser.playerId || parsedUser.playerID;
        let sId = parsedUser.serverId || parsedUser.serverID;
        if (!pId && parsedUser.email) {
          const m = parsedUser.email.match(/^(\d+)_([^_@]+)@/);
          if (m) {
            pId = m[1];
            sId = m[2];
          }
        }
        if (!pId && parsedUser.name) {
          const m = parsedUser.name.match(/Player_(\d+)/i);
          if (m) {
            pId = m[1];
          }
        }
        if (pId) {
          parsedPlayer = {
            playerId: String(pId).trim(),
            serverId: String(sId || 'Global').trim(),
            realName: parsedUser.name || `Player_${pId}`,
          };
          try {
            localStorage.setItem('player_account', JSON.stringify(parsedPlayer));
          } catch {}
        }
      }

      setUser(parsedUser);
      setPlayerAccount(parsedPlayer);
    } catch (error) {
      console.warn('Error syncing auth state:', error);
    }
  };

  useEffect(() => {
    syncFromStorage();
    setLoading(false);

    // Cross-tab storage sync
    const handleStorageEvent = () => {
      syncFromStorage();
    };

    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, []);

  // Standard Admin / Email Login
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, ...userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  // Standard Register
  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register({ name, email, password });
      const { token, ...userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  // Dedicated Player Login (Instant global sync)
  const loginPlayer = (accountData, token, fullUserData) => {
    if (token) {
      localStorage.setItem('token', token);
    }
    const uData = fullUserData || {
      name: accountData.realName || `Player_${accountData.playerId}`,
      playerId: accountData.playerId,
      serverId: accountData.serverId,
      role: 'User',
    };
    localStorage.setItem('user', JSON.stringify(uData));
    localStorage.setItem('player_account', JSON.stringify(accountData));

    setUser(uData);
    setPlayerAccount(accountData);
  };

  // Instant global logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('player_account');
    setUser(null);
    setPlayerAccount(null);
  };

  // Update Profile (Syncs player_account, user, and backend)
  const updateProfile = async (updates) => {
    try {
      const pId = updates.playerId ?? playerAccount?.playerId ?? user?.playerId;
      const sId = updates.serverId ?? playerAccount?.serverId ?? user?.serverId ?? 'Global';
      const rName = updates.realName ?? updates.name ?? playerAccount?.realName ?? user?.name ?? `Player_${pId}`;

      const updatedUser = {
        ...(user || {}),
        name: rName,
        email: updates.email ?? user?.email,
        phone: updates.phone ?? user?.phone,
        avatar: updates.avatar ?? user?.avatar,
        playerId: pId,
        serverId: sId,
      };

      const updatedPlayer = {
        ...(playerAccount || {}),
        playerId: pId,
        serverId: sId,
        realName: rName,
        avatar: updates.avatar ?? playerAccount?.avatar ?? user?.avatar,
        phone: updates.phone ?? playerAccount?.phone ?? user?.phone,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('player_account', JSON.stringify(updatedPlayer));

      setUser(updatedUser);
      setPlayerAccount(updatedPlayer);

      // Attempt remote backend update if authenticated with token
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await authAPI.updateProfile({
            name: rName,
            email: updatedUser.email,
            password: updates.password || undefined,
            playerId: pId,
            serverId: sId,
            phoneNumber: updates.phone || undefined,
          });
        } catch (backendErr) {
          console.warn('Backend profile update note:', backendErr?.message);
        }
      }

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('player-login-success', { detail: updatedPlayer }));

      return { success: true };
    } catch (err) {
      console.error('Failed to update profile:', err);
      return { success: false, error: err.message };
    }
  };

  const isAuthenticated = () => {
    return !!user || !!playerAccount;
  };

  const isAdmin = () => {
    return user?.role?.toLowerCase() === 'admin';
  };

  const value = {
    user,
    setUser,
    playerAccount,
    setPlayerAccount,
    loading,
    login,
    register,
    loginPlayer,
    updateProfile,
    logout,
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
