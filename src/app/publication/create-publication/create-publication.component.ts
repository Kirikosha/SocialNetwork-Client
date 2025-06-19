import { Component, ElementRef, EventEmitter, inject, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PublicationService } from '../../_services/publication.service';
import { CreatePublicationModel } from '../../_models/createPublicationModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'app-create-publication',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageCropperComponent],
  templateUrl: './create-publication.component.html',
  styleUrl: './create-publication.component.css'
})
export class CreatePublicationComponent {
  @Output() publicationCreated = new EventEmitter<void>();
  private toastrService = inject(ToastrService);
  private publicationService = inject(PublicationService);
  private cdr = inject(ChangeDetectorRef);
  
  @ViewChild('contentSpan') contentSpan!: ElementRef<HTMLSpanElement>;
  @ViewChild('imageUpload') imageUpload!: ElementRef<HTMLInputElement>;
  @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent;

  publicationType: 'ordinary' | 'planned' = 'ordinary';
  scheduledDate: string = '';
  imagePreviews: string[] = [];
  selectedImages: File[] = [];
  isPosting: boolean = false;
  showCropper = false;
  currentCroppingIndex = 0;
  
  // Image cropper properties
  imageChangedEvent: any = '';
  croppedImage: any = '';
  currentFile?: File;
  pendingFiles: File[] = [];

  createPost(event: Event) {
    event.preventDefault();
    const content = this.contentSpan.nativeElement.innerText.trim();
    
    if (!content || content.length === 0) {
      this.toastrService.error("Please enter content for the post");
      return;
    }
    
    if (this.publicationType === 'planned' && !this.scheduledDate) {
      this.toastrService.error("Please select a schedule date and time");
      return;
    }
    
    this.isPosting = true;

    const publication: CreatePublicationModel = {
      content: content,
      publicationType: this.publicationType,
      remindAt: this.publicationType === 'planned' ? new Date(this.scheduledDate) : undefined,
      images: this.selectedImages.length > 0 ? this.selectedImages : undefined
    };

    this.publicationService.createPublication(publication).subscribe({
      next: (response) => {
        this.resetForm();
        this.publicationCreated.emit();
        this.toastrService.success('Publication created successfully!');
      },
      error: (err) => {
        console.error('Error details:', err);
        this.toastrService.error(err.error?.message || 'Failed to create post');
        this.isPosting = false;
      },
      complete: () => {
        this.isPosting = false;
      }
    });
  }

  get minScheduleDate(): string {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  }

  handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);

      if (this.selectedImages.length + files.length > 4) {
        this.toastrService.error('You can upload a maximum of 4 images');
        input.value = '';
        return;
      }

      this.pendingFiles = [...files];
      const file = this.pendingFiles.shift()!;
      this.initiateCropping(file, this.selectedImages.length);
    }
  }

  processNextFile() {
    if (this.pendingFiles.length === 0) {
      this.imageUpload.nativeElement.value = '';
      return;
    }

    const file = this.pendingFiles.shift()!;
    this.initiateCropping(file, this.selectedImages.length);
  }

  initiateCropping(file: File, index: number) {
    if (!file.type.match('image.*')) {
      this.toastrService.error('Only image files are allowed');
      this.processNextFile();
      return;
    }

    this.currentCroppingIndex = index;
    this.currentFile = file;

    const syntheticEvent = {
      target: {
        files: [file],
        value: ''
      }
    };

    this.imageChangedEvent = syntheticEvent;
    this.showCropper = true;
    this.cdr.detectChanges();
  }
imageCropped(event: ImageCroppedEvent) {
    if (event.base64) {
      this.croppedImage = event.base64;
    } else if (event.blob) {
      const reader = new FileReader();
      reader.onload = () => {
        this.croppedImage = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(event.blob);
    }
    this.cdr.detectChanges();
  }


  async applyCrop() {
    if (!this.croppedImage || !this.currentFile) return;

    try {
      const blob = await fetch(this.croppedImage).then(res => res.blob());

      const croppedFile = new File([blob], this.currentFile.name, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      if (this.currentCroppingIndex >= this.selectedImages.length) {
        this.selectedImages.push(croppedFile);
        this.imagePreviews.push(this.croppedImage);
      } else {
        this.selectedImages[this.currentCroppingIndex] = croppedFile;
        this.imagePreviews[this.currentCroppingIndex] = this.croppedImage;
      }

      this.resetCropper();
      this.processNextFile();
    } catch (error) {
      console.error('Error applying crop:', error);
      this.toastrService.error('Failed to process image');
      this.resetCropper();
    }
  }

  cancelCrop() {
    this.resetCropper();
    if (this.currentCroppingIndex >= this.selectedImages.length) {
      this.pendingFiles = [];
    }
    this.processNextFile();
  }

  resetCropper() {
    this.showCropper = false;
    this.croppedImage = '';
    this.currentFile = undefined;
    this.imageChangedEvent = '';
  }

  resetForm() {
    this.contentSpan.nativeElement.innerText = '';
    this.imagePreviews = [];
    this.selectedImages = [];
    this.pendingFiles = [];
    this.publicationType = 'ordinary';
    this.scheduledDate = '';
    this.isPosting = false;
    this.resetCropper();
    if (this.imageUpload) {
      this.imageUpload.nativeElement.value = '';
    }
  }

  removeImage(index: number): void {
    if (index > -1 && index < this.imagePreviews.length) {
      this.imagePreviews.splice(index, 1);
      this.selectedImages.splice(index, 1);
    }
  }

}