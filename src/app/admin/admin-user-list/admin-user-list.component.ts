import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { AdminUserModel } from '../../_models/adminUserModel';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-user-list.component.html',
  styleUrl: './admin-user-list.component.css'
})
export class AdminUserListComponent implements OnInit {
  private adminService = inject(AdminService);
  private toastr = inject(ToastrService);
  
  users: AdminUserModel[] = [];
  isLoading = false;
  searchTerm = '';
  currentSort = 'username';
  isAscending = true;

  ngOnInit(): void {
    this.loadUsers(); 
  }

  loadUsers() {
    this.isLoading = true;
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to load users', 'Error');
        this.isLoading = false;
      }
    });
  }

  onBlockUser(userId: number) {
    this.adminService.blockUser(userId).subscribe({
      next: () => {
        this.toastr.success('User blocked successfully');
        this.updateUserStatus(userId, true);
      },
      error: (err) => {
        this.toastr.error('Failed to block user', 'Error');
      }
    });
  }

  onUnblockUser(userId: number) {
    this.adminService.unblockUser(userId).subscribe({
      next: () => {
        this.toastr.success('User unblocked successfully');
        this.updateUserStatus(userId, false);
      },
      error: (err) => {
        this.toastr.error('Failed to unblock user', 'Error');
      }
    });
  }

  private updateUserStatus(userId: number, isBlocked: boolean) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.blocked = isBlocked;
      user.blockedAt = isBlocked ? new Date() : undefined;
    }
  }

  sortUsers(column: string) {
    if (this.currentSort === column) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSort = column;
      this.isAscending = true;
    }

    this.users.sort((a, b) => {
      const valA = a[column as keyof AdminUserModel];
      const valB = b[column as keyof AdminUserModel];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.isAscending 
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        return this.isAscending ? valA - valB : valB - valA;
      } else if (valA instanceof Date && valB instanceof Date) {
        return this.isAscending 
          ? valA.getTime() - valB.getTime()
          : valB.getTime() - valA.getTime();
      }
      return 0;
    });
  }

  get filteredUsers() {
    if (!this.searchTerm) return this.users;
    
    return this.users.filter(user => 
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.uniqueNameIdentifier.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
