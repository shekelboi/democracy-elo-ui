// Map 3-letter country codes to 2-letter (for flag filenames)
const ID_TO_FLAG = {
  usa: 'us', fra: 'fr', gbr: 'gb', deu: 'de', rus: 'ru', chn: 'cn', jpn: 'jp',
  ind: 'in', bra: 'br', can: 'ca', aus: 'au', kor: 'kr', esp: 'es', ita: 'it',
  nld: 'nl', bel: 'be', che: 'ch', aut: 'at', swe: 'se', nor: 'no', fin: 'fi',
  dnk: 'dk', pol: 'pl', prt: 'pt', grc: 'gr', tur: 'tr', arg: 'ar', mex: 'mx',
  zaf: 'za', egy: 'eg', sau: 'sa', irn: 'ir', pak: 'pk', tha: 'th', vnm: 'vn',
  phl: 'ph', mys: 'my', sgp: 'sg', idn: 'id', nzl: 'nz', irl: 'ie', hun: 'hu',
  rou: 'ro', cze: 'cz', ukr: 'ua', isr: 'il', col: 'co', per: 'pe', chl: 'cl',
};

export function getFlagPath(countryId) {
  const lower = (countryId || '').toLowerCase();
  const code = ID_TO_FLAG[lower] || lower;
  return `/flags/${code}.svg`;
}
