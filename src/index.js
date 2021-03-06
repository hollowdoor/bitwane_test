import { Logger, logSymbols } from 'bitwane';
import { inlineDiff } from './lib/differs.js';
import { IN_BROWSER } from 'uni-compat';

export { logSymbols as symbols };

const defaultMaps = {
    ok(value){
        return logSymbols.success + ' ' + value;
    },
    notok(value){
        return logSymbols.error + ' ' + value;
    },
    diff: inlineDiff()
};

export class TestLogger extends Logger {
    constructor({
        maps = {},
        diff = inlineDiff(),
        each = undefined,
        every = undefined,
        indentLength = 2
    } = {}){
        super({each, every, indentLength});
        this._maps = ['ok', 'notok', 'diff']
        .reduce((obj, key)=>{
            obj[key] = maps[key] || defaultMaps[key];
            return obj;
        }, {});
        this._diff = diff;
    }
    ok(input, format = {}, dent = 0){
        return this.log(this._maps.ok(input), format, dent);
    }
    diff(expected, actual, dent = 0, {
        type = 'log'
    } = {}){

        let lines = this._maps.diff(expected, actual, dent * this.indentLength);

        lines.map(line=>{
            super[type](line);
            return line;
        });
    }
}

TestLogger.prototype.notok = IN_BROWSER
? function(input, format = {}, dent = 0){
    return this.log(this._maps.notok(input), format, dent);
}
: function(input, format = {}, dent = 0){
    return this.error(this._maps.notok(input), format, dent);
};
