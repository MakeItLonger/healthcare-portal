import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { News } from 'src/app/core/models/news.model';
import { NewsService } from 'src/app/core/services/news.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
@Component({
  selector: 'app-news-edit',
  templateUrl: './news-edit.component.html',
  styleUrls: ['./news-edit.component.scss'],
})
export class NewsEditComponent implements OnInit {
  newsForm!: FormGroup;
  file!: File | null;

  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private newsService: NewsService,
    private dialogRef: MatDialogRef<NewsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.newsForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      picture: ['', this.getAvatarValidators()],
      display: ['', this.getAvatarValidators()],
    });
    this.newsForm.patchValue(this.data);
  }

  handleFileInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const file = files[0];

    this.file = file;

    this.newsForm.patchValue({ display: file.name });
  }

  getAvatarValidators(): ValidatorFn[] {
    if (this.data) {
      return [];
    } else {
      return [Validators.required];
    }
  }

  onFormSubmit() {
    if (this.newsForm.valid) {
      this.isLoading$.next(true);
      const newsData = new FormData();
      newsData.append('title', this.newsForm.value.title);
      newsData.append('content', this.newsForm.value.content);
      if (this.file) {
        newsData.append('picture', this.file, this.file.name);
      }

      if (this.data) {
        this.newsService.editNews(this.data._id, newsData).subscribe({
          next: (news: News) => {
            this.isLoading$.next(false);
            this.snackBarService.openSnackBar(
              `Article ${news.title} has been updated successfully`,
              'ok'
            );
            this.dialogRef.close(true);
          },
          error: (err: HttpErrorResponse) => {
            console.error(err);
          },
        });
      } else {
        this.newsService.addNews(newsData).subscribe({
          next: (news: News) => {
            this.snackBarService.openSnackBar(
              `Article ${news.title} has been added successfully`,
              'ok'
            );
            this.file = null;
            this.dialogRef.close(true);
          },
          error: (err: HttpErrorResponse) => {
            this.file = null;
            this.dialogRef.close(true);
            console.error(err);
          },
        });
      }
    }
  }

  onCancelForm() {
    this.dialogRef.close();
  }
}
