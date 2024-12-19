import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { FileConstant } from '../models/constants';
import { Article } from '../models/article.model';
import { v4 as uuidv4 } from 'uuid';
import { MetadataService } from './metadata.service';
import { firstValueFrom, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private articles: Article[];

  constructor(private metaDataService: MetadataService) {}

  async loadArticles(): Promise<Article[]> {
    const { value } = await Preferences.get({
      key: FileConstant.ArticleStorageKey,
    });
    console.log('stored article are..', value);
    return value ? JSON.parse(value) : [];
  }

  async removeArticle(articleId: string | undefined) {
    const { value } = await Preferences.get({
      key: FileConstant.ArticleStorageKey,
    });
    let articles: Article[] = value ? JSON.parse(value) : [];

    articles = articles.filter((article) => article.id !== articleId);

    await Preferences.set({
      key: FileConstant.ArticleStorageKey,
      value: JSON.stringify(articles),
    });
    console.log('Article deleted successfully!');
  }

  async saveArticle(url: string, description: string, selectedTags: string[]) {
    let storedArticles = await this.loadArticles();
    const metadataResponse = await firstValueFrom(
      this.metaDataService.extractMetadata(url)
    );
    const newArticle: Article = {
      id: uuidv4(),
      url: url,
      title: description,
      description: description,
      dateAdded: new Date(),
      tags: selectedTags,
      metadata: {
        extractedTitle: metadataResponse.title,
        extractedDescription: metadataResponse.description,
        extractedImage: metadataResponse.image,
      },
    };

    console.log('new article is........', newArticle);

    storedArticles.push(newArticle);
    await this.addArticle(storedArticles);
    console.log('Article saved successfully');
  }

  private async addArticle(articles: Article[]) {
    console.log('article pused to save are........', articles);
    await Preferences.set({
      key: FileConstant.ArticleStorageKey,
      value: JSON.stringify(articles),
    });
    console.log('saved succesfully in storage!');
  }
}
