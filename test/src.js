import { TestLogger, symbols,  } from '../';
const logger = new TestLogger({
    prefixes: {
        ok: symbols.success + ' ',
        notok: symbols.error + ' '
    }
});

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

logger.diff(`I am thing one`, `I am thing two`)
logger.diff(`I am a thing one`, `I am thing two`, 4)

logger.ok('This is ok', null, 8);
logger.notok('This is not ok');
