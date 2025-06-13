// 📌 Milestone 1
// Crea un type alias Person per rappresentare una persona generica.

// Il tipo deve includere le seguenti proprietà:

// id: numero identificativo, non modificabile
// name: nome completo, stringa non modificabile
// birth_year: anno di nascita, numero
// death_year: anno di morte, numero opzionale
// biography: breve biografia, stringa
// image: URL dell'immagine, stringa

// 📌 Milestone 2
// Crea un type alias Actress che oltre a tutte le proprietà di Person, aggiunge le seguenti proprietà:

// most_famous_movies: una tuple di 3 stringhe
// awards: una stringa
// nationality: una stringa tra un insieme definito di valori.
// Le nazionalità accettate sono: American, British, Australian, Israeli-American, South African, French, Indian, Israeli, Spanish, South Korean, Chinese.

// 📌 Milestone 3
// Crea una funzione getActress che, dato un id, effettua una chiamata a:

// GET /actresses/:id
// La funzione deve restituire l’oggetto Actress, se esiste, oppure null se non trovato.

// Utilizza un type guard chiamato isActress per assicurarti che la struttura del dato ricevuto sia corretta.

// 📌 Milestone 4
// Crea una funzione getAllActresses che chiama:

// GET /actresses
// La funzione deve restituire un array di oggetti Actress.

// Può essere anche un array vuoto.

type Person = {
  readonly id: number,
  readonly name: string,
  birth_year: number,
  death_year?: number,
  biography: string,
  image: string
}

type Nationality =
  | "American"
  | "British"
  | "Australian"
  | "Israeli-American"
  | "South"
  | "African"
  | "French"
  | "Indian"
  | "Israeli"
  | "Spanish"
  | "South"
  | "Korean"
  | "Chinese"

type Actress = Person & {
  most_famous_movies: [string, string, string],
  awards: string,
  nationality: Nationality
}

function isActress(dato: unknown): dato is Actress {
  return (
    typeof dato === 'object' && dato !== null &&
    "id" in dato && typeof dato.id === 'number' &&
    "name" in dato && typeof dato.name === 'string' &&
    "birth_year" in dato && typeof dato.birth_year === 'number' &&
    "death_year" in dato && typeof dato.death_year === 'number' &&
    "biography" in dato && typeof dato.biography === 'string' &&
    "image" in dato && typeof dato.image === 'string' &&
    "most_famous_movies" in dato &&
    dato.most_famous_movies instanceof Array &&
    dato.most_famous_movies.length === 3 &&
    dato.most_famous_movies.every(m => typeof m === 'string') &&
    "awards" in dato && typeof dato.awards === 'string' &&
    "nationality" in dato && typeof dato.nationality === 'string'
  )
}

async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`http://localhost:3333/actresses/${id}`);
    const dato: unknown = await response.json();
    if (!isActress(dato)) {
      throw new Error('Formato dati non valido');
    }
    return dato;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore non riesco a recuperare l\'attrice:', error);
    } else {
      console.error('Errore sconosciuto:', error);
    }
    return null;
  }
}

async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch(`http://localhost:3333/actresses`);
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
    }
    const dato: unknown = await response.json();

    if (!(dato instanceof Array)) {
      throw new Error('Formato dati non valido: deve essere un Array!');
    }

    const attriciValide: Actress[] = dato.filter(actress => isActress(actress));
    return attriciValide;

  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore non riesco a recuperare le attrici:', error);
    } else {
      console.error('Errore sconosciuto:', error);
    }
    return [];
  }
}