import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('video', { static: true })
  video!: ElementRef<HTMLVideoElement>;

  mediaRecorder!: MediaRecorder;
  parts: Array<Blob>;
  private onDataAvailableEvent = (ev: BlobEvent) => this.handleDataAvailable(ev);

  constructor(@Inject(PLATFORM_ID) private _platform: Object) {
    this.parts = new Array<Blob>();

    if (isPlatformBrowser(this._platform) && 'mediaDevices' in navigator) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((ms: MediaStream) => {
          const _video = this.video.nativeElement;
          _video.srcObject = ms;
          _video.play();
          this.mediaRecorder = new MediaRecorder(ms);
        });
    }
  }

  onStart() {
    this.mediaRecorder.ondataavailable = this.onDataAvailableEvent;
    this.mediaRecorder.start(1000);
  }

  onStop() {
    this.mediaRecorder.stop();
    this.parts = new Array<Blob>();
  }

  handleDataAvailable(e: BlobEvent) {
    this.parts.push(e.data);
    console.log(e);
  }

  ngOnDestroy() {
    (this.video.nativeElement.srcObject as MediaStream).getVideoTracks()[0].stop();
  }
}
