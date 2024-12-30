import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { FileConstant } from '../models/constants';
import { Article } from '../models/article.model';
import { v4 as uuidv4 } from 'uuid';
import { MetadataService } from './metadata.service';
import { firstValueFrom, switchMap } from 'rxjs';
import { UserPhoto } from '../models/photo.model';

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

  async removeAllArticles() {
    Preferences.remove({
      key: FileConstant.ArticleStorageKey,
    });
    console.log('Article completely removed!');
  }
  async saveArticle(
    url: string,
    description: string,
    selectedTags: string[],
    userImage: UserPhoto
  ) {
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
      userPhoto: userImage,
    };

    console.log('new article is........', newArticle);

    storedArticles.push(newArticle);
    await this.addArticle(storedArticles);
    console.log('Article saved successfully');
  }

  async editArticle(
    id: string,
    url: string,
    description: string,
    selectedTags: string[]
  ) {
    let storedArticles = await this.loadArticles();
    const metadataResponse = await firstValueFrom(
      this.metaDataService.extractMetadata(url)
    );
    let savedArticleWithId: Article[] = storedArticles.filter(
      (article) => article.id == id
    );
    let savedArticleIndex = storedArticles.findIndex(
      (article) => article.id == id
    );
    console.log('saved article index ->', savedArticleIndex);
    if (savedArticleWithId) {
      let savedArticleToUpdate = savedArticleWithId[0];
      savedArticleToUpdate = {
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
      console.log('updated article is........', savedArticleToUpdate);
      storedArticles.splice(savedArticleIndex, 1, savedArticleToUpdate);
      await this.addArticle(storedArticles);
      console.log('Article saved successfully');
    }
  }

  private async addArticle(articles: Article[]) {
    console.log('article pused to save are........', articles);
    await Preferences.set({
      key: FileConstant.ArticleStorageKey,
      value: JSON.stringify(articles),
    });
    console.log('saved succesfully in storage!');
  }

  private async updatedArticle(articles: Article[]) {
    console.log('article pused to save are........', articles);
    await Preferences.set({
      key: FileConstant.ArticleStorageKey,
      value: JSON.stringify(articles),
    });
    console.log('saved succesfully in storage!');
  }
}
