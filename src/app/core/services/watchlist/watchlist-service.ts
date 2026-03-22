import {inject, Injectable} from '@angular/core';
import {doc, Firestore, setDoc, serverTimestamp} from '@angular/fire/firestore';
import {AuthService} from '../auth/auth-service';

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(AuthService);
  private readonly collection = 'userWatchlist';

  async saveItem(tmdbId: number, mediaType: MediaType) {
    const userId = this.auth.user()?.uid;
    const documentId = `${userId}_${mediaType}_${tmdbId}`;
    const ref = doc(this.firestore, this.collection, documentId);

    await setDoc(ref, {
      userId: userId,
      tmdbId: tmdbId,
      mediaType: mediaType,
      createdAt: serverTimestamp()
    });
  }
}
