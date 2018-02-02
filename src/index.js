import { Logger, logSymbols } from 'bitwane';
import { inlineDiff } from './lib/differs.js';
import indent from 'indent-string';

export { logSymbols as symbols };

export class TestLogger extends Logger {
    constructor({
        prefixes = {},
        each = null,
        diff = null
    } = {}){
        super({each});
        this.prefixes = ['ok', 'notok']
        .reduce((obj, key)=>{
            obj[key] = prefixes[key] || '';
            return obj;
        }, {});
        this._diff = diff || inlineDiff();
    }
    log(input, format = {}, dent = 0){
        return super.log(indent(input, dent), format);
    }
    error(input, format = {}, dent = 0){
        return super.error(indent(input, dent), format);
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
