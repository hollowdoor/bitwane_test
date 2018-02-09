bitwane-test
===

A test output version of [bitwane](https://github.com/hollowdoor/bitwane).

Install
---

`npm install bitwane-test`

Usage
---

```javascript
import { TestLogger } from '../';
const logger = new TestLogger();

//Print a diff of an object
logger.diff({
    one: 1,
    two: 2,
    thing: 'thing1',
    sub: {
        subone: 1,
        subtwo: 2
    }
}, {
    one: 1,
    three: 'three',
    thing: 'thing2',
    sub: {
        subone: 1
    }
});

//Print a diff a string.
logger.diff(`I am thing one`, `I am thing two`)
//Print a diff a string, and indent it.
logger.diff(`I am a thing one`, `I am thing two`, 4)

//Print an ok (log) line, and indent it 8 spaces.
logger.ok('This is ok', null, 8);
//Print a notok (error) line.
logger.notok('This is not ok');
//Print an formatted ok line with a red colored word.
logger.ok('The $(red)%(what)$() is red.', {what: 'moon'});

```

### The constructor

The constructor takes the same options as [bitwane](https://github.com/hollowdoor/bitwane) with an extra option named `maps`.

```javascript
const logger = new TestLogger({
    //These are all default values
    maps: {
        ok(value){
            return logSymbols.success + ' ' + value;
        },
        notok(value){
            return logSymbols.error + ' ' + value;
        },
        diff(lvalue, rvalue, indent){
            //Return a diff string
            //An inline diff is the default
        }
    }
});
```

About
---

`bitwane-test` inherits from [bitwane](https://github.com/hollowdoor/bitwane). It is meant for formatting test output.
