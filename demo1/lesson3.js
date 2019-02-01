const { Observable } = require('rxjs');

const onSubscribe = observer => {
    let number = 1;
    const handle = setInterval(() => {
        observer.next(number * 100);
        number++;
        if (number > 3) {
            clearInterval(handle);
        }
    }, 1000);
};

const source2 = new Observable(onSubscribe);

const theObserber = {
    next: item => console.log(item)
}

source2.subscribe(theObserber);