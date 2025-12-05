import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

interface Slide {
  emoji: string;
  title: string;
  risk: string;
  economy: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('slideAnimation', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('fadeInUpStagger', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition(':enter', [
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  private autoSlideInterval: any;

  slides: Slide[] = [
    {
      emoji: '💰',
      title: 'STOP à l\'Obsolescence Forcée',
      risk: 'Le Risque : Les Big Tech vous obligent à racheter un PC tous les 3-4 ans.',
      economy: 'L\'Économie : Le Logiciel Libre redonne vie à votre matériel pour 0€ et pour 10 ans de plus.'
    },
    {
      emoji: '💸',
      title: 'STOP aux Licences Pièges',
      risk: 'Le Risque : Vous êtes piégé par des abonnements aux tarifs imprévisibles (Microsoft, Google...).',
      economy: 'L\'Économie : Les outils Libres vous offrent la même bureautique pour 0€ et sans chantage.'
    },
    {
      emoji: '🛡️',
      title: 'STOP à la Fuite de Capital',
      risk: 'Le Risque : L\'argent de vos licences et la valeur de vos données s\'échappent hors de l\'économie locale.',
      economy: 'L\'Économie : Bascul.Tech réoriente votre budget vers des solutions souveraines et locales, pour une valeur conservée.'
    }
  ];

  features: Feature[] = [
    {
      icon: '🛡️',
      title: 'Obsolescence Programmée',
      desc: 'Combattez le cycle infernal du matériel jetable imposé par les géants.',
    },
    {
      icon: '🔒',
      title: 'Souveraineté des Données',
      desc: 'Vos données vous appartiennent. Reprenez-les des mains des Big Tech.',
    },
    {
      icon: '🌿',
      title: 'Numérique Durable',
      desc: 'Prolongez la vie de vos appareils grâce à des logiciels légers et libres.',
    },
  ];

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  previousSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  trackByTitle(_: number, item: Feature) {
    return item.title;
  }
}
