import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('../app/pages/login/login.module').then(m => m.LoginPageModule),
    canActivate: [LoginGuard]

  },
  // {
  //   path: 'all',
  //   loadChildren: () => import('../pages/hello/hello.module').then(m => m.HelloPageModule),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'invoice',
  //   loadChildren: () => import('./pages/invoice/invoice.module').then(m => m.InvoicePageModule),
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'pos',
    loadChildren: () => import('./pages/pos/pos.module').then(m => m.PosPageModule),
     canActivate: [AuthGuard]
  },
  {
    path: 'all-invoice',
    loadChildren: () => import('./pages/invoice-list/invoice-list.module').then(m => m.InvoiceListPageModule),
     canActivate: [AuthGuard]
  },
  {
    path: 'invoice-details/:id',
    loadChildren: () => import('./pages/invoice-details/invoice-details.module').then(m => m.InvoiceDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule),
    // canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
