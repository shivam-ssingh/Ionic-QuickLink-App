ionic start notes-app blank --type=angular

npm install @capacitor/core @capacitor/cli @capacitor/splash-screen @capacitor/share @ionic/pwa-elements @capacitor/camera @capacitor/preferences @capacitor/filesystem @capacitor/storage @capacitor/browser
`npm i uuid`
npm install @google/generative-ai

ionic serve

Form understanding:

Using reactive form in our project.

Explaining the difference between formcontrol and ngmodel approach:
https://www.concretepage.com/questions/768

Reactiveform module had to be imported for the form to work.
https://stackoverflow.com/questions/39152071/cant-bind-to-formgroup-since-it-isnt-a-known-property-of-form

seeing this error
![[Pasted image 20241217161342.png]]
had to intialize the formgroup in component,
https://stackoverflow.com/questions/38444778/formgroup-expects-a-formgroup-instance

had to use provideHttpClient() in providers, since httpmodule is deprecated.

ion sliding to show option of delete share
https://ionicframework.com/docs/api/item-sliding

ion alert for deletion confirmation
https://ionicframework.com/docs/api/alert

downloaded uuid package to get generate unique id for my article list, which in turn would help in deletion

ngfor and ngif cannot work together, had to introduce ng-container to handle it
https://stackoverflow.com/questions/34657821/ngif-and-ngfor-on-same-element-causing-error

```
 <ng-container *ngIf="article.tags?.length">
        <ion-chip *ngFor="let tag of article.tags" color="secondary" outline>
          <ion-icon name="pricetag-outline"></ion-icon>
          <ion-label>Tags: {{ tag }}</ion-label>
        </ion-chip>
      </ng-container>
```

making the child element's click event take precedence over the parent element's click event.
ion-chip inside the ion-item. ion-item is clickable, but we want the click event on ion-chip to take precedence.
https://stackoverflow.com/questions/62816791/is-there-a-way-to-stop-ionitem-firing-onclick-event-when-a-clickable-element-ins

planning to use google's gemini api
https://medium.com/google-cloud/build-ai-powered-angular-apps-with-google-gemini-5bf5e905ca1d

ng g environments
npm install @google/generative-ai

commands to build the app:
ionic build
ionic cap add android
ionic cap copy
ionic cap sync
ionic cap open android

Android studio was not identifying the connected android device, had to download platform tools, then run the following command
C:\Users\Shivam\Downloads\platform-tools-latest-windows\platform-tools> .\adb.exe devices

Had to understand observable vs promises.
**Issue faced**

The problem occurred when trying to save an article using a service method (`saveArticle`). The `saveArticle` method was a mix of `async/await` for handling promises and `subscribe` for handling http call. This caused **timing issues**, as the `onSubmit` method (which calls `saveArticle`) awaited the method, but `saveArticle` itself didn’t ensure the asynchronous operations inside it were resolved before returning.
`saveArticle` returned before completing the metadata extraction and saving process because the `.subscribe` method in `saveArticle` was non-blocking. This resulted in the `onSubmit` method dismissing the modal before the data was fully saved, leading to issues like outdated data being fetched in the UI.

To resolve the issue, we ensured the asynchronous operations in `saveArticle` were fully completed before the method resolved. This was achieved by converting the observable returned by `extractMetadata` into a promise using `firstValueFrom`. This allowed the use of `async/await` consistently throughout the `saveArticle` method and ensured the `onSubmit` method waited for the entire process to finish.

Added Form Validation
https://stackoverflow.com/questions/51954038/angular-reactive-form-custom-validation-using-formbuilder

To have custom app icons along with splash screen, I had to add a 'splash.png' file and 'icon.png' file inside resources folder. This folder is present at the root. Once I added these files I had to run the command `capacitor-assets generate`, this created the required files for android and pwa.

Implementing splash screen: Once the files were created after running the above app, we added the below code.

```
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp();
  }
  async initializeApp() {
    await this.platform.ready();
    console.log('showing loading screen......');
    await SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
  }
}

```

NOTE: We cannot test splash screen on web app, we can only use app.

# Steps to make it PWA

In order to make our app PWA, i had to run the command 'ng add @angular/pwa' to add the required dependencies.
`ng add @angular/pwa`
Ideally the service worker package should've been installed post running the above script, but had to add it manually
`npm install @angular/service-worker`

had to add this file at the root ngsw-config.json and manifest.json inside src.

In angular JSON, I had to add `src/manifest.json` inside architect>build>assets

and this key-value ` "ngswConfigPath": "ngsw-config.json" ` inside architect>build>options

Inside index.html, I had to add  <link rel="manifest" href="manifest.json" /> in the header.

Post the changes to test it locally, I had to run the command `ng build --configuration production` this created the files required.

## Testing it locally

To test it locally I had to first install http-server package, using the command `npm install -g http-server`
Once the server was installed, I had to then host the folder using the command
`http-server www` these files are what makes our application PWA.

Note: the output folder for our project was www, because it was configured this way in our angular.json file, under architect>options>outputPath

To make sure it works: go to the server address displayed after the above command on browser, under the application tab in developer tools, both service worker and manifest files need to be identified by our browser, which says our app is pwa now.
