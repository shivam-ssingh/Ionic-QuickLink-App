import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Article } from 'src/app/models/article.model';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.page.html',
  styleUrls: ['./edit-article.page.scss'],
})
export class EditArticlePage implements OnInit {
  selectedTags: string[] | undefined = [];
  linkEditForm: FormGroup;
  @Input() article: Article;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private articleService: ArticleService
  ) {}

  ngOnInit() {
    console.log('Edit article........', this.article);
    this.selectedTags = this.article.tags;
    this.linkEditForm = this.formBuilder.group({
      url: [
        this.article.url,
        [Validators.required, Validators.pattern('https?://.*')],
      ],
      description: [this.article.description],
    });
  }

  removeTag(tagToRemove: string) {
    this.selectedTags = this.selectedTags?.filter((tag) => tag !== tagToRemove);
  }

  addTag(tagInput: any) {
    const tag = tagInput.value.trim();
    if (tag && !this.selectedTags?.includes(tag)) {
      this.selectedTags?.push(tag);
      tagInput.value = '';
    }
  }

  async onSubmit() {
    console.log('clicked id is....', this.article.id!);
    await this.articleService.editArticle(
      this.article.id!,
      this.linkEditForm.value.url,
      this.linkEditForm.value.description,
      this.selectedTags!
    );
    this.modalController.dismiss({ refresh: true });
  }
  cancel() {
    this.modalController.dismiss();
  }
}
