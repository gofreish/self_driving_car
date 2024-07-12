import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DrivingCarComponent } from './self_driving_car/index.component';
import { MapComponent } from './map/map.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        DrivingCarComponent,
        MapComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular';
}
