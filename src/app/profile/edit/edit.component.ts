import { Component, inject, OnInit } from '@angular/core';
import { MemberService } from '../../_services/member.service';
import { ToastrService } from 'ngx-toastr';
import { MemberModel } from '../../_models/memberModel';
import { UpdateMemberModel } from '../../_models/updateMemberModel';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../_services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
  private memberService = inject(MemberService);
  private accountService = inject(AccountService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  
  memberModel!: MemberModel;
  editForm!: FormGroup;
  profileImagePreview?: string;
  isLoading = false;

  ngOnInit(): void {
    this.initializeForm();
    this.loadMember();
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]+$/) // Alphanumeric and underscores only
      ]],
      uniqueNameIdentifier: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]+$/) // Alphanumeric and underscores only
      ]],
      profileImage: [null]
    });
  }

  loadMember(): void {
    this.memberService.getMyProfile().subscribe({
      next: (member) => {
        this.memberModel = member;
        this.editForm.patchValue({
          username: member.username,
          uniqueNameIdentifier: member.uniqueNameIdentifier
        });
        if (member.profileImage?.imageUrl) {
          this.profileImagePreview = member.profileImage.imageUrl;
        }
      },
      error: (err) => {
        this.toastr.error(err.error);
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length === 1) {
      const file = input.files[0];
      this.editForm.patchValue({ profileImage: file });
      this.editForm.get('profileImage')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.editForm.invalid) return;

    this.isLoading = true;

    const updateModel: UpdateMemberModel = {
      id: this.memberModel.id,
      username: this.editForm.value.username,
      uniqueNameIdentifier: this.editForm.value.uniqueNameIdentifier,
      joinedAt: this.memberModel.joinedAt,
      profileImage: this.editForm.value.profileImage,
      blocked: this.memberModel.blocked
    };

    this.memberService.updateMember(updateModel).subscribe({
      next: () => {
        this.toastr.success('Profile updated successfully');
        this.isLoading = false;
        this.loadMember(); // Refresh data
        this.accountService.updateProfile({
          username: updateModel.username,
          uniqueNameIdentifier: updateModel.uniqueNameIdentifier,
          token: '',
          role: '',
          blocked: this.memberModel.blocked
        })
        this.router.navigate(['/profile', updateModel.uniqueNameIdentifier]);

      },
      error: (err) => {
        this.toastr.error('Failed to update profile', err.message);
        this.isLoading = false;
      }
    });
  }

  get username() { return this.editForm.get('username'); }
  get uniqueNameIdentifier() { return this.editForm.get('uniqueNameIdentifier'); }
}