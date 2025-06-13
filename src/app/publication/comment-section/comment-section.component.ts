import { Component, inject, Input, OnInit } from '@angular/core';
import { CommentService } from '../../_services/comment.service';
import { CommentModel } from '../../_models/commentModel';
import { CommonModule } from '@angular/common';
import { CommentCreateComponent } from "../comment-create/comment-create.component";
import { CreateCommentModel } from '../../_models/createCommentModel';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { PublicationModel } from '../../_models/publicationModel';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, CommentCreateComponent],
  templateUrl: './comment-section.component.html',
  styleUrl: './comment-section.component.css'
})
export class CommentSectionComponent implements OnInit {
  @Input() publicationId!: number;
  @Input() uniqueNameIdentifier!: string;
  private commentService = inject(CommentService);
  accountService = inject(AccountService);
  private toastr = inject(ToastrService); 
  currentUniqueName?: string;
  comments: CommentModel[] = [];
  isLoading = true;
  errorLoading = false;
  isOwner = false;

  ngOnInit(): void {
    this.currentUniqueName = this.accountService.currentUser()?.uniqueNameIdentifier;
    this.isOwner = this.currentUniqueName === this.uniqueNameIdentifier;
    this.loadComments();
  }

  loadComments(): void {
    this.isLoading = true;
    this.errorLoading = false;
    
    this.commentService.getCommentsByPublicationId(this.publicationId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorLoading = true;
        this.isLoading = false;
      }
    });
  }

  loadPublication(): void {

  }

  onCommentCreated(comment: CreateCommentModel): void {
    this.commentService.createComment(comment).subscribe({
      next: (newComment) => {
        this.comments = [newComment, ...this.comments]; // Add new comment at beginning
      },
      error: (err) => {
        // Handle error (could show toast message)
      }
    });
  }

  deleteComment(commentId: number): void {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c.id !== commentId);
        this.toastr.success('Comment deleted');
      },
      error: (err) => {
        this.toastr.error('Failed to delete comment');
      }
    });
  }

  isCommentOwner(uniqueNameIdentifier: string): boolean {
    return this.currentUniqueName === uniqueNameIdentifier;
  }

}
