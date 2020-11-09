import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { DragDropModule } from '@angular/cdk/drag-drop';

// Angular Material Components
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './pages/login/login.component';
import { BikesComponent } from './pages/tables/bikes/bikes.component';
import { GraphQLModule } from './graphql.module';
import { ParticipantsComponent } from './pages/tables/participants/participants.component';
import { LendingStationsComponent } from './pages/tables/lending-stations/lending-stations.component';
import { TableOverviewComponent } from './pages/table-overview/table-overview.component';
import { CellComponent } from './components/tableComponents/cell/cell.component';
import { MenuListItemComponent } from './components/menu-list-item/menu-list-item.component';
import { NavService }from './components/menu-list-item/nav.service';

@NgModule({
  declarations: [
    AppComponent,
    MenuListItemComponent,
    LoginComponent,
    BikesComponent,
    ParticipantsComponent,
    LendingStationsComponent,
    TableOverviewComponent,
    CellComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatGridListModule,
    MatInputModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCheckboxModule,
    GraphQLModule,
    DragDropModule,
  ],
  providers: [NavService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
