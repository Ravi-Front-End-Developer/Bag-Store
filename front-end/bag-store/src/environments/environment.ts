// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mode: 'dev', // dev , test , prod
  appBaseUrl: "http://localhost:3000/api",
  locationBaseURL: 'https://api.countrystatecity.in/v1/countries',
  locationAPIkey: '1cd475eb53520cdf6c114313ce231b237a96e292947afb3b67240b6a4ea8fcff',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
