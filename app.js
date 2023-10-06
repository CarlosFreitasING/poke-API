const card = document.querySelector('#card-pokemon');
const template = document.querySelector('#template-card').content;
const fragment = document.createDocumentFragment();

const loading = document.querySelector(".spinner");
const btnRandom = document.querySelector(".btn-random");

const btnsImg = document.querySelectorAll('.btns-imagenes-uni');
const button1 = document.getElementById('btn-1');
const button2 = document.getElementById('btn-2');
const button3 = document.getElementById('btn-3');

const typosArray = ["🍥","🔥","🌊","🍃","🌪️","🥊","☠️","⚡","⛱️","⛰️","🧿","🧊","🐞","👻","🛡️","🐉","🌑","🧚🏻"];
const typosPalabrasArray = ["normal", "fire", "water", "grass", "flying", "fighting", "poison", "electric", "ground", "rock", "psychic", "ice", "bug", "ghost", "steel", "dragon", "dark", "fairy"];
const headerColores = ["hue-rotate(40deg) invert(30%)", "hue-rotate(205deg)", "hue-rotate(40deg)", "hue-rotate(280deg)", "hue-rotate(20deg) contrast(150%) grayscale(100%)", "hue-rotate(190deg)", "hue-rotate(290deg) invert(90%) contrast(500%) grayscale(80%)", "hue-rotate(229deg)", "hue-rotate(20deg) invert(80%)", "hue-rotate(40deg) invert(100%) contrast(70%)", "hue-rotate(310deg) invert(100%) contrast(100%)", "hue-rotate(10deg)", "hue-rotate(255deg)", "hue-rotate(290deg) invert(70%)", "grayscale(100%)", "hue-rotate(250deg) invert(100%)", "grayscale(100%) invert(100%)", "hue-rotate(100deg)"];

//genera num random del 1-151
const getRandomInt = (min, max) => {
  return Math.floor(Math.random()* (max-min))+min; 
};

//main funtion - carga cuando el DOM esta cargado
document.addEventListener('DOMContentLoaded', () =>{
  button1.classList.add('active');
  button1.classList.add('disabled');
  button2.classList.add('red');
  button3.classList.add('red');
  randomVari = getRandomInt(1,152);
  fetchData(randomVari);
});

//btn random listener
document.addEventListener('click', (e) =>{
  if(e.target.dataset["random"] === "random"){ 
    btnRandom.classList.add('disabled');
    randomVari = getRandomInt(1,152);
    fetchData(randomVari);
  };
});

button1.addEventListener('click', (e) => {
  // Elimina la clase activa de todos los botones
  button1.classList.add('active');
  button1.classList.remove('red');
  button2.classList.remove('active');
  button2.classList.add('red');
  button3.classList.remove('active');
  button3.classList.add('red');
  button1.classList.add('disabled');
  button2.classList.remove('disabled');
  button3.classList.remove('disabled');
  fetchData(randomVari);
});

button2.addEventListener('click', () => {
  // Elimina la clase activa de todos los botones
  button1.classList.remove('active');
  button1.classList.add('red');
  button2.classList.add('active');
  button2.classList.remove('red');
  button3.classList.remove('active');
  button3.classList.add('red');
  button1.classList.remove('disabled');
  button2.classList.add('disabled');
  button3.classList.remove('disabled');
  fetchData(randomVari);
});

button3.addEventListener('click', () => {
  // Elimina la clase activa de todos los botones
  button1.classList.remove('active');
  button1.classList.add('red');
  button2.classList.remove('active');
  button2.classList.add('red');
  button3.classList.add('active');
  button3.classList.remove('red');
  button1.classList.remove('disabled');
  button2.classList.remove('disabled');
  button3.classList.add('disabled');
  fetchData(randomVari);
});

//busca, recupera y ordena la data en el obj pokemon
const fetchData = async (id) => {
    try {
      card.textContent = "";

      loadingData(true);
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await res.json();
      
      //recuperar el o los 2 tipos del pokemon
      const tiposPoke = data.types.map(poke => poke.type.name); //[normal, fly]
      //crea un array con los iconos correspondientes a los tipos
      const tiposPokeIcono = tiposPoke.map(palabra => {const indice = typosPalabrasArray.indexOf(palabra); //[🍥, 🌪️]
                                                        return typosArray[indice]
                                                      });
      const pokemon = {
          img: data.sprites.other["official-artwork"].front_default, //oficial art
          img2: data.sprites.other["dream_world"].front_default,  //old shool
          img3: data.sprites.versions["generation-i"]["red-blue"].front_default, //sprites  
          name: data.name, 
          id: data.id,
          xp: data.base_experience,
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat,
          spAttack: data.stats[3].base_stat,
          spDefense: data.stats[4].base_stat,
          speed: data.stats[5].base_stat,
          types: tiposPoke,
          typesIcon: tiposPokeIcono,
      };

      btnActivo() == 0? await obtenerColorPrincipal(pokemon.img) :
      btnActivo() == 1? await obtenerColorPrincipal(pokemon.img2) :
                        await obtenerColorPrincipal(pokemon.img3)
    
      pintarCard(pokemon);

      }catch (error){
        console.log(error);

      }finally {
        loadingData(false);
    }
};

//crea un clon de template y lo inserta en fragment y fragment en el card
const pintarCard = (pokemon) =>{
  console.log(pokemon);

  const clone = template.cloneNode(true);

  btnActivo() == 0? clone.querySelector('.card-body-img').setAttribute('src',pokemon.img) :
  btnActivo() == 1? clone.querySelector('.card-body-img').setAttribute('src',pokemon.img2) :
                    clone.querySelector('.card-body-img').setAttribute('src',pokemon.img3);

  clone.querySelector('.card-body-title').innerHTML = `<span>n.º${pokemon.id}</span> ${pokemon.name} `;
  clone.querySelector('.card-body-text').textContent = `${pokemon.typesIcon.flatMap((e,i)=>[e,pokemon.types[i]]).join(' ')}`;
  clone.querySelectorAll('.card-footer-social h3')[0].textContent= pokemon.hp;
  clone.querySelectorAll('.card-footer-social h3')[1].textContent= pokemon.attack;
  clone.querySelectorAll('.card-footer-social h3')[2].textContent= pokemon.defense;
  clone.querySelectorAll('.card-footer-social h3')[3].textContent= pokemon.speed;
  clone.querySelectorAll('.card-footer-social h3')[4].textContent= pokemon.spAttack;
  clone.querySelectorAll('.card-footer-social h3')[5].textContent= pokemon.spDefense;

  clone.querySelector('.card-header').style.filter = headerColores[typosPalabrasArray.indexOf(pokemon.types[0])];

  fragment.appendChild(clone);
  card.appendChild(fragment);

  btnRandom.classList.remove('disabled');
};

// revisa cual es el btn activo
const btnActivo = () => {
  let activa;
  btnsImg.forEach((btn, index) => {
    if (btn.classList.contains('active')) {
      activa = index;
    }
  });
  return activa;
};
  
// activa y desactiva el spiner
const loadingData = estado => {
  if(estado)loading.style.display = 'block';
  else loading.style.display = 'none';
};




function obtenerColorPrincipal(urlImagen) {
  console.log(urlImagen);
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.src = urlImagen;
      
          img.onload = function() {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            context.drawImage(img, 0, 0);
      
            const imageData = context.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;
      
            let r = 0, g = 0, b = 0;
            let count = 0;
      
            for (let i = 0; i < data.length; i += 4) {
              const red = data[i];
              const green = data[i + 1];
              const blue = data[i + 2];
              const alpha = data[i + 3];
      
              // Ignorar píxeles transparentes y blancos
              if (alpha === 0 || (red >= 220 && green >= 220 && blue >= 220 && red <= 240 && green <= 240 && blue <= 240)) {
                continue;
              }
      
              r += red;
              g += green;
              b += blue;
              count++;
            }
      
            if (count === 0) {
              reject('No se pudo obtener el color principal de la imagen');
            } else {
              r = Math.round(r / count);
              g = Math.round(g / count);
              b = Math.round(b / count);
              resolve([r, g, b]);

            // Aumentar la saturación del color resultante
        const hsv = rgbToHsv(r, g, b);
        const saturatedHsv = [hsv[0], hsv[1] * 1.8, hsv[2]];
        const saturatedRgb = hsvToRgb(saturatedHsv[0], saturatedHsv[1], saturatedHsv[2]);
        // console.log("saturatedRdb: ",saturatedRgb)
        document.body.style.backgroundColor = `rgb(${saturatedRgb[0]}, ${saturatedRgb[1]}, ${saturatedRgb[2]})`;
        resolve(saturatedRgb);
      }
      
      // console.log("rgb:",r,"-",g,"-",b)
      // document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    };

    img.onerror = function() {
      reject('Error al cargar la imagen');
    };
  });
}
// Función auxiliar para convertir RGB a HSV
function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, v;

  if (max === min) {
    h = 0;
  } else if (max === r) {
    h = (60 * ((g - b) / (max - min)) + 360) % 360;
  } else if (max === g) {
    h = (60 * ((b - r) / (max - min)) + 120) % 360;
  } else {
    h = (60 * ((r - g) / (max - min)) + 240) % 360;
  }

  if (max === 0) {
    s = 0;
  } else {
    s = 1 - (min / max);
  }

  v = max;

  return [h, s, v];
}
// Función auxiliar para convertir HSV a RGB
function hsvToRgb(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;
  let r, g, b;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}
      
  

