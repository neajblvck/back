

const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Naviguer vers la page de connexion Instagram
  await page.goto('https://www.instagram.com/');

      // Attendre que le bouton apparaisse dans le DOM
  await page.waitForSelector('button._a9--._a9_1');

  // Cliquer sur le bouton "Refuser les cookies optionnels"
  await page.click('button._a9--._a9_1');

  // Attendre que les champs du formulaire de connexion soient chargés
  await page.waitForSelector('input[name="username"]');

  // Remplir le champ du nom d'utilisateur
  await page.type('input[name="username"]', 'darkychun');

  // Remplir le champ du mot de passe
  await page.type('input[name="password"]', 'Bdmsou2*');

  // Cliquer sur le bouton de connexion
    await new Promise(resolve => setTimeout(resolve, 1500));
    await page.waitForSelector('button._acan._acap._acas._aj1-');
    await page.click('button._acan._acap._acas._aj1-');


  // Attendre que la page se charge après la connexion
  await page.waitForNavigation();


  try {
    // Attendre que le bouton apparaisse dans le DOM avec un délai de 3 secondes
    await page.waitForSelector('button._a9--._a9_1', { timeout: 5000 });
    await page.click('button._a9-- _a9_1');
  } catch (error) {
    console.log('Le bouton n\'existe pas.');
  }

    // await page.click('button._a9-- _a9_1');


  await page.screenshot({path: 'screenshot.png'});

  // Faire quelque chose après la connexion, par exemple naviguer vers le profil utilisateur
  // await page.goto('https://www.instagram.com/votre-profil/');

  await browser.close();
}










// DELIVEROO

async function rankingtest() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  page.on('console', (message) => {
    if (message.type() === 'log') {
      console.log(message.text());
    }
  });
  
  await page.goto('https://www.ubereats.com/search?diningMode=DELIVERY&pl=JTdCJTIyYWRkcmVzcyUyMiUzQSUyMlNhaW50LUNoYXJsZXMlMjIlMkMlMjJyZWZlcmVuY2UlMjIlM0ElMjJDaElKdFM0Mjk1YkF5UklSb0E5Vm01SEU0SnMlMjIlMkMlMjJyZWZlcmVuY2VUeXBlJTIyJTNBJTIyZ29vZ2xlX3BsYWNlcyUyMiUyQyUyMmxhdGl0dWRlJTIyJTNBNDMuMzAyNjE1NyUyQyUyMmxvbmdpdHVkZSUyMiUzQTUuMzgwMjg0Nzk5OTk5OTk5JTdE&q=Fast%20Food&sc=SHORTCUTS');

  await page.evaluate(async () => {
    const buttons = document.querySelectorAll('button');
    let showMoreButton = null;

    buttons.forEach((button) => {
      if (button.textContent === 'Show more') {
        showMoreButton = button;
      }
    });

    if (showMoreButton) {
      showMoreButton.click();
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for additional data to load (2 seconds here)
    }

    const nodeList = document.querySelectorAll('[data-testid="store-card"]');
    console.log(nodeList);

    for (let i = 0; i < nodeList.length; i++) {
      // Check if the element has the desired href attribute
      if (nodeList[i].getAttribute('href') === '/store/bsb-saint-charles/vpg41lqzRniETs8dID_nLw') {
        // Display the index of the element in the console
        console.log('The element appeared after ' + i + ' elements.');
        break; // Exit the loop once the element is found
      } else {
        console.log('Element not found.');
      }
    }
  });

  await browser.close();
}

rankingtest();


// async function ranking() {
//   // Lance le navigateur Puppeteer
//   const browser = await puppeteer.launch({ headless: false });

//   // Crée une nouvelle page
//   const page = await browser.newPage();

//   // Navigue vers l'URL 
//   await page.goto('https://www.ubereats.com/search?diningMode=DELIVERY&pl=JTdCJTIyYWRkcmVzcyUyMiUzQSUyMlNhaW50LUNoYXJsZXMlMjIlMkMlMjJyZWZlcmVuY2UlMjIlM0ElMjJDaElKdFM0Mjk1YkF5UklSb0E5Vm01SEU0SnMlMjIlMkMlMjJyZWZlcmVuY2VUeXBlJTIyJTNBJTIyZ29vZ2xlX3BsYWNlcyUyMiUyQyUyMmxhdGl0dWRlJTIyJTNBNDMuMzAyNjE1NyUyQyUyMmxvbmdpdHVkZSUyMiUzQTUuMzgwMjg0Nzk5OTk5OTk5JTdE&q=Fast%20Food&sc=SHORTCUTS');

//   let elementFound = false; // Variable pour suivre si l'élément est trouvé

//   await page.evaluate(() => {
//     const nodeList = document.querySelectorAll('[data-testid="store-card"]');
//     console.log(nodeList);

//     const buttons = document.querySelectorAll('button');
//     let showMoreButton = null;
//   buttons.forEach((button) => {
//       if (button.textContent === 'Show more') {
//       showMoreButton = button;
//   }
//   });


//     for (let i = 0; i < nodeList.length; i++) {
//       // Vérifier si l'élément a l'attribut href recherché
//       if (nodeList[i].getAttribute('href') === '/store/bsb-saint-charles/vpg41lqzRniETs8dID_nLw') {
//         // Afficher l'indice de l'élément dans la console
//         console.log('L\'élément est apparu après ' + i + ' éléments.');
//         elementFound = true;
//         break; // Sortir de la boucle une fois que l'élément est trouvé
//       }
//     }
//   });

//   if (!elementFound) {
//     console.log('L\'élément n\'a pas été trouvé.');
//   }

//   // Ferme le navigateur Puppeteer
//   await browser.close();
// }

// ranking();

