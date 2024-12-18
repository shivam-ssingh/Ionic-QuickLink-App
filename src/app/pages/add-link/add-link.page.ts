import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Article } from 'src/app/models/article.model';
import { Preferences } from '@capacitor/preferences';
import { FileConstant } from 'src/app/models/constants';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-link',
  templateUrl: './add-link.page.html',
  styleUrls: ['./add-link.page.scss'],
})
export class AddLinkPage implements OnInit {
  selectedTags: string[] = [];
  linkForm: FormGroup;
  private apiKey = '6604e7d7adc55f02ce67492fba901c82';
  private apiUrl = 'https://api.linkpreview.net/';

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.linkForm = this.formBuilder.group({
      url: [''],
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
    const { value } = await Preferences.get({
      key: FileConstant.ArticleStorageKey,
    });
    let articles: Article[] = [];
    if (value) {
      articles = JSON.parse(value);
    }
    const metadataFromURL = await this.extractMetadata(this.linkForm.value.url);

    const newArticle: Article = {
      id: uuidv4(),
      url: this.linkForm.value.url,
      title: this.linkForm.value.description,
      description: this.linkForm.value.description,
      dateAdded: new Date(),
      tags: this.selectedTags,
      metadata: {
        extractedTitle: metadataFromURL.title,
        extractedDescription: metadataFromURL.description,
        extractedImage: metadataFromURL.image,
      },
    };
    console.log('new article is........', newArticle);

    articles.push(newArticle);
    await Preferences.set({
      key: FileConstant.ArticleStorageKey,
      value: JSON.stringify(articles),
    });
    console.log('saved succesfully in storage!');
    this.modalController.dismiss({ refresh: true });
  }

  // setMetaData(url: string) {
  //   this.extractMetadata(url).subscribe((data) => {
  //     return {
  //       extractedTitle: data.title,
  //       extractedDescription: data.description,
  //       extractedImage: data.image,
  //     };
  //   });
  // }
  async extractMetadata(url: string) {
    return await firstValueFrom(
      this.http.get<any>(`${this.apiUrl}?key=${this.apiKey}&q=${url}`)
    );
  }
  cancel() {
    this.modalController.dismiss();
  }
}
