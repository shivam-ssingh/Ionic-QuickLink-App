import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewArticlePage } from './view-article.page';

describe('ViewArticlePage', () => {
  let component: ViewArticlePage;
  let fixture: ComponentFixture<ViewArticlePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewArticlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
