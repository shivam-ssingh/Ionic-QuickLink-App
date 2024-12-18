import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddLinkPage } from './add-link.page';

describe('AddLinkPage', () => {
  let component: AddLinkPage;
  let fixture: ComponentFixture<AddLinkPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLinkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
