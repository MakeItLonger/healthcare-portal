import { Component } from '@angular/core';
import { NewsService } from '../../../core/services/news.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-news-block',
  templateUrl: './news-block.component.html',
  styleUrls: ['./news-block.component.scss'],
})
export class NewsBlockComponent {
  constructor(private news: NewsService) {}

  news$ = this.news.getLimitedNews(4).pipe(map((res) => res.news));
}
