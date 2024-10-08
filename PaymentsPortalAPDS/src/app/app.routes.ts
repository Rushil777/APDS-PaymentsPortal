import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './Pages/layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';

export const routes: Routes = [

    {
        path:'',
        redirectTo: 'login', 
        pathMatch: 'full'
    },
    {
        path: 'login',  
        component: LoginComponent 
    },
    {
        path: '', 
        component: LayoutComponent,
        children:
        [
            {
                path: 'dashboard',
                component: DashboardComponent
            }
        ]
    },
    {
        path: '', 
        component: LayoutComponent,
        children:
        [
            {
                path: 'employee',
                component: EmployeeDashboardComponent
            }
        ]
    }
];
