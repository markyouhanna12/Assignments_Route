function createCounter(init){
    let present = init;
    return {
        increment: () => console.log(++present),
        decrement: () => console.log(--present),
        reset:() => console.log(present = init)
    }
}



let counter = createCounter(0);

counter.increment();
counter.increment();
counter.decrement();
counter.reset();
counter.reset();

