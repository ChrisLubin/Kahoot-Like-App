import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InitialComponent } from './components/initial/initial.component';
import { JoinGameComponent } from './components/join-game/join-game.component';
import { GameService } from './services/game.service';
import { CreateGameComponent } from './components/create-game/create-game.component';
import { JoinedGameComponent } from './components/joined-game/joined-game.component';
import { CreatedGameComponent } from './components/created-game/created-game.component';

@NgModule({
  declarations: [
    AppComponent,
    InitialComponent,
    CreateGameComponent,
    JoinGameComponent,
    JoinedGameComponent,
    CreatedGameComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    GameService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
