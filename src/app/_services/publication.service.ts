import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreatePublicationModel } from '../_models/createPublicationModel';
import { PublicationModel } from '../_models/publicationModel';
import { UpdatePublicationModel } from '../_models/updatePublicationModel';
import { LikeModel } from '../_models/likeModel';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;

createPublication(publicationModel: CreatePublicationModel) {
  const formData = new FormData();
  
  // Append all simple fields
  formData.append('Content', publicationModel.content);
  formData.append('PublicationType', publicationModel.publicationType);
  
  if (publicationModel.remindAt) {
    formData.append('RemindAt', publicationModel.remindAt.toISOString());
  }
  
  // Append each image file
  if (publicationModel.images) {
    publicationModel.images.forEach((image, index) => {
      formData.append(`Images`, image, image.name);
    });
  }
  
  return this.http.post(this.baseUrl + '/publication/create-publication', formData);
}

getPublications(uniqueNameIdentifier: string) {
  return this.http.get<PublicationModel[]>(this.baseUrl + '/publication/publication-of-' + uniqueNameIdentifier);
}

updatePublication(publicationModel: UpdatePublicationModel){
  return this.http.put<PublicationModel>(this.baseUrl + '/publication/update-publication', publicationModel);
}

deletePublication(publicationId: number){
  return this.http.delete(this.baseUrl + `/publication/${publicationId}`); 
}

likePublication(publicationId: number){
  return this.http.get<LikeModel>(this.baseUrl + `/publication/like/${publicationId}`);
}
  constructor() { }
}
