import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../../../../core/models/article.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { News } from 'src/app/core/models/news.model';

@Component({
  selector: 'app-news-article',
  templateUrl: './news-article.component.html',
  styleUrls: ['./news-article.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('0.5s', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('0.5s', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class NewsArticleComponent implements OnInit {
  @Input() article!: News;

  opened: boolean = false;

  toggleSize() {
    this.opened = !this.opened;
  }

  getMonth(date: string) {
    let newDate = new Date(date);
    return newDate.toLocaleString('default', { month: 'long' });
  }
  getDate(date: string) {
    let newDate = new Date(date);
    return newDate.getUTCDate();
  }

  ngOnInit(): void {
    console.log(this.article);
  }
}
