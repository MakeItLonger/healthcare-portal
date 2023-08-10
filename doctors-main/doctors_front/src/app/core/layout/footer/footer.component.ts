import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  socialsList = [
    { name: 'Facebook', link: 'https://www.facebook.com', iconSrc: '../../../../assets/icons/Facebook 1.svg'},
    { name: 'Instagram', link: 'https://www.instagram.com', iconSrc: '../../../../assets/icons/Instagram.svg' },
    { name: 'LinkedIn', link: 'https://www.linkedin.com', iconSrc: '../../../../assets/icons/Linkedin.svg' },
    { name: 'Twitter', link: 'https://www.twitter.com', iconSrc: '../../../../assets/icons/Twitter.svg' }
  ];
}
