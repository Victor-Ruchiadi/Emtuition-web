import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesAddStudentsComponent } from './classes-add-students.component';

describe('ClassesAddStudentsComponent', () => {
  let component: ClassesAddStudentsComponent;
  let fixture: ComponentFixture<ClassesAddStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassesAddStudentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassesAddStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
