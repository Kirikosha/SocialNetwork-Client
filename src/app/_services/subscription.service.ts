import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { MemberModel } from '../_models/memberModel';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getSubscriptionCount() {
    return this.http.get<number>(this.baseUrl + '/subscription/subscriptions-count');
  }

  getFollowerCount() {
    return this.http.get<number>(this.baseUrl + '/subscription/followers-count');
  }

  getSubscriptions(){
    return this.http.get<MemberModel[]>(this.baseUrl + '/subscription/subscriptions');
  }

  getFollowers(){
    return this.http.get<MemberModel[]>(this.baseUrl + '/subscription/followers');
  }

  subscribe(uniqueNameIdentifier: string){
    return this.http.post(this.baseUrl + '/subscription/subscribe', uniqueNameIdentifier);
  }

  unsubscribe(uniqueNameIdentifier: string){
    return this.http.post(this.baseUrl + '/subscription/unsubscribe', uniqueNameIdentifier);
  }

  isFollowing(uniqueNameIdentifier: string) {
    return this.http.post<boolean>(this.baseUrl + '/subscription/is-following', uniqueNameIdentifier);
  }
  constructor() { }
}
