import { Component, inject, OnInit } from '@angular/core';
import { PublicationService } from '../../_services/publication.service';
import { PublicationModel } from '../../_models/publicationModel';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { PublicationCardComponent } from "../publication-card/publication-card.component";
import { UpdatePublicationModel } from '../../_models/updatePublicationModel';

@Component({
  selector: 'app-publication-my-list',
  standalone: true,
  imports: [CommonModule, PublicationCardComponent],
  templateUrl: './publication-my-list.component.html',
  styleUrl: './publication-my-list.component.css'
})
export class PublicationMyListComponent implements OnInit{
  private publicationService = inject(PublicationService);
  private accountService = inject(AccountService);
  private toastr = inject(ToastrService);
  publications: PublicationModel[] = [];
  isLoading = true;
  isLoadingMore = false;
  currentPage = 1;
  pageSize = 10;
  hasMorePublications = true;

  ngOnInit(): void {
    this.publicationService.getPublications(this.accountService.currentUser()?.uniqueNameIdentifier!).subscribe({
      next: (publications) => {
        this.publications = publications;
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Failed to load publications', error.message);
        this.isLoading = false;
      }
    })
  }

  onUpdatePublication(publication: UpdatePublicationModel) {
    this.publicationService.updatePublication(publication).subscribe({
      next: (updatedPublication) => {
        const index = this.publications.findIndex(p => p.id === updatedPublication.id);
        if (index !== -1) {
          this.publications[index] = updatedPublication;
          this.toastr.success('Publication updated successfully');
        } else {
          this.toastr.error('Publication not found');
        }
      },
      error: (error) => {
        this.toastr.error('Failed to update publication', error.message);
      }
    })
  }

  onDeletePublication(publicationId: number){
    this.publicationService.deletePublication(publicationId).subscribe({
      next: () => {
        this.publications = this.publications.filter(p => p.id !== publicationId);
        this.toastr.success('Publication deleted successfully');
      },
      error: (error) => {
        this.toastr.error('Failed to delete publication', error.message);
      }
    })
  }

  onLikePublication(publicationId: number){
    this.publicationService.likePublication(publicationId).subscribe({
      next: (likeResponse) => {
        const publication = this.publications.find(p => p.id === publicationId);
        if (publication) {
          publication.likesAmount = likeResponse.amountOfLikes;
          publication.isLikedByCurrentUser = likeResponse.isLikedByCurrentUser;
        }
      },
      error: (error) => {
        this.toastr.error('Failed to like publication', error.message);
      }
    })
  }
}
