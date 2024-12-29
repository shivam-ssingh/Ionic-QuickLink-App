import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import jsPDF from 'jspdf';
import { Article } from '../models/article.model';

@Injectable({
  providedIn: 'root',
})
export class PdfExportService {
  constructor(private platform: Platform) {}

  async exportToPdf(
    links: Article[],
    fileName = 'my-links.pdf'
  ): Promise<string> {
    const htmlContent = this.generateHTML(links);
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    document.body.appendChild(element);

    const doc = new jsPDF('p', 'pt', 'a4', true);
    const a4Width = Number(doc.internal.pageSize.getWidth());
    console.log('A4 WIDTH --->', a4Width);
    try {
      await doc.html(element, {
        callback: (doc) => {
          if (this.platform.is('capacitor')) {
            this.saveToDevice(doc, fileName);
          } else {
            doc.save(fileName);
          }
        },
        margin: [10, 10, 10, 10],
        html2canvas: { scale: 0.5 },
        autoPaging: true,
        width: a4Width,
      });

      document.body.removeChild(element);
      return 'PDF export started';
    } catch (error) {
      document.body.removeChild(element);
      throw error;
    }
  }

  private generateHTML(links: Article[]): string {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #333; margin-bottom: 10px;">My Saved Links</h1>
        <p style="color: #666; margin-bottom: 20px;">Generated on ${new Date().toLocaleDateString()}</p>
        
        ${links
          .map(
            (link) => `
          <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 5px;">
            <img src=${
              link.userPhoto?.webviewPath || link.metadata?.extractedImage
            } style="display: block; height=56px; width=56px; object-fit=inherit">
            <h2 style="color: #444; margin: 0 0 10px 0; font-size: 16px;">
              ${link.metadata?.extractedTitle || link.title}
            </h2>
            <a href="${
              link.url
            }" style="color: #0066cc; display: block; margin-bottom: 10px; word-break: break-all; cursor:pointer">
              ${link.url}
            </a>
            <p style="color: #666; margin: 0; font-size: 14px;">
              ${link.description}
            </p>
            ${
              link.metadata?.extractedDescription
                ? `
              <p style="color: #888; margin: 10px 0 0 0; font-size: 13px;">
                ${link.metadata?.extractedDescription}
              </p>
            `
                : ''
            }
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  private async saveToDevice(doc: jsPDF, fileName: string): Promise<string> {
    try {
      const base64Data = doc.output('datauristring').split(',')[1];
      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
        recursive: true,
      });
      return `File saved to Documents/${fileName}`;
    } catch (error) {
      throw `Error saving PDF: ${error}`;
    }
  }
}
