const rx = require('rxjs');

const source$ = rx.of(1, 2, 3);
source$.subscribe(console.log);