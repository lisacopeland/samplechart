import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { WeatherService } from './weather.service';
import { Chart } from 'chart.js';
/**
 * This is the root of the app
 *
 * @export
 * @class AppComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef;
  public context: CanvasRenderingContext2D;
  title = 'app';
  doughnutChart = [];
  weatherChart = [];
  lineChart = [];

  constructor(private weatherService: WeatherService,
      private cd: ChangeDetectorRef) {}

/**
 * Method that runs on the initialization of the app. Executes the methods that
 * create the three graphs.
 *
 * @memberof AppComponent
 */
ngOnInit() {
    this.createDoughnutChart();
    this.createLineGraph();
    this.weatherService.dailyForecast()
      .subscribe(res => {
        console.log(res);
        this.createWeatherChart(res);

      });
  }

  ngAfterViewInit() {

    // this.cd.detectChanges();
  }
/**
 * Create the doughnut graph
 *
 * @memberof AppComponent
 */
createDoughnutChart() {

      const dataNumbers = [20, 50, 30];
      const dataLabels = [
        'Orange Kitty',
        'Maggy',
        'Birdy'
      ];

      this.context = (<HTMLCanvasElement>this.canvas.nativeElement).getContext('2d');
      this.canvas.nativeElement.height = 163;
      this.canvas.nativeElement.width = 845;
      this.doughnutChart = new Chart('doughnutCanvas', {
          type: 'doughnut',
          data: {
            labels: dataLabels,
            datasets: [
              {
              label: 'Colors',
              backgroundColor: ['#ff0000', '#0000cc', '#ffff00'],
              data: dataNumbers
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: true
            },
            title: {
                display: true,
                text: 'Doughnut chart'
            },
          }
      });

  }
/**
 * Create the line graph
 *
 * @memberof AppComponent
 */
createLineGraph() {
      const dataLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      const dataNumbers = [];
      for (let i = 0; i < 12; i++) {
        dataNumbers.push(Math.floor((Math.random() * 100) + 1));
      }

      this.lineChart = new Chart('lineCanvas', {
          type: 'line',
          data: {
            labels: dataLabels,
            datasets: [
              {
              label: 'Temperature',
              data: dataNumbers,
              borderColor: '#ffff00',
              fill: false,
              lineTension: 0
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: true
            },
            title: {
                display: true,
                text: 'Line Graph'
            },
          }
      });

  }

/**
 * Create the weather chart
 * This graph is interesting because it has three lines instead of one. This is super
 * important to know.
 *
 * @param {*} res
 * @memberof AppComponent
 */
createWeatherChart(res) {
    const temp_max = res['list'].map(x => x.main.temp_max);
    const temp_min = res['list'].map(x => x.main.temp_min);
    const temp_avg = res['list'].map(x => x.main.temp);
    const alldates = res['list'].map(x => x.dt);

    const weatherDates = [];
    alldates.forEach((x) => {
        const jsdate = new Date(x * 1000);
        weatherDates.push(jsdate.toLocaleTimeString('en', { year: 'numeric', month: 'short', day: 'numeric' }));
    });
    this.weatherChart = new Chart('weatherCanvas', {
      type: 'line',
      data: {
        labels: weatherDates,
        datasets: [
          {
            label: 'Maximum Temperature',
            data: temp_max,
            borderColor: '#3cba9f',
            fill: false
          },
          {
            label: 'Minimum Temperature',
            data: temp_min,
            borderColor: '#ffcc00',
            fill: false
          },
          {
            label: 'Minimum Temperature',
            data: temp_avg,
            borderColor: '#ff3399',
            fill: false
          },
        ]
      },
      options: {
        legend: {
          display: true
        },
        title: {
          display: true,
          text: 'Chart with Data from API'
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
  }

}
