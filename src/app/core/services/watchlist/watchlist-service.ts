import {inject, Injectable} from '@angular/core';
import {
  doc,
  Firestore,
  setDoc,
  serverTimestamp,
  query,
  getDoc,
  deleteDoc,
  where,
  collection,
  getDocs
} from '@angular/fire/firestore';
import {AuthService} from '../auth/auth-service';
import {MediaType, WatchlistItem} from '../../../shared/models/UserData';

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(AuthService);
  private readonly collection = 'user_watchlist';

  async getUserWatchlist(): Promise<WatchlistItem[]>{
    try{
      const userId = this.auth.user()?.uid;
      if(!userId){
        return [];
      }
      const q = query(
        collection(this.firestore,this.collection),
        where('userId','==',userId)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as WatchlistItem);

    }catch(error){
      console.error('Error getting all watchlist items', error);
      return [];
    }
  }

  async saveItem(tmdbId: number, mediaType: MediaType) {
    try{
      const userId = this.auth.user()?.uid;
      const documentId = `${userId}_${mediaType}_${tmdbId}`;
      const ref = doc(this.firestore, this.collection, documentId);

      await setDoc(ref, {
        userId: userId,
        tmdbId: tmdbId,
        mediaType: mediaType,
        createdAt: serverTimestamp()
      });
    }catch(error){
      console.error('Error addingToWatchlist', error)
    }
  }

  async deleteItem(tmdbId: number, mediaType: MediaType){
    try{
      const userId = this.auth.user()?.uid;
      const documentId = `${userId}_${mediaType}_${tmdbId}`;
      const ref = doc(this.firestore, this.collection, documentId);

      await deleteDoc(ref);
    }catch(error){
      console.error('Error deleting item', error)
    }
  }

  async isItemInUserWatchlist(tmdbId: number, mediaType: MediaType){
    try{
      const userId = this.auth.user()?.uid;
      const documentId = `${userId}_${mediaType}_${tmdbId}`;

      const ref = doc(this.firestore, this.collection, documentId);
      const snapshot = await getDoc(ref);
      return snapshot.exists();
    }catch(error){
      return false;
    }
  }
}
