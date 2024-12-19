import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Article } from 'src/app/models/article.model';
import { Preferences } from '@capacitor/preferences';
import { FileConstant } from 'src/app/models/constants';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { environment } from 'src/environments/environment.development';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-add-link',
  templateUrl: './add-link.page.html',
  styleUrls: ['./add-link.page.scss'],
})
export class AddLinkPage implements OnInit {
  selectedTags: string[] = [];
  linkForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private articleService: ArticleService
  ) {}

  ngOnInit() {
    this.linkForm = this.formBuilder.group({
      url: ['', [Validators.required, Validators.pattern('https?://.*')]],
      description: [''],
    });
  }

  removeTag(tagToRemove: string) {
    this.selectedTags = this.selectedTags.filter((tag) => tag !== tagToRemove);
  }

  addTag(tagInput: any) {
    const tag = tagInput.value.trim();
    if (tag && !this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
      tagInput.value = '';
    }
  }

  async onSubmit() {
    await this.articleService.saveArticle(
      this.linkForm.value.url,
      this.linkForm.value.description,
      this.selectedTags
    );
    this.modalController.dismiss({ refresh: true });
  }
  cancel() {
    this.modalController.dismiss();
  }
}
