const { Observable } = require('rxjs');

const onSubscribe = observer => {
    observer.next(10);
    observer.next(20);
    observer.next(30);
};

const source2 = new Observable(onSubscribe);

const theObserber = {
    next: item => console.log(item)
}

source2.subscribe(theObserber);