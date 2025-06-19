import { Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs'
import { CreatePublicationComponent } from "../../publication/create-publication/create-publication.component";
import { PublicationMyListComponent } from "../../publication/publication-my-list/publication-my-list.component";
import { AccountService } from '../../_services/account.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-tabs',
  standalone: true,
  imports: [MatTabsModule, CreatePublicationComponent, PublicationMyListComponent],
  templateUrl: './profile-tabs.component.html',
  styleUrl: './profile-tabs.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ProfileTabsComponent implements OnInit {
  accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  uniqueNameIdentifier: string = '';
  isOwner: boolean = false;

  @ViewChild(PublicationMyListComponent) publicationList!: PublicationMyListComponent;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.uniqueNameIdentifier = params['uniqueNameIdentifier'];
      this.isOwner = this.accountService.currentUser()?.uniqueNameIdentifier === this.uniqueNameIdentifier;
    });
  }

  refreshPublications(): void {
    if (this.publicationList) {
      this.publicationList.loadPublications(this.uniqueNameIdentifier);
    }
  }
}
