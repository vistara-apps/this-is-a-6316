import { userService, dreamService, supabase } from './supabase.js';
import { encryptDreamEntry, decryptDreamEntry, encryptEmail, decryptEmail } from './encryption.js';
import { generateDreamInterpretation, analyzeDreamPatterns } from './openai.js';
import toast from 'react-hot-toast';

/**
 * Centralized data service that handles all data operations
 * with encryption, fallback to localStorage, and error handling
 */
class DataService {
  constructor() {
    this.isOnline = supabase !== null;
    this.localStorageKeys = {
      user: 'dreamweaver_user',
      dreamEntries: 'dreamweaver_dreams',
      settings: 'dreamweaver_settings'
    };
  }

  // User Management
  async createUser(userData) {
    try {
      if (this.isOnline) {
        const encryptedUserData = {
          ...userData,
          email: encryptEmail(userData.email)
        };
        
        const user = await userService.createUser(encryptedUserData);
        
        if (user) {
          const decryptedUser = {
            ...user,
            email: decryptEmail(user.email)
          };
          
          localStorage.setItem(this.localStorageKeys.user, JSON.stringify(decryptedUser));
          return decryptedUser;
        }
      }
      
      // Fallback to localStorage
      const localUser = {
        ...userData,
        user_id: `local_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem(this.localStorageKeys.user, JSON.stringify(localUser));
      return localUser;
      
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user account');
      throw error;
    }
  }

  async getUserByPrivyId(privyUserId) {
    try {
      if (this.isOnline) {
        const user = await userService.getUserByPrivyId(privyUserId);
        
        if (user) {
          const decryptedUser = {
            ...user,
            email: decryptEmail(user.email)
          };
          
          localStorage.setItem(this.localStorageKeys.user, JSON.stringify(decryptedUser));
          return decryptedUser;
        }
      }
      
      // Fallback to localStorage
      const localUser = localStorage.getItem(this.localStorageKeys.user);
      return localUser ? JSON.parse(localUser) : null;
      
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  async updateUser(userId, updates) {
    try {
      if (this.isOnline) {
        const encryptedUpdates = {
          ...updates,
          ...(updates.email && { email: encryptEmail(updates.email) })
        };
        
        const user = await userService.updateUser(userId, encryptedUpdates);
        
        if (user) {
          const decryptedUser = {
            ...user,
            email: decryptEmail(user.email)
          };
          
          localStorage.setItem(this.localStorageKeys.user, JSON.stringify(decryptedUser));
          return decryptedUser;
        }
      }
      
      // Fallback to localStorage
      const localUser = JSON.parse(localStorage.getItem(this.localStorageKeys.user) || '{}');
      const updatedUser = {
        ...localUser,
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem(this.localStorageKeys.user, JSON.stringify(updatedUser));
      return updatedUser;
      
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user information');
      throw error;
    }
  }

  // Dream Entry Management
  async createDreamEntry(dreamEntry, userId) {
    try {
      const entryWithId = {
        ...dreamEntry,
        dream_entry_id: `dream_${Date.now()}`,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (this.isOnline) {
        const encryptedEntry = encryptDreamEntry(entryWithId);
        const savedEntry = await dreamService.createDreamEntry(encryptedEntry);
        
        if (savedEntry) {
          const decryptedEntry = decryptDreamEntry(savedEntry);
          this.updateLocalDreamEntries(decryptedEntry, 'add');
          toast.success('Dream entry saved securely');
          return decryptedEntry;
        }
      }
      
      // Fallback to localStorage
      this.updateLocalDreamEntries(entryWithId, 'add');
      toast.success('Dream entry saved locally');
      return entryWithId;
      
    } catch (error) {
      console.error('Error creating dream entry:', error);
      toast.error('Failed to save dream entry');
      throw error;
    }
  }

  async getDreamEntries(userId, limit = 50, offset = 0) {
    try {
      if (this.isOnline) {
        const encryptedEntries = await dreamService.getDreamEntries(userId, limit, offset);
        
        if (encryptedEntries && encryptedEntries.length > 0) {
          const decryptedEntries = encryptedEntries.map(entry => decryptDreamEntry(entry));
          
          // Update local storage with latest data
          localStorage.setItem(this.localStorageKeys.dreamEntries, JSON.stringify(decryptedEntries));
          return decryptedEntries;
        }
      }
      
      // Fallback to localStorage
      const localEntries = localStorage.getItem(this.localStorageKeys.dreamEntries);
      const entries = localEntries ? JSON.parse(localEntries) : [];
      
      // Apply pagination to local data
      return entries.slice(offset, offset + limit);
      
    } catch (error) {
      console.error('Error fetching dream entries:', error);
      
      // Return local data on error
      const localEntries = localStorage.getItem(this.localStorageKeys.dreamEntries);
      return localEntries ? JSON.parse(localEntries) : [];
    }
  }

  async updateDreamEntry(dreamEntryId, updates) {
    try {
      const updatedEntry = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      if (this.isOnline) {
        const encryptedUpdates = encryptDreamEntry(updatedEntry);
        const savedEntry = await dreamService.updateDreamEntry(dreamEntryId, encryptedUpdates);
        
        if (savedEntry) {
          const decryptedEntry = decryptDreamEntry(savedEntry);
          this.updateLocalDreamEntries(decryptedEntry, 'update');
          toast.success('Dream entry updated');
          return decryptedEntry;
        }
      }
      
      // Fallback to localStorage
      this.updateLocalDreamEntries({ ...updatedEntry, dream_entry_id: dreamEntryId }, 'update');
      toast.success('Dream entry updated locally');
      return updatedEntry;
      
    } catch (error) {
      console.error('Error updating dream entry:', error);
      toast.error('Failed to update dream entry');
      throw error;
    }
  }

  async deleteDreamEntry(dreamEntryId) {
    try {
      if (this.isOnline) {
        await dreamService.deleteDreamEntry(dreamEntryId);
      }
      
      // Always remove from local storage
      this.updateLocalDreamEntries({ dream_entry_id: dreamEntryId }, 'delete');
      toast.success('Dream entry deleted');
      return true;
      
    } catch (error) {
      console.error('Error deleting dream entry:', error);
      toast.error('Failed to delete dream entry');
      throw error;
    }
  }

  // AI Services
  async generateInterpretation(dreamText, emotions = [], tags = []) {
    try {
      const interpretation = await generateDreamInterpretation(dreamText, emotions, tags);
      return interpretation;
    } catch (error) {
      console.error('Error generating interpretation:', error);
      toast.error('Failed to generate interpretation');
      throw error;
    }
  }

  async analyzePatterns(dreamEntries) {
    try {
      const analysis = await analyzeDreamPatterns(dreamEntries);
      return analysis;
    } catch (error) {
      console.error('Error analyzing patterns:', error);
      toast.error('Failed to analyze dream patterns');
      throw error;
    }
  }

  // Local Storage Helpers
  updateLocalDreamEntries(entry, operation) {
    const localEntries = JSON.parse(localStorage.getItem(this.localStorageKeys.dreamEntries) || '[]');
    
    switch (operation) {
      case 'add':
        localEntries.unshift(entry);
        break;
        
      case 'update':
        const updateIndex = localEntries.findIndex(e => e.dream_entry_id === entry.dream_entry_id);
        if (updateIndex !== -1) {
          localEntries[updateIndex] = { ...localEntries[updateIndex], ...entry };
        }
        break;
        
      case 'delete':
        const filteredEntries = localEntries.filter(e => e.dream_entry_id !== entry.dream_entry_id);
        localStorage.setItem(this.localStorageKeys.dreamEntries, JSON.stringify(filteredEntries));
        return;
    }
    
    localStorage.setItem(this.localStorageKeys.dreamEntries, JSON.stringify(localEntries));
  }

  // Data Export
  async exportUserData(userId) {
    try {
      const user = JSON.parse(localStorage.getItem(this.localStorageKeys.user) || '{}');
      const dreamEntries = await this.getDreamEntries(userId);
      
      const exportData = {
        user: {
          ...user,
          email: user.email // Already decrypted in local storage
        },
        dreamEntries: dreamEntries.map(entry => ({
          ...entry,
          // Ensure all sensitive data is decrypted for export
          dreamText: entry.dreamText,
          interpretation: entry.interpretation,
          tags: entry.tags,
          emotions: entry.emotions
        })),
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dreamweaver-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully');
      return true;
      
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
      throw error;
    }
  }

  // Data Sync
  async syncData(userId) {
    if (!this.isOnline) {
      toast.error('Cannot sync data - no internet connection');
      return false;
    }

    try {
      // Sync dream entries
      const localEntries = JSON.parse(localStorage.getItem(this.localStorageKeys.dreamEntries) || '[]');
      const remoteEntries = await this.getDreamEntries(userId);
      
      // Simple sync strategy: remote data takes precedence
      if (remoteEntries.length > localEntries.length) {
        localStorage.setItem(this.localStorageKeys.dreamEntries, JSON.stringify(remoteEntries));
        toast.success('Data synced from cloud');
      }
      
      return true;
    } catch (error) {
      console.error('Error syncing data:', error);
      toast.error('Failed to sync data');
      return false;
    }
  }

  // Utility Methods
  clearLocalData() {
    Object.values(this.localStorageKeys).forEach(key => {
      localStorage.removeItem(key);
    });
    toast.success('Local data cleared');
  }

  getConnectionStatus() {
    return this.isOnline;
  }
}

// Export singleton instance
export const dataService = new DataService();
