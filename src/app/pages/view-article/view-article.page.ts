import { Component, Input, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
import { ModalController } from '@ionic/angular';
import { Article } from 'src/app/models/article.model';
import { FileConstant } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.development';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';

@Component({
  selector: 'app-view-article',
  templateUrl: './view-article.page.html',
  styleUrls: ['./view-article.page.scss'],
})
export class ViewArticlePage implements OnInit {
  @Input() article: Article;
  textResponse: string = '';
  showAIPreview: boolean = false;

  constructor(private modalController: ModalController) {}

  async ngOnInit() {
    this.geminiCall();
  }

  async openLink() {
    await Browser.open({ url: this.article.url });
  }

  onImageError(event: any) {
    event.target.src = FileConstant.ErrorImagePath;
  }

  async shareLink() {
    await Share.share({
      title: this.article.title, //change to extracted title maybe??
      text: 'Check out this interesting article!',
      url: this.article.url,
      dialogTitle: 'Share Article',
    });
  }

  closeViewLink() {
    this.modalController.dismiss();
  }

  async geminiCall() {
    const genAI = new GoogleGenerativeAI(environment.API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Summarize this website content: ${this.article.url}. Reply with plain content, I'll be using it to display on my angular app.`;
    const result = await model.generateContent(prompt);
    this.textResponse = result.response.text();
    if (this.textResponse) {
      this.showAIPreview = true;
    }
    console.log('gemini call.........', result.response.text());
  }
}
