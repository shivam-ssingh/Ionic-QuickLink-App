import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileConstant } from '../models/constants';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  constructor(private http: HttpClient) {}

  extractMetadata(url: string) {
    return this.http.get<any>(
      `${FileConstant.BaseMetaDataURL}?key=${environment.METADATA_KEY}&q=${url}`
    );
  }
}
