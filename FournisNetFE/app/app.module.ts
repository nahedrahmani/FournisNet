import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader, TRANSLATE_HTTP_LOADER_CONFIG } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

// Auth
import { AuthInterceptor } from './services/auth.interceptor';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { PieceComponent } from './components/piece/piece.component';
import { FournisseurComponent } from './components/fournisseur/fournisseur.component';
import { CarbookComponent } from './components/carbook/carbook.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { CarsComponent } from './pages/cars/cars.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AdminTreeComponent } from './admin-tree/admin-tree.component';
import { AdminNodeComponent } from './admin-node/admin-node.component';
import { ProduitSingleComponent } from './pages/produit-single/produit-single.component';
import { ProduitAdminComponent } from './produit-admin/produit-admin.component';
import { FournisseurAdminComponent } from './fournisseur-admin/fournisseur-admin.component';
import { ArborescenceComponent } from './components/arborescence/arborescence.component';
import { CategorieAdminComponent } from './categorie-admin/categorie-admin.component';
import { ProduitNodeComponent } from './components/produit-node/produit-node.component';
import { StockToastComponent } from './components/stock-toast/stock-toast.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PieceComponent,
    FournisseurComponent,
    CarbookComponent,
    HomeComponent,
    AboutComponent,
    PricingComponent,
    CarsComponent,
    BlogComponent,
    ContactComponent,
    AdminTreeComponent,
    AdminNodeComponent,
    ProduitSingleComponent,
    ProduitAdminComponent,
    FournisseurAdminComponent,
    ArborescenceComponent,
    CategorieAdminComponent,
    ProduitNodeComponent,
    StockToastComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      fallbackLang: 'fr',
      loader: { provide: TranslateLoader, useClass: TranslateHttpLoader }
    }),
    TableModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: TRANSLATE_HTTP_LOADER_CONFIG, useValue: { prefix: './assets/i18n/', suffix: '.json' } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
