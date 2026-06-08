import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { CarbookComponent } from './components/carbook/carbook.component';
import { CarsComponent } from './pages/cars/cars.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { BlogComponent } from './pages/blog/blog.component';
import { FournisseurComponent } from './components/fournisseur/fournisseur.component';
import { PieceComponent } from './components/piece/piece.component';
import { AdminNodeComponent } from './admin-node/admin-node.component';
import { AdminTreeComponent } from './admin-tree/admin-tree.component';
import { ProduitSingleComponent } from './pages/produit-single/produit-single.component';
import { ProduitAdminComponent } from './produit-admin/produit-admin.component';
import { FournisseurAdminComponent } from './fournisseur-admin/fournisseur-admin.component';
import { ArborescenceComponent } from './components/arborescence/arborescence.component';
import { CategorieAdminComponent } from './categorie-admin/categorie-admin.component';

const routes: Routes = [
  // Public
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Protected
  { path: 'home',              component: HomeComponent,              canActivate: [AuthGuard] },
  { path: 'carbook',           component: CarbookComponent,           canActivate: [AuthGuard] },
  { path: 'pieces',            component: CarsComponent,              canActivate: [AuthGuard] },
  { path: 'contact',           component: ContactComponent,           canActivate: [AuthGuard] },
  { path: 'about',             component: AboutComponent,             canActivate: [AuthGuard] },
  { path: 'pricing',           component: PricingComponent,           canActivate: [AuthGuard] },
  { path: 'blog',              component: BlogComponent,              canActivate: [AuthGuard] },
  { path: 'fournisseur',       component: FournisseurComponent,       canActivate: [AuthGuard] },
  { path: 'piece',             component: PieceComponent,             canActivate: [AuthGuard] },
  { path: 'produit-single',    component: ProduitSingleComponent,     canActivate: [AuthGuard] },
  { path: 'AdminNode',         component: AdminNodeComponent,         canActivate: [AuthGuard] },
  { path: 'AdminTree',         component: AdminTreeComponent,         canActivate: [AuthGuard] },
  { path: 'produit-admin',     component: ProduitAdminComponent,      canActivate: [AuthGuard] },
  { path: 'fournisseur-admin', component: FournisseurAdminComponent,  canActivate: [AuthGuard] },
  { path: 'arbo',              component: ArborescenceComponent,      canActivate: [AuthGuard] },
  { path: 'categories',        component: CategorieAdminComponent,    canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
