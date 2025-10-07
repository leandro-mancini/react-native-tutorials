import { Slide } from '../components/onboarding/types';

export const SLIDES: Slide[] = [
  {
    key: 'a',
    title: 'Expresse sua criatividade',
    subtitle:
      'Expresse sua criatividade usando nosso aplicativo e usando nossos serviços premium',
    bg: '#EA94FF',
    lottie: require('../../assets/lottie/step1.json'),
  },
  {
    key: 'b',
    title: 'Compre com facilidade',
    subtitle:
      'Nossa interface de usuário do aplicativo tornará sua experiência de compra tranquila e sem anúncios.',
    bg: '#B795FF',
    lottie: require('../../assets/lottie/step1.json'),
  },
  {
    key: 'c',
    title: 'Comunique-se com facilidade',
    subtitle:
      'Comunique-se usando nosso aplicativo para entrar em contato com outras pessoas em todo o mundo.',
    bg: '#FFBBBB',
    lottie: require('../../assets/lottie/step1.json'),
  },
];
