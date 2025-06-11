import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { EditComponent } from './profile/edit/edit.component';
import { PublicationPageComponent } from './publication/publication-page/publication-page.component';

export const routes: Routes = [
    {path: 'login', component:LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'myProfile', component: ProfileComponent},
    {path: 'edit-profile', component: EditComponent},
    {path: 'publication/:id', component: PublicationPageComponent}
       ];
