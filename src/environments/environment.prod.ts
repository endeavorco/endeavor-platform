// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,

  // api keys, endpoints

  domain: 'endeavorexperiences.myshopify.com',
  shopifyaccesstoken: 'd4417ea5e33b1a8f2868ba2f3180291c',
  //rollbar_token: '63fb85836f014fef90b82c988af016d5',
  ga_identifier: 'UA-128565415-9',
  amazon_lambda_token: '3Faywbjh5o3JZfn7M2wxe2G28U3rAZn27GdzndLb',
  amazon_lambda_gateway: 'https://v6gnxg6p7i.execute-api.us-west-2.amazonaws.com/default',

  // collections

  configCollectionUrl: 'config',
  discoverCollectionUrl: 'frieze_ny',
  fashionCollectionUrl: 'frieze_ny',
  musicCollectionUrl: 'frieze_ny',
  sportsCollectionUrl: 'frieze_ny',
  
  // site config

  brand: 'Endeavor Experiences',
  brandText: 'Endeavor Experiences',
  consiergeEmailSubject: 'Frieze VIP Experience Request',
  data: {
    phoneLink: 'tel:+1-844-325-0720',
    phone: '+1 (844) 325-0720',
    emailLink: 'mailto:experiences@endeavorco.com',
    email: 'experiences@endeavorco.com',
  }

  // title1: "FRIESE NEW YORK",
  // title2: "'Randall's Island Park",

  // annProject: false, 
  // miamiProject: false,
  // nyfw: false,
  // friese: true,

  // firebase: {
  //   apiKey: "AIzaSyCvM68jrSPrtpdgF2meaBKRdiU5EPNaOrM",
  //   authDomain: "nyfw-28cd9.firebaseapp.com",
  //   databaseURL: "https://nyfw-28cd9.firebaseio.com",
  //   projectId: "nyfw-28cd9",
  //   storageBucket: "nyfw-28cd9.appspot.com",
  //   messagingSenderId: "404481823894",
  //   designers_collection: "dev/data"
  // },

  //videoUrls: {
  //   videoDesktop: {
  //     url: '',
  //     poster: ''
  //   },
  //   videoMobile: {
  //     url: '',
  //     poster: ''
  //   }
  // },

  //   heroTitleHtml: `
  //   <h1 class="title-lg">FRIEZE NEW YORK</h1>
  //   <h2 class="title-md">Randall's Island Park <br> May 2-5, 2019</h2>
  // `,

  //   default_checkout_text: 'add to cart',
  //   added_checkout_text: 'Added!',
  //   is_designers_announcement_enabled: true,
  //   mainPhotoBackground: '',
  //   consiergeEmailSubject: 'Frieze VIP Experience Request',
  //   consiergeEmailText: `Hi, I'd like to learn more about the Frieze NY Collector Experience package, please reach out to me at `,
  //   showSignupFooter: false,
  //   showAppLayoutFooter: true,
  //   showSignupFooterSkin2: false,
  //   showHeroBundle: true,
  //   heroPosterImg: '/assets/images/projects/ufc/poster.jpg',
  //   showCartBadge: false,
  //   showMobileMenu: false,
  //   showSignUpHome: false,
  //   hurryUpPopupBrand: 'FRIEZE VIP',
  //   topHeaderLogoLink: '/',
  //   bottomHeaderLogoLink: 'https://frieze.com/fairs/frieze-new-york',
  //   showStartingAtLabel: false,
  //   sortRelatedProductsDesc: false,

  //   topHeaderLogo: {
  //     themplate: `<b>ENDEAVOR</b>EXPERIENCES`,
  //     link: '/',
  //     target: ''
  //   },
  //   bottomHeaderLogo: {
  //     themplate: ``,
  //     link: 'https://frieze.com/fairs/frieze-new-york',
  //     target: '_blank'
  //   },
  //   bundleExtendedForm: true,
  //   masonry: {
  //     masonryHintText: 'Taylor Hill/Getty Images for Augusta at Night',
  //     masonryTitleThemplate: `<p class="masonry-title-text">
  //                               Performance Highlights from
  //                               <span class="masonry-title-text__part">Sheryl Crow and Hootie and the Blowfish </span>
  //                               this past Event
  //                             </p>`,
  //   },
  //   postEventTitleHtml: `<h3>Don’t miss out on the next</h3>
  //                       <h1>Frieze New York</h1>`
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */