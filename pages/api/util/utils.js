
export function formatDate(s) {
  let b = s.split(/\D/);
  return b[0] + '-' + b[1] + '-' + b[2] + ' ' +
      b[3] + ':' + b[4] + ':' + b[5] + '.' +
      b[6].substr(0, 3);// + '+00:00';
}