import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MemberModel } from '../_models/memberModel';
import { environment } from '../../environments/environment';
import { UpdateMemberModel } from '../_models/updateMemberModel';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  
  getMemberByUniqueNameIdentifier(uNI: string) {
    return this.http.get<MemberModel>(this.baseUrl + '/member/by-uni', { params: { uNI } })
  }

  getMyProfile(){
    return this.http.get<MemberModel>(this.baseUrl + '/member/my-profile');
  }

  getOtherProfile(uniqueNameIdentifier: string){
    return this.http.get<MemberModel>(this.baseUrl + `/member/other-user-profile`, { params: { uniqueNameIdentifier } });
  }

  searchForUser(searchQuery: string){
    return this.http.get<MemberModel[]>(this.baseUrl + '/member/user-search', { params: { searchQuery } });
  }

  updateMember(model: UpdateMemberModel){
  const formData = new FormData();
  formData.append('Id', model.id.toString());
  formData.append('Username', model.username);
  formData.append('UniqueNameIdentifier', model.uniqueNameIdentifier);
  formData.append('JoinedAt', model.joinedAt);
  
  if (model.profileImage) {
    formData.append('ProfileImage', model.profileImage);
  }

  return this.http.put<MemberModel>(this.baseUrl + '/member/edit', formData);
  }

  constructor() { }
}
