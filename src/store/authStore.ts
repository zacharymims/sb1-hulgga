import { create } from 'zustand';
import { AuthState, User, PLAN_LIMITS } from '../types/auth';
import { auth, db } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  increment,
  serverTimestamp
} from 'firebase/firestore';

interface AuthStore extends AuthState {
  signUp: (email: string, password: string, plan: User['plan']) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  incrementUsage: () => Promise<boolean>;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: true,
  error: null,

  signUp: async (email: string, password: string, plan: User['plan']) => {
    try {
      set({ loading: true, error: null });
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        plan,
        usageThisMonth: 0,
        lastUsageReset: new Date()
      };

      // Create user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...newUser,
        createdAt: serverTimestamp(),
        lastUsageReset: serverTimestamp()
      });

      set({ user: newUser, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign up', 
        loading: false 
      });
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      // If user document doesn't exist, create it
      if (!userDoc.exists()) {
        const newUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          plan: 'basic',
          usageThisMonth: 0,
          lastUsageReset: new Date()
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), {
          ...newUser,
          createdAt: serverTimestamp(),
          lastUsageReset: serverTimestamp()
        });

        set({ user: newUser, loading: false });
        return;
      }

      const userData = userDoc.data() as User;
      
      // Check if we need to reset monthly usage
      const lastReset = userData.lastUsageReset instanceof Date 
        ? userData.lastUsageReset 
        : new Date(userData.lastUsageReset);
      
      const now = new Date();
      if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          usageThisMonth: 0,
          lastUsageReset: serverTimestamp()
        });
        userData.usageThisMonth = 0;
        userData.lastUsageReset = now;
      }

      set({ user: userData, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign in', 
        loading: false 
      });
      throw error;
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null, loading: false, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign out', 
        loading: false 
      });
      throw error;
    }
  },

  incrementUsage: async () => {
    const { user } = get();
    if (!user) return false;

    const limit = PLAN_LIMITS[user.plan];
    if (user.usageThisMonth >= limit) {
      set({ error: 'Monthly usage limit reached' });
      return false;
    }

    try {
      await updateDoc(doc(db, 'users', user.id), {
        usageThisMonth: increment(1)
      });

      set(state => ({
        user: state.user ? {
          ...state.user,
          usageThisMonth: state.user.usageThisMonth + 1
        } : null
      }));

      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update usage' 
      });
      return false;
    }
  },

  setError: (error) => set({ error })
}));