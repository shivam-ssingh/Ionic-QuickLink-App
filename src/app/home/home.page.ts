import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AddLinkPage } from '../pages/add-link/add-link.page';
import { FileConstant } from '../models/constants';
import { Preferences } from '@capacitor/preferences';
import { Article } from '../models/article.model';
import { Share } from '@capacitor/share';
import { ViewArticlePage } from '../pages/view-article/view-article.page';
import { ArticleService } from '../services/article.service';
import { EditArticlePage } from '../pages/edit-article/edit-article.page';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  showClearTagSearchButton: boolean = false;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private articleService: ArticleService,
    private photoService: PhotoService
  ) {}

  async ngOnInit() {
    this.loadArticles();
  }

  async loadArticles() {
    this.articles = await this.articleService.loadArticles();
    this.filteredArticles = [...this.articles];
    await this.photoService.loadAllSavedArticlePhoto(this.articles);
  }
  onImageError(event: any) {
    event.target.src = FileConstant.ErrorImagePath;
  }

  async openAddLinkModal() {
    const modal = await this.modalController.create({
      component: AddLinkPage,
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.refresh) {
      this.reloadData();
    }
  }

  async openEditLinkModal(event: Event, article: Article) {
    event.stopPropagation();

    const modal = await this.modalController.create({
      component: EditArticlePage,
      componentProps: {
        article: article,
      },
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.refresh) {
      this.reloadData();
    }
  }

  reloadData() {
    console.log('Home page data reloaded!');
    this.loadArticles();
  }

  async viewArticleDetails(article: Article) {
    console.log(article);
    const modal = await this.modalController.create({
      component: ViewArticlePage,
      componentProps: {
        article: article,
      },
    });
    return await modal.present();
  }

  async deleteArticle(article: Article) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this article?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            this.removeArticle(article.id);
          },
        },
      ],
    });

    await alert.present();
  }

  async removeArticle(articleId: string | undefined) {
    await this.articleService.removeArticle(articleId);
    this.loadArticles();
  }

  async shareArticle(article: Article) {
    await this.shareLink(article.url, article.title);
  }
  async shareLink(url: string, title: string) {
    await Share.share({
      title: title, //change to extracted title maybe??
      text: 'Check out this interesting article!',
      url: url,
      dialogTitle: 'Share Article',
    });
  }

  filterArticles(event: any) {
    const searchTerm = event.detail.value.toLowerCase();
    this.filteredArticles = this.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.url.toLowerCase().includes(searchTerm) ||
        (article.description &&
          article.description.toLowerCase().includes(searchTerm))
    );
  }

  tagSearch(event: Event, tag: string) {
    event.stopPropagation();
    this.filterArticlesByTag(tag);
    console.log('tag search event!');
  }

  filterArticlesByTag(tag: string) {
    this.filteredArticles = this.articles.filter((article) =>
      article.tags?.includes(tag)
    );

    console.log('Filtered Articles:', this.filteredArticles);
    this.showClearTagSearchButton = true;
  }
  clearTagSearch() {
    this.filteredArticles = [...this.articles];
    this.showClearTagSearchButton = false;
  }
}
