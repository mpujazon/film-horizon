import {inject, Injectable} from '@angular/core';
import {doc, Firestore, setDoc, serverTimestamp, query, getDoc} from '@angular/fire/firestore';
import {AuthService} from '../auth/auth-service';
import {MediaType} from '../../../shared/models/UserData';

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(AuthService);
  private readonly collection = 'user_watchlist';

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

  async isItemInUserWatchlist(tmdbId: number, mediaType: MediaType){
    try{
      const userId = this.auth.user()?.uid;
      const documentId = `${userId}_${mediaType}_${tmdbId}`;

      const ref = doc(this.firestore, this.collection, documentId);
      const snapshot = await getDoc(ref);
      return snapshot.exists();
    }catch(error){
      console.error("Error getting item status on watchlist", error);
      return false;
    }
  }
}
