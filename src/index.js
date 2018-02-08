import { Logger, logSymbols } from 'bitwane';
import { inlineDiff } from './lib/differs.js';

export { logSymbols as symbols };

export class TestLogger extends Logger {
    constructor({
        prefixes = {},
        diff = inlineDiff(),
        each = undefined,
        every = undefined
    } = {}){
        super({each, every});
        this.prefixes = ['ok', 'notok']
        .reduce((obj, key)=>{
            obj[key] = prefixes[key] || '';
            return obj;
        }, {});
        this._diff = diff;
    }
    ok(input, format = {}, dent = 0){
        return this.log(this.prefixes.ok + input, format, dent);
    }
    notok(input, format = {}, dent = 0){
        return this.error(this.prefixes.notok + input, format, dent);
    }
    diff(expected, actual, dent){
        let lines = this._diff(expected, actual, dent);

        lines.map(line=>{
            super.log(line);
            return line;
        });
    }
}
