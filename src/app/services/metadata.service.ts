import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileConstant } from '../models/constants';

@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  constructor(private http: HttpClient) {}
  //https://medium.com/@MakeComputerScienceGreatAgain/7-array-functions-you-need-to-master-in-javascript-a-comprehensive-guide-3c5552bc5c02
  extractMetadata(url: string) {
    return this.http.get<any>(`${FileConstant.BaseMetaDataURL}${url}`);
  }
}
